using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Hotels.DTOs;
using StaySphere.Domain.Enums;

namespace StaySphere.API.Controllers
{
    [ApiController]
    [Route("api/v1/hotels")]
    public class HotelsController : ControllerBase
    {
        private readonly IHotelService _hotelService;

        public HotelsController(IHotelService hotelService)
        {
            _hotelService = hotelService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHotels(
            [FromQuery] string? city, 
            [FromQuery] string? country, 
            [FromQuery] HotelApprovalStatus? status)
        {
            var hotels = await _hotelService.GetHotelsAsync(city, country, status);
            return Ok(hotels);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetHotelById(Guid id)
        {
            try
            {
                var hotel = await _hotelService.GetHotelByIdAsync(id);
                return Ok(hotel);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> CreateHotel([FromBody] CreateHotelRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var response = await _hotelService.CreateHotelAsync(request, userId);
            return CreatedAtAction(nameof(GetHotelById), new { id = response.Id }, response);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateHotel(Guid id, [FromBody] UpdateHotelRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                var response = await _hotelService.UpdateHotelAsync(id, request, userId);
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

        [HttpPost("{id:guid}/submit")]
        [Authorize(Roles = "HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> SubmitForApproval(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                var response = await _hotelService.SubmitForApprovalAsync(id, userId);
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

        [HttpPost("{id:guid}/images")]
        [Authorize(Roles = "HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> UploadHotelImage(Guid id, IFormFile file)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                var response = await _hotelService.AddHotelImageAsync(id, file, userId);
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

        [HttpPost("/api/v1/admin/hotels/{id:guid}/approve")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> ApproveHotel(Guid id)
        {
            try
            {
                var response = await _hotelService.ReviewHotelAsync(id, HotelApprovalStatus.Approved);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("/api/v1/admin/hotels/{id:guid}/reject")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> RejectHotel(Guid id)
        {
            try
            {
                var response = await _hotelService.ReviewHotelAsync(id, HotelApprovalStatus.Rejected);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet("/api/v1/admin/hotels/pending")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetPendingHotels()
        {
            var hotels = await _hotelService.GetPendingHotelsAsync();
            return Ok(hotels);
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
