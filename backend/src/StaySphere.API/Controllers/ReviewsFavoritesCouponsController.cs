using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Reviews.DTOs;
using StaySphere.Application.Features.Favorites.DTOs;
using StaySphere.Application.Features.Coupons.DTOs;

namespace StaySphere.API.Controllers
{
    // ─── Reviews ─────────────────────────────────────────────────────────────
    [ApiController]
    [Route("api/v1/reviews")]
    [Authorize]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        public ReviewsController(IReviewService reviewService) => _reviewService = reviewService;

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();
            try
            {
                var review = await _reviewService.CreateReviewAsync(request, userId);
                return Ok(review);
            }
            catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
            catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        }

        [HttpGet("hotel/{hotelId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetHotelReviews(Guid hotelId)
        {
            var reviews = await _reviewService.GetHotelReviewsAsync(hotelId);
            return Ok(reviews);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var userId = GetCurrentUserId();
            try
            {
                await _reviewService.DeleteReviewAsync(id, userId);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(); }
            catch (UnauthorizedAccessException) { return Forbid(); }
        }

        private Guid GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
        }
    }

    // ─── Favorites ────────────────────────────────────────────────────────────
    [ApiController]
    [Route("api/v1/favorites")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;
        public FavoritesController(IFavoriteService favoriteService) => _favoriteService = favoriteService;

        [HttpPost("{hotelId:guid}")]
        public async Task<IActionResult> AddFavorite(Guid hotelId)
        {
            var userId = GetCurrentUserId();
            try
            {
                var fav = await _favoriteService.AddFavoriteAsync(hotelId, userId);
                return Ok(fav);
            }
            catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        }

        [HttpDelete("{hotelId:guid}")]
        public async Task<IActionResult> RemoveFavorite(Guid hotelId)
        {
            var userId = GetCurrentUserId();
            try
            {
                await _favoriteService.RemoveFavoriteAsync(hotelId, userId);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpGet]
        public async Task<IActionResult> GetMyFavorites()
        {
            var userId = GetCurrentUserId();
            var favs = await _favoriteService.GetUserFavoritesAsync(userId);
            return Ok(favs);
        }

        private Guid GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
        }
    }

    // ─── Coupons ──────────────────────────────────────────────────────────────
    [ApiController]
    [Route("api/v1/coupons")]
    [Authorize]
    public class CouponsController : ControllerBase
    {
        private readonly ICouponService _couponService;
        public CouponsController(ICouponService couponService) => _couponService = couponService;

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCoupon([FromBody] CreateCouponRequest request)
        {
            try
            {
                var coupon = await _couponService.CreateCouponAsync(request);
                return Ok(coupon);
            }
            catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
            catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyCoupon([FromBody] ApplyCouponRequest request)
        {
            var userId = GetCurrentUserId();
            var result = await _couponService.ApplyCouponAsync(request, userId);
            return result.Applied ? Ok(result) : BadRequest(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllCoupons()
        {
            var coupons = await _couponService.GetAllCouponsAsync();
            return Ok(coupons);
        }

        [HttpDelete("{id:guid}/deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeactivateCoupon(Guid id)
        {
            try
            {
                await _couponService.DeactivateCouponAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        private Guid GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return Guid.TryParse(claim, out var id) ? id : Guid.Empty;
        }
    }
}
