using System;

namespace StaySphere.Application.Features.Favorites.DTOs
{
    public record AddFavoriteRequest(Guid HotelId);

    public record FavoriteResponse(
        Guid Id,
        Guid HotelId,
        string HotelName,
        string HotelCity,
        DateTime AddedAtUtc
    );
}
