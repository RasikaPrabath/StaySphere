using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Favorites.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly StaySphereDbContext _context;

        public FavoriteService(StaySphereDbContext context)
        {
            _context = context;
        }

        public async Task<FavoriteResponse> AddFavoriteAsync(Guid hotelId, Guid userId)
        {
            var hotel = await _context.Hotels.FindAsync(hotelId);
            if (hotel == null) throw new KeyNotFoundException("Hotel not found.");

            var alreadySaved = await _context.Favorites
                .AnyAsync(f => f.HotelId == hotelId && f.UserId == userId);
            if (alreadySaved)
                throw new InvalidOperationException("Hotel is already in your favorites.");

            var favorite = new Favorite
            {
                UserId = userId,
                HotelId = hotelId
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return new FavoriteResponse(favorite.Id, hotel.Id, hotel.Name, hotel.City, favorite.CreatedAtUtc);
        }

        public async Task RemoveFavoriteAsync(Guid hotelId, Guid userId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.HotelId == hotelId && f.UserId == userId);
            if (favorite == null) throw new KeyNotFoundException("Favorite not found.");

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<FavoriteResponse>> GetUserFavoritesAsync(Guid userId)
        {
            var favorites = await _context.Favorites
                .Include(f => f.Hotel)
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAtUtc)
                .ToListAsync();

            return favorites.Select(f => new FavoriteResponse(
                f.Id, f.HotelId, f.Hotel!.Name, f.Hotel!.City, f.CreatedAtUtc));
        }
    }
}
