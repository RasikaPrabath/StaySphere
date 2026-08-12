using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StaySphere.Application.Features.Reviews.DTOs;

namespace StaySphere.Application.Common.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewResponse> CreateReviewAsync(CreateReviewRequest request, Guid userId);
        Task<IEnumerable<ReviewResponse>> GetHotelReviewsAsync(Guid hotelId);
        Task DeleteReviewAsync(Guid reviewId, Guid userId);
    }
}
