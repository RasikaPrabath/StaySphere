using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace StaySphere.Application.Common.Interfaces
{
    public interface IImageUploadService
    {
        Task<string> UploadImageAsync(IFormFile file, string folder);
    }
}
