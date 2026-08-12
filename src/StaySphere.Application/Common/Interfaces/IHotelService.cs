using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using StaySphere.Application.Features.Hotels.DTOs;
using StaySphere.Domain.Enums;

namespace StaySphere.Application.Common.Interfaces
{
    public interface IHotelService
    {
        Task<HotelResponse> CreateHotelAsync(CreateHotelRequest request, Guid ownerId);
        Task<HotelResponse> UpdateHotelAsync(Guid hotelId, UpdateHotelRequest request, Guid ownerId);
        Task<HotelResponse> SubmitForApprovalAsync(Guid hotelId, Guid ownerId);
        Task<HotelResponse> ReviewHotelAsync(Guid hotelId, HotelApprovalStatus status);
        Task<HotelResponse> GetHotelByIdAsync(Guid hotelId);
        Task<IEnumerable<HotelResponse>> GetHotelsAsync(string? city, string? country, HotelApprovalStatus? status);
        Task<IEnumerable<HotelResponse>> GetPendingHotelsAsync();
        Task<HotelResponse> AddHotelImageAsync(Guid hotelId, IFormFile file, Guid ownerId);
    }
}
