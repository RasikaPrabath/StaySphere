using System.Threading.Tasks;
using StaySphere.Application.Features.Search.DTOs;

namespace StaySphere.Application.Common.Interfaces
{
    public interface ISearchService
    {
        Task<HotelSearchResponse> SearchHotelsAsync(HotelSearchRequest request);
    }
}
