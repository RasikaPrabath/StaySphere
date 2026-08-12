using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Hotels.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Domain.Enums;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    public class HotelService : IHotelService
    {
        private readonly StaySphereDbContext _context;
        private readonly IImageUploadService _imageUploadService;

        public HotelService(StaySphereDbContext context, IImageUploadService imageUploadService)
        {
            _context = context;
            _imageUploadService = imageUploadService;
        }

        public async Task<HotelResponse> CreateHotelAsync(CreateHotelRequest request, Guid ownerId)
        {
            var hotel = new Hotel
            {
                Name = request.Name,
                Description = request.Description,
                Address = request.Address,
                City = request.City,
                Country = request.Country,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                ContactNumber = request.ContactNumber,
                ContactEmail = request.ContactEmail,
                ApprovalStatus = HotelApprovalStatus.Draft,
                OwnerId = ownerId,
                Amenities = request.Amenities ?? new List<string>()
            };

            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();

            return MapToResponse(hotel);
        }

        public async Task<HotelResponse> UpdateHotelAsync(Guid hotelId, UpdateHotelRequest request, Guid ownerId)
        {
            var hotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Id == hotelId);
            if (hotel == null) throw new KeyNotFoundException("Hotel not found.");
            if (hotel.OwnerId != ownerId) throw new UnauthorizedAccessException("You do not own this hotel.");

            hotel.Name = request.Name;
            hotel.Description = request.Description;
            hotel.Address = request.Address;
            hotel.City = request.City;
            hotel.Country = request.Country;
            hotel.Latitude = request.Latitude;
            hotel.Longitude = request.Longitude;
            hotel.ContactNumber = request.ContactNumber;
            hotel.ContactEmail = request.ContactEmail;
            hotel.Amenities = request.Amenities ?? new List<string>();
            hotel.LastModifiedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToResponse(hotel);
        }

        public async Task<HotelResponse> SubmitForApprovalAsync(Guid hotelId, Guid ownerId)
        {
            var hotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Id == hotelId);
            if (hotel == null) throw new KeyNotFoundException("Hotel not found.");
            if (hotel.OwnerId != ownerId) throw new UnauthorizedAccessException("You do not own this hotel.");

            hotel.ApprovalStatus = HotelApprovalStatus.PendingReview;
            await _context.SaveChangesAsync();

            return MapToResponse(hotel);
        }

        public async Task<HotelResponse> ReviewHotelAsync(Guid hotelId, HotelApprovalStatus status)
        {
            var hotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Id == hotelId);
            if (hotel == null) throw new KeyNotFoundException("Hotel not found.");

            if (status != HotelApprovalStatus.Approved && status != HotelApprovalStatus.Rejected)
            {
                throw new ArgumentException("Invalid review approval status.");
            }

            hotel.ApprovalStatus = status;
            await _context.SaveChangesAsync();

            return MapToResponse(hotel);
        }

        public async Task<HotelResponse> GetHotelByIdAsync(Guid hotelId)
        {
            var hotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Id == hotelId);
            if (hotel == null) throw new KeyNotFoundException("Hotel not found.");

            return MapToResponse(hotel);
        }

        public async Task<IEnumerable<HotelResponse>> GetHotelsAsync(string? city, string? country, HotelApprovalStatus? status)
        {
            var query = _context.Hotels.AsQueryable();

            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(h => h.City.ToLower() == city.ToLower());
            }

            if (!string.IsNullOrEmpty(country))
            {
                query = query.Where(h => h.Country.ToLower() == country.ToLower());
            }

            if (status.HasValue)
            {
                query = query.Where(h => h.ApprovalStatus == status.Value);
            }
            else
            {
                // Default to showing only approved (published) hotels to public/general clients
                query = query.Where(h => h.ApprovalStatus == HotelApprovalStatus.Approved);
            }

            var hotels = await query.ToListAsync();
            return hotels.Select(MapToResponse);
        }

        public async Task<IEnumerable<HotelResponse>> GetPendingHotelsAsync()
        {
            var hotels = await _context.Hotels
                .Where(h => h.ApprovalStatus == HotelApprovalStatus.PendingReview)
                .ToListAsync();

            return hotels.Select(MapToResponse);
        }

        public async Task<HotelResponse> AddHotelImageAsync(Guid hotelId, IFormFile file, Guid ownerId)
        {
            var hotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Id == hotelId);
            if (hotel == null) throw new KeyNotFoundException("Hotel not found.");
            if (hotel.OwnerId != ownerId) throw new UnauthorizedAccessException("You do not own this hotel.");

            var imageUrl = await _imageUploadService.UploadImageAsync(file, "hotels");
            hotel.ImageUrls.Add(imageUrl);
            
            await _context.SaveChangesAsync();
            return MapToResponse(hotel);
        }

        private static HotelResponse MapToResponse(Hotel hotel)
        {
            return new HotelResponse(
                hotel.Id,
                hotel.Name,
                hotel.Description,
                hotel.Address,
                hotel.City,
                hotel.Country,
                hotel.Latitude,
                hotel.Longitude,
                hotel.ContactNumber,
                hotel.ContactEmail,
                hotel.StarRating,
                hotel.ApprovalStatus,
                hotel.OwnerId,
                hotel.ImageUrls,
                hotel.Amenities,
                hotel.CreatedAtUtc
            );
        }
    }
}
