using System;
using System.Collections.Generic;
using StaySphere.Domain.Common;
using StaySphere.Domain.Enums;

namespace StaySphere.Domain.Entities
{
    public class Room : BaseAuditableEntity
    {
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = "Deluxe Suite";
        public int Capacity { get; set; } = 2;
        public decimal PricePerNight { get; set; }
        public RoomStatus Status { get; set; } = RoomStatus.Available;
        public int Floor { get; set; } = 1;

        public Guid HotelId { get; set; }
        public Hotel? Hotel { get; set; }

        public List<string> Amenities { get; set; } = new List<string>();
        public List<string> ImageUrls { get; set; } = new List<string>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    public class Booking : BaseAuditableEntity
    {
        public string BookingReference { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int GuestCount { get; set; } = 2;
        public decimal TotalAmount { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        public Guid UserId { get; set; }
        public User? User { get; set; }

        public Guid RoomId { get; set; }
        public Room? Room { get; set; }

        public Payment? Payment { get; set; }
    }

    public class Payment : BaseAuditableEntity
    {
        public string TransactionId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public string PaymentGateway { get; set; } = "Stripe";

        public Guid BookingId { get; set; }
        public Booking? Booking { get; set; }
    }

    public class Review : BaseAuditableEntity
    {
        public int Rating { get; set; } = 5;
        public string Comment { get; set; } = string.Empty;
        public string? AiSentiment { get; set; } = "Positive";

        public Guid UserId { get; set; }
        public User? User { get; set; }

        public Guid HotelId { get; set; }
        public Hotel? Hotel { get; set; }
    }
}
