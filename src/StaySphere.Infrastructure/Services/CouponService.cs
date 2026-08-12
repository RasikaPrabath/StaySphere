using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Coupons.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    public class CouponService : ICouponService
    {
        private readonly StaySphereDbContext _context;

        public CouponService(StaySphereDbContext context)
        {
            _context = context;
        }

        public async Task<CouponResponse> CreateCouponAsync(CreateCouponRequest request)
        {
            if (request.DiscountPercent <= 0 || request.DiscountPercent > 100)
                throw new ArgumentException("Discount must be between 1 and 100 percent.");

            var exists = await _context.Coupons.AnyAsync(c => c.Code == request.Code);
            if (exists) throw new InvalidOperationException("A coupon with this code already exists.");

            var coupon = new Coupon
            {
                Code = request.Code.ToUpper(),
                DiscountPercent = request.DiscountPercent,
                MaxUses = request.MaxUses,
                ExpiresAtUtc = request.ExpiresAtUtc
            };

            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync();

            return MapToResponse(coupon);
        }

        public async Task<CouponApplyResult> ApplyCouponAsync(ApplyCouponRequest request, Guid userId)
        {
            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code == request.Code.ToUpper() && c.IsActive);

            if (coupon == null)
                return new CouponApplyResult(false, 0, 0, "Invalid or inactive coupon code.");

            if (coupon.ExpiresAtUtc < DateTime.UtcNow)
                return new CouponApplyResult(false, 0, 0, "This coupon has expired.");

            if (coupon.UsedCount >= coupon.MaxUses)
                return new CouponApplyResult(false, 0, 0, "This coupon has reached its usage limit.");

            var booking = await _context.Bookings.FindAsync(request.BookingId);
            if (booking == null) return new CouponApplyResult(false, 0, 0, "Booking not found.");

            var discount = Math.Round(booking.TotalAmount * (coupon.DiscountPercent / 100m), 2);
            var newTotal = booking.TotalAmount - discount;

            // Apply discount to booking
            booking.TotalAmount = newTotal;
            booking.LastModifiedAtUtc = DateTime.UtcNow;

            // Increment usage count
            coupon.UsedCount++;
            coupon.LastModifiedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new CouponApplyResult(true, discount, newTotal,
                $"Coupon '{coupon.Code}' applied — {coupon.DiscountPercent}% off!");
        }

        public async Task<IEnumerable<CouponResponse>> GetAllCouponsAsync()
        {
            var coupons = await _context.Coupons
                .OrderByDescending(c => c.CreatedAtUtc)
                .ToListAsync();

            return coupons.Select(MapToResponse);
        }

        public async Task DeactivateCouponAsync(Guid couponId)
        {
            var coupon = await _context.Coupons.FindAsync(couponId);
            if (coupon == null) throw new KeyNotFoundException("Coupon not found.");

            coupon.IsActive = false;
            coupon.LastModifiedAtUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        private static CouponResponse MapToResponse(Coupon c) => new(
            c.Id, c.Code, c.DiscountPercent, c.MaxUses, c.UsedCount, c.IsActive, c.ExpiresAtUtc);
    }
}
