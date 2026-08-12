using System;
using System.Collections.Generic;
using StaySphere.Domain.Enums;

namespace StaySphere.Application.Features.Rooms.DTOs
{
    public record CreateRoomRequest(
        string RoomNumber,
        string RoomType,
        int Capacity,
        decimal PricePerNight,
        int Floor,
        List<string> Amenities
    );

    public record UpdateRoomRequest(
        string RoomNumber,
        string RoomType,
        int Capacity,
        decimal PricePerNight,
        RoomStatus Status,
        int Floor,
        List<string> Amenities
    );

    public record RoomResponse(
        Guid Id,
        string RoomNumber,
        string RoomType,
        int Capacity,
        decimal PricePerNight,
        RoomStatus Status,
        int Floor,
        Guid HotelId,
        List<string> Amenities,
        List<string> ImageUrls,
        DateTime CreatedAtUtc
    );
}
