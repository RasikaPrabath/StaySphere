using System;
using System.Threading.Tasks;
using StaySphere.Application.Features.Payments.DTOs;

namespace StaySphere.Application.Common.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponse> InitiatePaymentAsync(InitiatePaymentRequest request, Guid userId);
        Task<PaymentResponse> HandleWebhookAsync(PaymentWebhookPayload payload);
        Task<PaymentResponse> GetPaymentByBookingIdAsync(Guid bookingId);
        Task<PaymentResponse> RefundPaymentAsync(Guid paymentId, Guid userId);
    }
}
