using System;
using System.Collections.Generic;
using StaySphere.Domain.Enums;

namespace StaySphere.Application.Features.Hotels.DTOs
{
    public record CreateHotelRequest(
        string Name,
        string Description,
        string Address,
        string City,
        string Country,
        double Latitude,
        double Longitude,
        string ContactNumber,
        string ContactEmail,
        List<string> Amenities
    );

    public record UpdateHotelRequest(
        string Name,
        string Description,
        string Address,
        string City,
        string Country,
        double Latitude,
        double Longitude,
        string ContactNumber,
        string ContactEmail,
        List<string> Amenities
    );

    public record HotelResponse(
        Guid Id,
        string Name,
        string Description,
        string Address,
        string City,
        string Country,
        double Latitude,
        double Longitude,
        string ContactNumber,
        string ContactEmail,
        double StarRating,
        HotelApprovalStatus ApprovalStatus,
        Guid OwnerId,
        List<string> ImageUrls,
        List<string> Amenities,
        DateTime CreatedAtUtc
    );

    public record HotelApprovalRequest(
        HotelApprovalStatus Status,
        string? RejectionReason
    );
}
