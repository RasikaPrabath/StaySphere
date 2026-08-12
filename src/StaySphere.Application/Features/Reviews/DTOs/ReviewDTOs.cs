using System;
using StaySphere.Domain.Enums;

namespace StaySphere.Application.Features.Reviews.DTOs
{
    public record CreateReviewRequest(
        Guid HotelId,
        int Rating,        // 1–5
        string Comment
    );

    public record ReviewResponse(
        Guid Id,
        int Rating,
        string Comment,
        string? AiSentiment,
        Guid UserId,
        Guid HotelId,
        DateTime CreatedAtUtc
    );
}
