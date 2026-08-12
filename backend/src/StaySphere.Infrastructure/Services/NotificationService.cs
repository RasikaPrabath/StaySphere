using System;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.SignalR;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Notifications.DTOs;

namespace StaySphere.Infrastructure.Services
{
    /// <summary>
    /// NotificationService is registered in the API layer (not Infrastructure)
    /// to avoid circular project references. The IHubContext generic is resolved
    /// via a Hub marker interface pattern.
    /// This stub satisfies the interface for DI — the real implementation lives in
    /// StaySphere.API/Services/SignalRNotificationService.cs
    /// </summary>
    public class NotificationService : INotificationService
    {
        public Task SendToUserAsync(Guid userId, NotificationResponse notification) => Task.CompletedTask;
        public Task BroadcastAsync(NotificationResponse notification) => Task.CompletedTask;
        public void ScheduleBookingReminder(Guid bookingId, DateTime checkInDate) { }
    }
}
