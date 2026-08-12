using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using StaySphere.Application.Features.Rooms.DTOs;
using StaySphere.Domain.Enums;

namespace StaySphere.Application.Common.Interfaces
{
    public interface IRoomService
    {
        Task<RoomResponse> CreateRoomAsync(Guid hotelId, CreateRoomRequest request, Guid userId);
        Task<RoomResponse> UpdateRoomAsync(Guid roomId, UpdateRoomRequest request, Guid userId);
        Task<bool> DeleteRoomAsync(Guid roomId, Guid userId);
        Task<RoomResponse> GetRoomByIdAsync(Guid roomId);
        Task<IEnumerable<RoomResponse>> GetRoomsByHotelAsync(Guid hotelId, RoomStatus? status);
        Task<RoomResponse> AddRoomImageAsync(Guid roomId, IFormFile file, Guid userId);
        Task<RoomResponse> UpdateRoomStatusAsync(Guid roomId, RoomStatus status, Guid userId);
    }
}
