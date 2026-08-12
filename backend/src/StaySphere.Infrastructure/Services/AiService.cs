using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.AI.DTOs;
using StaySphere.Application.Features.Search.DTOs;
using StaySphere.Domain.Enums;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    public class AiService : IAiService
    {
        private readonly StaySphereDbContext _context;

        public AiService(StaySphereDbContext context)
        {
            _context = context;
        }

        public async Task<ChatResponse> ChatWithAssistantAsync(ChatRequest request, Guid userId)
        {
            var messageText = request.Message.ToLower();

            // Fetch approved hotels with rooms
            var hotelsQuery = _context.Hotels
                .Include(h => h.Rooms)
                .Where(h => h.ApprovalStatus == HotelApprovalStatus.Approved)
                .AsQueryable();

            // Rule-based keyword matching (simulating local semantic search)
            bool searchByCity = false;
            string matchedCity = "";

            if (messageText.Contains("colombo"))
            {
                searchByCity = true;
                matchedCity = "colombo";
            }
            else if (messageText.Contains("galle"))
            {
                searchByCity = true;
                matchedCity = "galle";
            }
            else if (messageText.Contains("kandy"))
            {
                searchByCity = true;
                matchedCity = "kandy";
            }

            if (searchByCity)
            {
                hotelsQuery = hotelsQuery.Where(h => h.City.ToLower() == matchedCity);
            }

            // Amenity matching
            if (messageText.Contains("pool") || messageText.Contains("swimming"))
            {
                hotelsQuery = hotelsQuery.Where(h => h.Amenities.Any(a => a.ToLower().Contains("pool")));
            }
            if (messageText.Contains("beach") || messageText.Contains("sea"))
            {
                hotelsQuery = hotelsQuery.Where(h => h.Amenities.Any(a => a.ToLower().Contains("beach") || a.ToLower().Contains("ocean")));
            }
            if (messageText.Contains("wifi") || messageText.Contains("internet"))
            {
                hotelsQuery = hotelsQuery.Where(h => h.Amenities.Any(a => a.ToLower().Contains("wifi") || a.ToLower().Contains("internet")));
            }

            var matchingHotels = await hotelsQuery.Take(3).ToListAsync();

            var suggestedItems = matchingHotels.Select(h =>
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

            // Construct Response message
            string responseMsg = "Hello! I am your StaySphere Assistant. How can I help you today?";

            if (suggestedItems.Any())
            {
                var hotelNames = string.Join(", ", suggestedItems.Select(s => s.Name));
                responseMsg = $"I found some great options for you! Here are some of the best matches I found: {hotelNames}. Let me know if you would like me to help you book one of these.";
            }
            else
            {
                if (searchByCity)
                {
                    responseMsg = $"I couldn't find any approved hotels in {char.ToUpper(matchedCity[0]) + matchedCity.Substring(1)} matching your criteria at the moment. Try searching for other popular destinations!";
                }
                else if (messageText.Contains("help") || messageText.Contains("hi") || messageText.Contains("hello"))
                {
                    responseMsg = "Hello! I am StaySphere's virtual travel concierge. Tell me where you want to travel (e.g., 'Colombo' or 'Galle') and what amenities you want (like 'pool' or 'wifi'), and I will find the perfect hotel for you!";
                }
                else
                {
                    responseMsg = "I'm here to help you find the best hotels. Tell me which city you're planning to visit, or ask about hotels with features like a swimming pool or beach access!";
                }
            }

            return new ChatResponse(responseMsg, suggestedItems);
        }
    }
}
