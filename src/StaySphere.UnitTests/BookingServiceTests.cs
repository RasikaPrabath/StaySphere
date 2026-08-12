using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Bookings.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Domain.Enums;
using StaySphere.Infrastructure.Persistence;
using StaySphere.Infrastructure.Services;
using Xunit;

namespace StaySphere.UnitTests
{
    public class BookingServiceTests : IDisposable
    {
        private readonly StaySphereDbContext _context;
        private readonly Mock<ICacheService> _cacheServiceMock;
        private readonly BookingService _bookingService;

        public BookingServiceTests()
        {
            var options = new DbContextOptionsBuilder<StaySphereDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options;

            _context = new StaySphereDbContext(options);
            _cacheServiceMock = new Mock<ICacheService>();

            _bookingService = new BookingService(_context, _cacheServiceMock.Object);
        }

        [Fact]
        public async Task CreateBookingAsync_ShouldThrowException_WhenDatesOverlapWithExistingBooking()
        {
            // Arrange
            var roomId = Guid.NewGuid();
            var userId = Guid.NewGuid();

            // Pre-populate room
            var room = new Room
            {
                Id = roomId,
                RoomNumber = "101",
                PricePerNight = 100,
                Status = RoomStatus.Available,
                HotelId = Guid.NewGuid()
            };
            _context.Rooms.Add(room);

            // Pre-populate existing booking for dates 2026-09-10 to 2026-09-15
            var existingBooking = new Booking
            {
                RoomId = roomId,
                UserId = userId,
                CheckInDate = new DateTime(2026, 9, 10),
                CheckOutDate = new DateTime(2026, 9, 15),
                Status = BookingStatus.Confirmed,
                BookingReference = "BK-EXIST"
            };
            _context.Bookings.Add(existingBooking);
            await _context.SaveChangesAsync();

            // Overlapping request: 2026-09-12 to 2026-09-18
            var overlapRequest = new CreateBookingRequest(
                roomId,
                new DateTime(2026, 9, 12),
                new DateTime(2026, 9, 18),
                2
            );

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _bookingService.CreateBookingAsync(overlapRequest, userId));
        }

        [Fact]
        public async Task CreateBookingAsync_ShouldSucceed_WhenDatesDoNotOverlap()
        {
            // Arrange
            var roomId = Guid.NewGuid();
            var userId = Guid.NewGuid();

            var room = new Room
            {
                Id = roomId,
                RoomNumber = "102",
                PricePerNight = 150,
                Status = RoomStatus.Available,
                HotelId = Guid.NewGuid()
            };
            _context.Rooms.Add(room);

            var existingBooking = new Booking
            {
                RoomId = roomId,
                UserId = userId,
                CheckInDate = new DateTime(2026, 9, 10),
                CheckOutDate = new DateTime(2026, 9, 15),
                Status = BookingStatus.Confirmed,
                BookingReference = "BK-EXIST"
            };
            _context.Bookings.Add(existingBooking);
            await _context.SaveChangesAsync();

            // Request for non-overlapping dates: 2026-09-16 to 2026-09-20
            var request = new CreateBookingRequest(
                roomId,
                new DateTime(2026, 9, 16),
                new DateTime(2026, 9, 20),
                2
            );

            // Act
            var result = await _bookingService.CreateBookingAsync(request, userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(BookingStatus.Pending, result.Status);
            Assert.Equal(600m, result.TotalAmount); // 4 nights * 150
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
