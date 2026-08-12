using System;
using System.Collections.Generic;

namespace StaySphere.Application.Features.Search.DTOs
{
    public record HotelSearchRequest(
        string? City,
        string? Country,
        DateTime? CheckIn,
        DateTime? CheckOut,
        int Guests = 2,
        decimal? MinPrice = null,
        decimal? MaxPrice = null,
        double? MinRating = null,
        string? SortBy = "Recommended"
    );

    public record SearchResultItem(
        Guid Id,
        string Name,
        string Description,
        string Address,
        string City,
        string Country,
        double StarRating,
        decimal MinRoomPrice,
        List<string> ImageUrls,
        List<string> Amenities
    );

    public record HotelSearchResponse(
        IEnumerable<SearchResultItem> Items,
        int TotalCount,
        string Source // "Cache" or "Database" for audit visibility
    );
}
