using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using StaySphere.Application.Common.Interfaces;

namespace StaySphere.Infrastructure.Services
{
    public class LocalImageUploadService : IImageUploadService
    {
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

        public async Task<string> UploadImageAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty.");
            }

            if (file.Length > MaxFileSize)
            {
                throw new ArgumentException("File size exceeds 5MB limit.");
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
            {
                throw new ArgumentException("Invalid file extension. Only JPG, JPEG, PNG, and WEBP are allowed.");
            }

            // In a production environment we'd upload to S3 or Cloudinary.
            // For this local enterprise architecture setup, we'll save in a local wwwroot directory.
            var baseDirectory = AppContext.BaseDirectory;
            var webRootPath = Path.Combine(baseDirectory, "wwwroot", "uploads", folder);
            
            if (!Directory.Exists(webRootPath))
            {
                Directory.CreateDirectory(webRootPath);
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(webRootPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative URL for static file serving
            return $"/uploads/{folder}/{uniqueFileName}";
        }
    }
}
