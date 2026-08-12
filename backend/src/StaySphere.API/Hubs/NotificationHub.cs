using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace StaySphere.API.Hubs
{
    /// <summary>
    /// SignalR Hub — clients connect to /hubs/notifications.
    /// JWT bearer token is read from query string (?access_token=...)
    /// for WebSocket compatibility.
    /// </summary>
    public class NotificationHub : Hub
    {
        /// <summary>
        /// Client calls this to join their personal notification group.
        /// Group name = "user_{userId}" — used by INotificationService to push targeted events.
        /// </summary>
        public async Task JoinUserGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        public async Task LeaveUserGroup(string userId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
    }
}
