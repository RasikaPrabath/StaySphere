using System;
using StaySphere.Domain.Enums;

namespace StaySphere.Application.Features.Payments.DTOs
{
    public record InitiatePaymentRequest(
        Guid BookingId,
        string Gateway = "Stripe" // "Stripe" | "PayHere"
    );

    public record PaymentResponse(
        Guid Id,
        string TransactionId,
        decimal Amount,
        string Currency,
        PaymentStatus Status,
        string PaymentGateway,
        string? CheckoutUrl,
        DateTime CreatedAtUtc
    );

    public record PaymentWebhookPayload(
        string TransactionId,
        string Status,     // "success" | "failed" | "refunded"
        string Gateway
    );
}
