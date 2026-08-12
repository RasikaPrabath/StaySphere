using System;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.SignalR;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Notifications.DTOs;
using StaySphere.API.Hubs;

namespace StaySphere.API.Services
{
    /// <summary>
    /// Real-time notification service.
    /// Registered in Program.cs to override the Infrastructure stub.
    /// Uses SignalR IHubContext + Hangfire background scheduling.
    /// </summary>
    public class SignalRNotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IBackgroundJobClient _backgroundJobClient;

        public SignalRNotificationService(
            IHubContext<NotificationHub> hubContext,
            IBackgroundJobClient backgroundJobClient)
        {
            _hubContext = hubContext;
            _backgroundJobClient = backgroundJobClient;
        }

        public async Task SendToUserAsync(Guid userId, NotificationResponse notification)
        {
            await _hubContext.Clients
                .Group($"user_{userId}")
                .SendAsync("ReceiveNotification", notification);
        }

        public async Task BroadcastAsync(NotificationResponse notification)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
        }

        public void ScheduleBookingReminder(Guid bookingId, DateTime checkInDate)
        {
            var delay = checkInDate.AddHours(-24) - DateTime.UtcNow;
            if (delay > TimeSpan.Zero)
            {
                _backgroundJobClient.Schedule(
                    () => Console.WriteLine($"[Reminder] Booking {bookingId} check-in tomorrow!"),
                    delay);
            }
        }
    }
}
