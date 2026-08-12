using System;

namespace StaySphere.Application.Features.Notifications.DTOs
{
    public record NotificationResponse(
        string Type,    // "BookingConfirmed" | "PaymentReceived" | "BookingCancelled" etc.
        string Title,
        string Message,
        DateTime SentAtUtc
    );
}
