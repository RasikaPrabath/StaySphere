using System;

namespace StaySphere.Application.Features.Coupons.DTOs
{
    public record CreateCouponRequest(
        string Code,
        decimal DiscountPercent,    // 0–100
        int MaxUses,
        DateTime ExpiresAtUtc
    );

    public record ApplyCouponRequest(
        string Code,
        Guid BookingId
    );

    public record CouponResponse(
        Guid Id,
        string Code,
        decimal DiscountPercent,
        int MaxUses,
        int UsedCount,
        bool IsActive,
        DateTime ExpiresAtUtc
    );

    public record CouponApplyResult(
        bool Applied,
        decimal DiscountAmount,
        decimal NewTotal,
        string Message
    );
}
