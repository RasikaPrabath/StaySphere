using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Search.DTOs;
using StaySphere.Domain.Enums;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    public class SearchService : ISearchService
    {
        private readonly StaySphereDbContext _context;
        private readonly ICacheService _cacheService;

        public SearchService(StaySphereDbContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        public async Task<HotelSearchResponse> SearchHotelsAsync(HotelSearchRequest request)
        {
            // Build Redis cache key
            var cityKey = request.City?.Replace(" ", "_").ToLower() ?? "any";
            var countryKey = request.Country?.Replace(" ", "_").ToLower() ?? "any";
            var cacheKey = $"search:city:{cityKey}:country:{countryKey}:minprice:{request.MinPrice}:maxprice:{request.MaxPrice}:rating:{request.MinRating}:sort:{request.SortBy}";

            try
            {
                // Attempt to fetch from Redis cache
                var cachedResult = await _cacheService.GetAsync<HotelSearchResponse>(cacheKey);
                if (cachedResult != null)
                {
                    return new HotelSearchResponse(cachedResult.Items, cachedResult.TotalCount, "Cache");
                }
            }
            catch (Exception)
            {
                // Suppress cache server failures to maintain high availability database failover
            }

            // Database Query Execution
            var query = _context.Hotels
                .Include(h => h.Rooms)
                .Where(h => h.ApprovalStatus == HotelApprovalStatus.Approved)
                .AsQueryable();

            // Filters
            if (!string.IsNullOrEmpty(request.City))
            {
                query = query.Where(h => h.City.ToLower() == request.City.ToLower());
            }

            if (!string.IsNullOrEmpty(request.Country))
            {
                query = query.Where(h => h.Country.ToLower() == request.Country.ToLower());
            }

            if (request.MinRating.HasValue)
            {
                query = query.Where(h => h.StarRating >= request.MinRating.Value);
            }

            // Exclude hotels without rooms
            query = query.Where(h => h.Rooms.Any(r => r.Status == RoomStatus.Available));

            // Fetch and map to items with MinRoomPrice calculation
            var dbItems = await query.ToListAsync();

            var searchItems = dbItems.Select(h =>
            {
                var minPrice = h.Rooms
                    .Where(r => r.Status == RoomStatus.Available)
                    .Select(r => r.PricePerNight)
                    .DefaultIfEmpty(0)
                    .Min();

                return new SearchResultItem(
                    h.Id,
                    h.Name,
                    h.Description,
                    h.Address,
                    h.City,
                    h.Country,
                    h.StarRating,
                    minPrice,
                    h.ImageUrls,
                    h.Amenities
                );
            }).ToList();

            // Price filtering
            if (request.MinPrice.HasValue)
            {
                searchItems = searchItems.Where(i => i.MinRoomPrice >= request.MinPrice.Value).ToList();
            }

            if (request.MaxPrice.HasValue)
            {
                searchItems = searchItems.Where(i => i.MinRoomPrice <= request.MaxPrice.Value).ToList();
            }

            // Sort logic
            searchItems = request.SortBy?.ToLower() switch
            {
                "pricelowtohigh" => searchItems.OrderBy(i => i.MinRoomPrice).ToList(),
                "pricehightolow" => searchItems.OrderByDescending(i => i.MinRoomPrice).ToList(),
                "rating" => searchItems.OrderByDescending(i => i.StarRating).ToList(),
                _ => searchItems.OrderByDescending(i => i.StarRating).ToList() // Recommended default
            };

            var finalResponse = new HotelSearchResponse(searchItems, searchItems.Count, "Database");

            try
            {
                // Save to Redis distributed cache with 5-minute expiration
                await _cacheService.SetAsync(cacheKey, finalResponse, TimeSpan.FromMinutes(5));
            }
            catch (Exception)
            {
                // Suppress cache set failures
            }

            return finalResponse;
        }
    }
}
