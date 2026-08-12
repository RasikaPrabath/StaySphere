using System;
using System.Collections.Generic;
using StaySphere.Domain.Common;
using StaySphere.Domain.Enums;

namespace StaySphere.Domain.Entities
{
    public class Hotel : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string ContactNumber { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public double StarRating { get; set; } = 4.5;
        public HotelApprovalStatus ApprovalStatus { get; set; } = HotelApprovalStatus.PendingReview;
        
        public Guid OwnerId { get; set; }
        public User? Owner { get; set; }

        public ICollection<Room> Rooms { get; set; } = new List<Room>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<string> Amenities { get; set; } = new List<string>();
    }
}
