using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Dashboards.DTOs;
using StaySphere.Domain.Enums;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly StaySphereDbContext _context;

        public DashboardService(StaySphereDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardResponse> GetAdminDashboardAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalHotels = await _context.Hotels.CountAsync();
            
            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.Completed)
                .SumAsync(b => b.TotalAmount);

            var activeBookingsCount = await _context.Bookings
                .CountAsync(b => b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed);

            var recentBookingsDb = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Room)
                .ThenInclude(r => r!.Hotel)
                .OrderByDescending(b => b.CreatedAtUtc)
                .Take(10)
                .ToListAsync();

            var recentBookings = recentBookingsDb.Select(b => new RecentBookingItem(
                b.Id,
                b.BookingReference,
                b.User != null ? $"{b.User.FirstName} {b.User.LastName}" : "Unknown Customer",
                b.Room?.Hotel?.Name ?? "Unknown Hotel",
                b.Room?.RoomNumber ?? "N/A",
                b.CheckInDate,
                b.CheckOutDate,
                b.TotalAmount,
                b.Status.ToString()
            ));

            return new AdminDashboardResponse(
                totalUsers,
                totalHotels,
                totalRevenue,
                activeBookingsCount,
                recentBookings
            );
        }

        public async Task<OwnerDashboardResponse> GetOwnerDashboardAsync(Guid ownerId)
        {
            var ownedHotelIds = await _context.Hotels
                .Where(h => h.OwnerId == ownerId)
                .Select(h => h.Id)
                .ToListAsync();

            var totalOwnedHotels = ownedHotelIds.Count;

            var totalRevenueEarned = await _context.Bookings
                .Where(b => ownedHotelIds.Contains(b.Room!.HotelId) && 
                            (b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.Completed))
                .SumAsync(b => b.TotalAmount);

            var activeBookingsCount = await _context.Bookings
                .CountAsync(b => ownedHotelIds.Contains(b.Room!.HotelId) &&
                                 (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed));

            // Occupancy rate = occupied rooms / total rooms in owned hotels
            var totalRoomsCount = await _context.Rooms
                .CountAsync(r => ownedHotelIds.Contains(r.HotelId));

            var occupiedRoomsCount = await _context.Rooms
                .CountAsync(r => ownedHotelIds.Contains(r.HotelId) && r.Status == RoomStatus.Occupied);

            double occupancyRate = totalRoomsCount > 0 
                ? Math.Round(((double)occupiedRoomsCount / totalRoomsCount) * 100, 2)
                : 0.0;

            var recentBookingsDb = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Room)
                .ThenInclude(r => r!.Hotel)
                .Where(b => ownedHotelIds.Contains(b.Room!.HotelId))
                .OrderByDescending(b => b.CreatedAtUtc)
                .Take(10)
                .ToListAsync();

            var recentBookings = recentBookingsDb.Select(b => new RecentBookingItem(
                b.Id,
                b.BookingReference,
                b.User != null ? $"{b.User.FirstName} {b.User.LastName}" : "Unknown Customer",
                b.Room?.Hotel?.Name ?? "Unknown Hotel",
                b.Room?.RoomNumber ?? "N/A",
                b.CheckInDate,
                b.CheckOutDate,
                b.TotalAmount,
                b.Status.ToString()
            ));

            return new OwnerDashboardResponse(
                totalOwnedHotels,
                totalRevenueEarned,
                activeBookingsCount,
                occupancyRate,
                recentBookings
            );
        }

        public async Task<StaffDashboardResponse> GetStaffDashboardAsync(Guid hotelId)
        {
            var hotel = await _context.Hotels.FindAsync(hotelId);
            var hotelName = hotel?.Name ?? "Unknown Hotel";

            var totalRooms = await _context.Rooms.CountAsync(r => r.HotelId == hotelId);
            var availableRooms = await _context.Rooms.CountAsync(r => r.HotelId == hotelId && r.Status == RoomStatus.Available);
            var maintenanceRooms = await _context.Rooms.CountAsync(r => r.HotelId == hotelId && r.Status == RoomStatus.Maintenance);
            var occupiedRooms = await _context.Rooms.CountAsync(r => r.HotelId == hotelId && r.Status == RoomStatus.Occupied);

            var today = DateTime.UtcNow.Date;

            var checkInsToday = await _context.Bookings
                .CountAsync(b => b.Room!.HotelId == hotelId && 
                                 b.Status == BookingStatus.Confirmed && 
                                 b.CheckInDate.Date == today);

            var checkOutsToday = await _context.Bookings
                .CountAsync(b => b.Room!.HotelId == hotelId && 
                                 (b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.Completed) && 
                                 b.CheckOutDate.Date == today);

            return new StaffDashboardResponse(
                hotelId,
                hotelName,
                totalRooms,
                availableRooms,
                maintenanceRooms,
                occupiedRooms,
                checkInsToday,
                checkOutsToday
            );
        }
    }
}
