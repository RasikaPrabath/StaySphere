using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Payments.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Domain.Enums;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Services
{
    /// <summary>
    /// Gateway-agnostic payment service.
    /// In production: replace GenerateMockCheckoutUrl with real Stripe/PayHere SDK calls.
    /// Webhook validation is handled at controller level (gateway-specific HMAC signatures).
    /// </summary>
    public class PaymentService : IPaymentService
    {
        private readonly StaySphereDbContext _context;

        public PaymentService(StaySphereDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentResponse> InitiatePaymentAsync(InitiatePaymentRequest request, Guid userId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.Id == request.BookingId && b.UserId == userId);

            if (booking == null)
                throw new KeyNotFoundException("Booking not found or does not belong to you.");

            if (booking.Status == BookingStatus.Cancelled)
                throw new InvalidOperationException("Cannot pay for a cancelled booking.");

            if (booking.Payment != null && booking.Payment.Status == PaymentStatus.Success)
                throw new InvalidOperationException("Booking is already paid.");

            // Generate transaction id and mock checkout URL (replace with real SDK call in production)
            var transactionId = $"TXN-{Guid.NewGuid().ToString().Substring(0, 12).ToUpper()}";
            var checkoutUrl = GenerateMockCheckoutUrl(request.Gateway, transactionId, booking.TotalAmount);

            // Create or update payment record
            if (booking.Payment == null)
            {
                var payment = new Payment
                {
                    TransactionId = transactionId,
                    Amount = booking.TotalAmount,
                    Currency = "USD",
                    Status = PaymentStatus.Pending,
                    PaymentGateway = request.Gateway,
                    BookingId = booking.Id
                };
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return MapToResponse(payment, checkoutUrl);
            }
            else
            {
                booking.Payment.TransactionId = transactionId;
                booking.Payment.Status = PaymentStatus.Pending;
                booking.Payment.PaymentGateway = request.Gateway;
                booking.Payment.LastModifiedAtUtc = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return MapToResponse(booking.Payment, checkoutUrl);
            }
        }

        public async Task<PaymentResponse> HandleWebhookAsync(PaymentWebhookPayload payload)
        {
            var payment = await _context.Payments
                .Include(p => p.Booking)
                .FirstOrDefaultAsync(p => p.TransactionId == payload.TransactionId);

            if (payment == null)
                throw new KeyNotFoundException($"Payment with transaction ID {payload.TransactionId} not found.");

            // Map gateway status string to domain enum
            payment.Status = payload.Status.ToLower() switch
            {
                "success" => PaymentStatus.Success,
                "failed"  => PaymentStatus.Failed,
                "refunded" => PaymentStatus.Refunded,
                _ => payment.Status
            };
            payment.LastModifiedAtUtc = DateTime.UtcNow;

            // Sync booking status based on payment outcome
            if (payment.Booking != null)
            {
                payment.Booking.Status = payment.Status switch
                {
                    PaymentStatus.Success  => BookingStatus.Confirmed,
                    PaymentStatus.Failed   => BookingStatus.Expired,
                    PaymentStatus.Refunded => BookingStatus.Refunded,
                    _ => payment.Booking.Status
                };
                payment.Booking.LastModifiedAtUtc = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return MapToResponse(payment, null);
        }

        public async Task<PaymentResponse> GetPaymentByBookingIdAsync(Guid bookingId)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.BookingId == bookingId);

            if (payment == null)
                throw new KeyNotFoundException("No payment found for this booking.");

            return MapToResponse(payment, null);
        }

        public async Task<PaymentResponse> RefundPaymentAsync(Guid paymentId, Guid userId)
        {
            var payment = await _context.Payments
                .Include(p => p.Booking)
                .FirstOrDefaultAsync(p => p.Id == paymentId);

            if (payment == null)
                throw new KeyNotFoundException("Payment not found.");

            if (payment.Status != PaymentStatus.Success)
                throw new InvalidOperationException("Only successful payments can be refunded.");

            // In production: call Stripe/PayHere refund API here
            payment.Status = PaymentStatus.Refunded;
            payment.LastModifiedAtUtc = DateTime.UtcNow;

            if (payment.Booking != null)
            {
                payment.Booking.Status = BookingStatus.Refunded;
                payment.Booking.LastModifiedAtUtc = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return MapToResponse(payment, null);
        }

        private static string GenerateMockCheckoutUrl(string gateway, string transactionId, decimal amount)
        {
            // TODO: Replace with real Stripe PaymentIntent / PayHere checkout URL generation
            return gateway.ToLower() == "payhere"
                ? $"https://sandbox.payhere.lk/pay/checkout?order_id={transactionId}&amount={amount}&currency=LKR"
                : $"https://checkout.stripe.com/pay/mock#{transactionId}";
        }

        private static PaymentResponse MapToResponse(Payment payment, string? checkoutUrl)
        {
            return new PaymentResponse(
                payment.Id,
                payment.TransactionId,
                payment.Amount,
                payment.Currency,
                payment.Status,
                payment.PaymentGateway,
                checkoutUrl,
                payment.CreatedAtUtc
            );
        }
    }
}
