using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Dashboards.DTOs;

namespace StaySphere.API.Controllers
{
    [ApiController]
    [Route("api/v1/dashboards")]
    [Authorize]
    public class DashboardsController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardsController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetAdminDashboard()
        {
            var data = await _dashboardService.GetAdminDashboardAsync();
            return Ok(data);
        }

        [HttpGet("owner")]
        [Authorize(Roles = "HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> GetOwnerDashboard()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            var data = await _dashboardService.GetOwnerDashboardAsync(userId);
            return Ok(data);
        }

        [HttpGet("staff/{hotelId:guid}")]
        [Authorize(Roles = "HotelStaff,HotelOwner,Admin,SuperAdmin")]
        public async Task<IActionResult> GetStaffDashboard(Guid hotelId)
        {
            var data = await _dashboardService.GetStaffDashboardAsync(hotelId);
            return Ok(data);
        }

        private Guid GetCurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("sub")?.Value;
            return Guid.TryParse(idClaim, out var id) ? id : Guid.Empty;
        }
    }
}
