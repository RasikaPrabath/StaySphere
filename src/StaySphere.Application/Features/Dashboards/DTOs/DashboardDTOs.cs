using System;
using System.Collections.Generic;

namespace StaySphere.Application.Features.Dashboards.DTOs
{
    public record RecentBookingItem(
        Guid BookingId,
        string BookingReference,
        string CustomerName,
        string HotelName,
        string RoomNumber,
        DateTime CheckInDate,
        DateTime CheckOutDate,
        decimal TotalAmount,
        string Status
    );

    public record AdminDashboardResponse(
        int TotalUsers,
        int TotalHotels,
        decimal TotalRevenue,
        int ActiveBookingsCount,
        IEnumerable<RecentBookingItem> RecentBookings
    );

    public record OwnerDashboardResponse(
        int TotalOwnedHotels,
        decimal TotalRevenueEarned,
        int ActiveBookingsCount,
        double OccupancyRate,
        IEnumerable<RecentBookingItem> RecentBookings
    );

    public record StaffDashboardResponse(
        Guid HotelId,
        string HotelName,
        int TotalRooms,
        int AvailableRoomsCount,
        int MaintenanceRoomsCount,
        int OccupiedRoomsCount,
        int CheckInsToday,
        int CheckOutsToday
    );
}
