using System;
using System.Threading.Tasks;
using StaySphere.Application.Features.AI.DTOs;

namespace StaySphere.Application.Common.Interfaces
{
    public interface IAiService
    {
        Task<ChatResponse> ChatWithAssistantAsync(ChatRequest request, Guid userId);
    }
}
