using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Payments.DTOs;

namespace StaySphere.API.Controllers
{
    [ApiController]
    [Route("api/v1/payments")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // POST /api/v1/payments/initiate
        [HttpPost("initiate")]
        public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty) return Unauthorized();

            try
            {
                var payment = await _paymentService.InitiatePaymentAsync(request, userId);
                return Ok(payment);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // GET /api/v1/payments/booking/{bookingId}
        [HttpGet("booking/{bookingId:guid}")]
        public async Task<IActionResult> GetPaymentByBooking(Guid bookingId)
        {
            try
            {
                var payment = await _paymentService.GetPaymentByBookingIdAsync(bookingId);
                return Ok(payment);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // POST /api/v1/payments/webhook — Publicly accessible for gateway callbacks
        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> HandleWebhook([FromBody] PaymentWebhookPayload payload)
        {
            // In production: validate HMAC/signature from gateway headers before processing
            try
            {
                var payment = await _paymentService.HandleWebhookAsync(payload);
                return Ok(payment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // POST /api/v1/payments/{id}/refund — Admin only
        [HttpPost("{id:guid}/refund")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RefundPayment(Guid id)
        {
            var userId = GetCurrentUserId();
            try
            {
                var payment = await _paymentService.RefundPaymentAsync(id, userId);
                return Ok(payment);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        private Guid GetCurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("sub")?.Value;
            return Guid.TryParse(idClaim, out var id) ? id : Guid.Empty;
        }
    }
}
