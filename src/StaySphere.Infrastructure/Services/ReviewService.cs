using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Reviews.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    public class ReviewService : IReviewService
    {
        private readonly StaySphereDbContext _context;

        public ReviewService(StaySphereDbContext context)
        {
            _context = context;
        }

        public async Task<ReviewResponse> CreateReviewAsync(CreateReviewRequest request, Guid userId)
        {
            if (request.Rating < 1 || request.Rating > 5)
                throw new ArgumentException("Rating must be between 1 and 5.");

            var hotel = await _context.Hotels.FindAsync(request.HotelId);
            if (hotel == null) throw new KeyNotFoundException("Hotel not found.");

            // Prevent duplicate review per user per hotel
            var existing = await _context.Reviews
                .AnyAsync(r => r.HotelId == request.HotelId && r.UserId == userId);
            if (existing)
                throw new InvalidOperationException("You have already reviewed this hotel.");

            // Simple AI sentiment based on rating (replace with real AI call in production)
            var sentiment = request.Rating >= 4 ? "Positive" : request.Rating == 3 ? "Neutral" : "Negative";

            var review = new Review
            {
                Rating = request.Rating,
                Comment = request.Comment,
                AiSentiment = sentiment,
                UserId = userId,
                HotelId = request.HotelId
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return MapToResponse(review);
        }

        public async Task<IEnumerable<ReviewResponse>> GetHotelReviewsAsync(Guid hotelId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.HotelId == hotelId)
                .OrderByDescending(r => r.CreatedAtUtc)
                .ToListAsync();

            return reviews.Select(MapToResponse);
        }

        public async Task DeleteReviewAsync(Guid reviewId, Guid userId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null) throw new KeyNotFoundException("Review not found.");
            if (review.UserId != userId) throw new UnauthorizedAccessException("You can only delete your own reviews.");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
        }

        private static ReviewResponse MapToResponse(Review r) => new(
            r.Id, r.Rating, r.Comment, r.AiSentiment, r.UserId, r.HotelId, r.CreatedAtUtc);
    }
}
