using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StaySphere.Application.Features.Coupons.DTOs;

namespace StaySphere.Application.Common.Interfaces
{
    public interface ICouponService
    {
        Task<CouponResponse> CreateCouponAsync(CreateCouponRequest request);
        Task<CouponApplyResult> ApplyCouponAsync(ApplyCouponRequest request, Guid userId);
        Task<IEnumerable<CouponResponse>> GetAllCouponsAsync();
        Task DeactivateCouponAsync(Guid couponId);
    }
}
