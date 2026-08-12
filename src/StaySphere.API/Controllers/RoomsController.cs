using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Rooms.DTOs;
using StaySphere.Domain.Enums;

namespace StaySphere.API.Controllers
{
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomsController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet("api/v1/hotels/{hotelId:guid}/rooms")]
        public async Task<IActionResult> GetRoomsByHotel(Guid hotelId, [FromQuery] RoomStatus? status)
        {
            var rooms = await _roomService.GetRoomsByHotelAsync(hotelId, status);
            return Ok(rooms);
        }

        [HttpGet("api/v1/rooms/{id:guid}")]
        public async Task<IActionResult> GetRoomById(Guid id)
        {
            try
            {
                var room = await _roomService.GetRoomByIdAsync(id);
                return Ok(room);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("api/v1/hotels/{hotelId:guid}/rooms")]
        [Authorize(Roles = "HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> CreateRoom(Guid hotelId, [FromBody] CreateRoomRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                var response = await _roomService.CreateRoomAsync(hotelId, request, userId);
                return CreatedAtAction(nameof(GetRoomById), new { id = response.Id }, response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpPut("api/v1/rooms/{id:guid}")]
        [Authorize(Roles = "HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateRoom(Guid id, [FromBody] UpdateRoomRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                var response = await _roomService.UpdateRoomAsync(id, request, userId);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("api/v1/rooms/{id:guid}")]
        [Authorize(Roles = "HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                await _roomService.DeleteRoomAsync(id, userId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpPost("api/v1/rooms/{id:guid}/images")]
        [Authorize(Roles = "HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> UploadRoomImage(Guid id, IFormFile file)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                var response = await _roomService.AddRoomImageAsync(id, file, userId);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpPatch("api/v1/rooms/{id:guid}/status")]
        [Authorize(Roles = "HotelOwner,HotelStaff,Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateRoomStatus(Guid id, [FromBody] RoomStatus status)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                var response = await _roomService.UpdateRoomStatusAsync(id, status, userId);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst("sub")?.Value;

            if (Guid.TryParse(userIdClaim, out var guid))
            {
                return guid;
            }
            return Guid.Empty;
        }
    }
}
