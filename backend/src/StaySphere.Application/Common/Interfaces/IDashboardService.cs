using System;
using System.Threading.Tasks;
using StaySphere.Application.Features.Dashboards.DTOs;

namespace StaySphere.Application.Common.Interfaces
{
    public interface IDashboardService
    {
        Task<AdminDashboardResponse> GetAdminDashboardAsync();
        Task<OwnerDashboardResponse> GetOwnerDashboardAsync(Guid ownerId);
        Task<StaffDashboardResponse> GetStaffDashboardAsync(Guid hotelId);
    }
}
