using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Search.DTOs;

namespace StaySphere.API.Controllers
{
    [ApiController]
    [Route("api/v1/search")]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;

        public SearchController(ISearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet]
        public async Task<IActionResult> SearchHotels(
            [FromQuery] string? city,
            [FromQuery] string? country,
            [FromQuery] DateTime? checkIn,
            [FromQuery] DateTime? checkOut,
            [FromQuery] int guests = 2,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] double? minRating = null,
            [FromQuery] string? sortBy = "Recommended")
        {
            var request = new HotelSearchRequest(
                city,
                country,
                checkIn,
                checkOut,
                guests,
                minPrice,
                maxPrice,
                minRating,
                sortBy
            );

            var response = await _searchService.SearchHotelsAsync(request);
            return Ok(response);
        }
    }
}
