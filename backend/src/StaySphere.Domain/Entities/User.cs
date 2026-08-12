using System;
using System.Collections.Generic;
using StaySphere.Domain.Common;
using StaySphere.Domain.Enums;

namespace StaySphere.Domain.Entities
{
    public class User : BaseAuditableEntity
    {
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Customer;
        public bool IsEmailVerified { get; set; } = false;
        public string? ProfileImageUrl { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTimeUtc { get; set; }

        // Navigation
        public ICollection<Hotel> OwnedHotels { get; set; } = new List<Hotel>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
