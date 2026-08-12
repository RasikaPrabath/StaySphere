using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StaySphere.Application.Features.Bookings.DTOs;

namespace StaySphere.Application.Common.Interfaces
{
    public interface IBookingService
    {
        Task<BookingResponse> CreateBookingAsync(CreateBookingRequest request, Guid userId);
        Task<BookingResponse> CancelBookingAsync(Guid bookingId, Guid userId);
        Task<BookingResponse> GetBookingByIdAsync(Guid bookingId, Guid userId);
        Task<IEnumerable<BookingResponse>> GetUserBookingsAsync(Guid userId);
        Task<IEnumerable<BookingResponse>> GetAllBookingsAsync();
    }
}
