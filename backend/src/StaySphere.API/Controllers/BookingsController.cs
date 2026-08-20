using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Bookings.DTOs;

namespace StaySphere.API.Controllers
{
    [ApiController]
    [Route("api/v1/bookings")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // POST /api/v1/bookings
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                var booking = await _bookingService.CreateBookingAsync(request, userId);
                return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // GET /api/v1/bookings/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetBookingById(Guid id)
        {
            var userId = GetCurrentUserId();
            try
            {
                var booking = await _bookingService.GetBookingByIdAsync(id, userId);
                return Ok(booking);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // GET /api/v1/bookings/my
        [HttpGet("my")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var bookings = await _bookingService.GetUserBookingsAsync(userId);
            return Ok(bookings);
        }

        // GET /api/v1/bookings — Admin only
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        // DELETE /api/v1/bookings/{id}/cancel
        [HttpDelete("{id:guid}/cancel")]
        public async Task<IActionResult> CancelBooking(Guid id)
        {
            var userId = GetCurrentUserId();
            try
            {
                var booking = await _bookingService.CancelBookingAsync(id, userId);
                return Ok(booking);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        private Guid GetCurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("sub")?.Value;
            return Guid.TryParse(idClaim, out var id) ? id : Guid.Empty;
        }
    }
}
