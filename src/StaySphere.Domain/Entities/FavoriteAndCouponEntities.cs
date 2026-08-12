using System;
using System.Collections.Generic;
using StaySphere.Domain.Common;
using StaySphere.Domain.Enums;

namespace StaySphere.Domain.Entities
{
    public class Favorite : BaseAuditableEntity
    {
        public Guid UserId { get; set; }
        public User? User { get; set; }

        public Guid HotelId { get; set; }
        public Hotel? Hotel { get; set; }
    }

    public class Coupon : BaseAuditableEntity
    {
        public string Code { get; set; } = string.Empty;
        public decimal DiscountPercent { get; set; }
        public int MaxUses { get; set; }
        public int UsedCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime ExpiresAtUtc { get; set; }
    }
}
