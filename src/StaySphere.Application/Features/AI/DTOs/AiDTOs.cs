using System;
using System.Collections.Generic;
using StaySphere.Application.Features.Search.DTOs;

namespace StaySphere.Application.Features.AI.DTOs
{
    public record ChatRequest(string Message);

    public record ChatResponse(
        string Message,
        IEnumerable<SearchResultItem> SuggestedHotels
    );

    public record RecommendationRequest(
        Guid UserId,
        string? PreferredCity
    );
}
