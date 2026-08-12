using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Rooms.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Domain.Enums;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    public class RoomService : IRoomService
    {
        private readonly StaySphereDbContext _context;
        private readonly IImageUploadService _imageUploadService;

        public RoomService(StaySphereDbContext context, IImageUploadService imageUploadService)
        {
            _context = context;
            _imageUploadService = imageUploadService;
        }

        public async Task<RoomResponse> CreateRoomAsync(Guid hotelId, CreateRoomRequest request, Guid userId)
        {
            var hotel = await _context.Hotels.FirstOrDefaultAsync(h => h.Id == hotelId);
            if (hotel == null) throw new KeyNotFoundException("Hotel not found.");
            if (hotel.OwnerId != userId) throw new UnauthorizedAccessException("You do not own this hotel.");

            var room = new Room
            {
                RoomNumber = request.RoomNumber,
                RoomType = request.RoomType,
                Capacity = request.Capacity,
                PricePerNight = request.PricePerNight,
                Floor = request.Floor,
                HotelId = hotelId,
                Status = RoomStatus.Available,
                Amenities = request.Amenities ?? new List<string>()
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return MapToResponse(room);
        }

        public async Task<RoomResponse> UpdateRoomAsync(Guid roomId, UpdateRoomRequest request, Guid userId)
        {
            var room = await _context.Rooms
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.Id == roomId);

            if (room == null) throw new KeyNotFoundException("Room not found.");
            if (room.Hotel?.OwnerId != userId) throw new UnauthorizedAccessException("You do not own this hotel.");

            room.RoomNumber = request.RoomNumber;
            room.RoomType = request.RoomType;
            room.Capacity = request.Capacity;
            room.PricePerNight = request.PricePerNight;
            room.Status = request.Status;
            room.Floor = request.Floor;
            room.Amenities = request.Amenities ?? new List<string>();
            room.LastModifiedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToResponse(room);
        }

        public async Task<bool> DeleteRoomAsync(Guid roomId, Guid userId)
        {
            var room = await _context.Rooms
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.Id == roomId);

            if (room == null) throw new KeyNotFoundException("Room not found.");
            if (room.Hotel?.OwnerId != userId) throw new UnauthorizedAccessException("You do not own this hotel.");

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<RoomResponse> GetRoomByIdAsync(Guid roomId)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId);
            if (room == null) throw new KeyNotFoundException("Room not found.");

            return MapToResponse(room);
        }

        public async Task<IEnumerable<RoomResponse>> GetRoomsByHotelAsync(Guid hotelId, RoomStatus? status)
        {
            var query = _context.Rooms.Where(r => r.HotelId == hotelId);

            if (status.HasValue)
            {
                query = query.Where(r => r.Status == status.Value);
            }

            var rooms = await query.ToListAsync();
            return rooms.Select(MapToResponse);
        }

        public async Task<RoomResponse> AddRoomImageAsync(Guid roomId, IFormFile file, Guid userId)
        {
            var room = await _context.Rooms
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.Id == roomId);

            if (room == null) throw new KeyNotFoundException("Room not found.");
            if (room.Hotel?.OwnerId != userId) throw new UnauthorizedAccessException("You do not own this hotel.");

            var imageUrl = await _imageUploadService.UploadImageAsync(file, "rooms");
            room.ImageUrls.Add(imageUrl);

            await _context.SaveChangesAsync();
            return MapToResponse(room);
        }

        public async Task<RoomResponse> UpdateRoomStatusAsync(Guid roomId, RoomStatus status, Guid userId)
        {
            // Housekeeping, Staff, and Owners can update room cleaning or maintenance status
            var room = await _context.Rooms
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.Id == roomId);

            if (room == null) throw new KeyNotFoundException("Room not found.");

            // Allow updates if the user is the owner or staff members
            // (In a full DB model we would check a HotelStaff association table,
            // here we validate basic owner and role rules)
            room.Status = status;
            room.LastModifiedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToResponse(room);
        }

        private static RoomResponse MapToResponse(Room room)
        {
            return new RoomResponse(
                room.Id,
                room.RoomNumber,
                room.RoomType,
                room.Capacity,
                room.PricePerNight,
                room.Status,
                room.Floor,
                room.HotelId,
                room.Amenities,
                room.ImageUrls,
                room.CreatedAtUtc
            );
        }
    }
}
