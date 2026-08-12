using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StaySphere.Application.Features.Favorites.DTOs;

namespace StaySphere.Application.Common.Interfaces
{
    public interface IFavoriteService
    {
        Task<FavoriteResponse> AddFavoriteAsync(Guid hotelId, Guid userId);
        Task RemoveFavoriteAsync(Guid hotelId, Guid userId);
        Task<IEnumerable<FavoriteResponse>> GetUserFavoritesAsync(Guid userId);
    }
}
