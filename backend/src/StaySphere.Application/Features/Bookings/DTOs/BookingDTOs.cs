using System;
using StaySphere.Domain.Enums;

namespace StaySphere.Application.Features.Bookings.DTOs
{
    public record CreateBookingRequest(
        Guid RoomId,
        DateTime CheckInDate,
        DateTime CheckOutDate,
        int GuestCount
    );

    public record BookingResponse(
        Guid Id,
        string BookingReference,
        DateTime CheckInDate,
        DateTime CheckOutDate,
        int GuestCount,
        decimal TotalAmount,
        BookingStatus Status,
        Guid UserId,
        Guid RoomId,
        DateTime CreatedAtUtc
    );
}
