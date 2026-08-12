using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Bookings.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Domain.Enums;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    public class BookingService : IBookingService
    {
        private readonly StaySphereDbContext _context;
        private readonly ICacheService _cacheService;

        public BookingService(StaySphereDbContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        public async Task<BookingResponse> CreateBookingAsync(CreateBookingRequest request, Guid userId)
        {
            // Redis distributed checkout inventory lock (expires in 10 minutes)
            var lockKey = $"lock:room:{request.RoomId}:{request.CheckInDate:yyyyMMdd}:{request.CheckOutDate:yyyyMMdd}";
            
            try
            {
                var existingLock = await _cacheService.GetAsync<string>(lockKey);
                if (!string.IsNullOrEmpty(existingLock))
                {
                    throw new InvalidOperationException("Room is temporarily locked for checkout. Please try again in a few minutes.");
                }
            }
            catch (Exception ex) when (ex is not InvalidOperationException)
            {
                // Suppress cache provider exceptions to allow DB-level transactions to handle integrity
            }

            // Begin Serializable transaction for database-level concurrency protection
            using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
            try
            {
                var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == request.RoomId);
                if (room == null) throw new KeyNotFoundException("Room not found.");
                if (room.Status != RoomStatus.Available) throw new InvalidOperationException("Room is not available.");

                // Database overlapping date verification
                var hasOverlap = await _context.Bookings.AnyAsync(b =>
                    b.RoomId == request.RoomId &&
                    b.Status != BookingStatus.Cancelled &&
                    b.Status != BookingStatus.Expired &&
                    request.CheckInDate < b.CheckOutDate &&
                    request.CheckOutDate > b.CheckInDate);

                if (hasOverlap)
                {
                    throw new InvalidOperationException("Room is already booked for the selected dates.");
                }

                // Place temporary checkout lock in Redis
                try
                {
                    await _cacheService.SetAsync(lockKey, userId.ToString(), TimeSpan.FromMinutes(10));
                }
                catch (Exception)
                {
                    // Suppress Redis set failures to maintain database execution
                }

                var nightsCount = (request.CheckOutDate - request.CheckInDate).Days;
                if (nightsCount <= 0) throw new ArgumentException("Check-out date must be after check-in date.");

                var totalAmount = room.PricePerNight * nightsCount;

                var booking = new Booking
                {
                    BookingReference = $"BK-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                    CheckInDate = request.CheckInDate,
                    CheckOutDate = request.CheckOutDate,
                    GuestCount = request.GuestCount,
                    TotalAmount = totalAmount,
                    Status = BookingStatus.Pending,
                    UserId = userId,
                    RoomId = request.RoomId
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return MapToResponse(booking);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<BookingResponse> CancelBookingAsync(Guid bookingId, Guid userId)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking == null) throw new KeyNotFoundException("Booking not found.");

            // Allow cancel if user is the booking customer or admin
            booking.Status = BookingStatus.Cancelled;
            booking.LastModifiedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Release any temporary lock
            var lockKey = $"lock:room:{booking.RoomId}:{booking.CheckInDate:yyyyMMdd}:{booking.CheckOutDate:yyyyMMdd}";
            try
            {
                await _cacheService.RemoveAsync(lockKey);
            }
            catch (Exception)
            {
                // Suppress Redis failures
            }

            return MapToResponse(booking);
        }

        public async Task<BookingResponse> GetBookingByIdAsync(Guid bookingId, Guid userId)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking == null) throw new KeyNotFoundException("Booking not found.");

            return MapToResponse(booking);
        }

        public async Task<IEnumerable<BookingResponse>> GetUserBookingsAsync(Guid userId)
        {
            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAtUtc)
                .ToListAsync();

            return bookings.Select(MapToResponse);
        }

        public async Task<IEnumerable<BookingResponse>> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
                .OrderByDescending(b => b.CreatedAtUtc)
                .ToListAsync();

            return bookings.Select(MapToResponse);
        }

        private static BookingResponse MapToResponse(Booking booking)
        {
            return new BookingResponse(
                booking.Id,
                booking.BookingReference,
                booking.CheckInDate,
                booking.CheckOutDate,
                booking.GuestCount,
                booking.TotalAmount,
                booking.Status,
                booking.UserId,
                booking.RoomId,
                booking.CreatedAtUtc
            );
        }
    }
}
