using System;
using System.Threading.Tasks;
using StaySphere.Application.Features.Notifications.DTOs;

namespace StaySphere.Application.Common.Interfaces
{
    public interface INotificationService
    {
        // Real-time push to specific user via SignalR
        Task SendToUserAsync(Guid userId, NotificationResponse notification);
        // Broadcast to all connected clients (admin announcements)
        Task BroadcastAsync(NotificationResponse notification);
        // Schedule a background email/push via Hangfire
        void ScheduleBookingReminder(Guid bookingId, DateTime checkInDate);
    }
}
