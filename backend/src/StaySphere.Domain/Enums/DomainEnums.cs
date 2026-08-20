namespace StaySphere.Domain.Enums
{
    public enum UserRole
    {
        Customer = 1,
        Partner = 2,
        Admin = 3
    }

    public enum HotelApprovalStatus
    {
        Draft = 0,
        PendingReview = 1,
        Approved = 2,
        Rejected = 3,
        Suspended = 4
    }

    public enum RoomStatus
    {
        Available = 1,
        Reserved = 2,
        Occupied = 3,
        Maintenance = 4,
        OutOfService = 5
    }

    public enum BookingStatus
    {
        Pending = 1,
        Confirmed = 2,
        Cancelled = 3,
        Completed = 4,
        Refunded = 5,
        Expired = 6
    }

    public enum PaymentStatus
    {
        Pending = 1,
        Success = 2,
        Failed = 3,
        Refunded = 4,
        PartiallyRefunded = 5
    }
}
