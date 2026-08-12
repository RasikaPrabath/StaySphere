using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Auth.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure.Identity
{
    public class AuthService : IAuthService
    {
        private readonly StaySphereDbContext _context;
        private readonly IJwtTokenGenerator _tokenGenerator;
        private readonly IPasswordHasher _passwordHasher;

        public AuthService(
            StaySphereDbContext context,
            IJwtTokenGenerator tokenGenerator,
            IPasswordHasher passwordHasher)
        {
            _context = context;
            _tokenGenerator = tokenGenerator;
            _passwordHasher = passwordHasher;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());
            if (existingUser != null)
            {
                throw new InvalidOperationException($"User with email '{request.Email}' already exists.");
            }

            var newUser = new User
            {
                Email = request.Email.ToLower(),
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                Role = request.Role,
                IsEmailVerified = true,
                RefreshToken = _tokenGenerator.GenerateRefreshToken(),
                RefreshTokenExpiryTimeUtc = DateTime.UtcNow.AddDays(7)
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var accessToken = _tokenGenerator.GenerateAccessToken(newUser);
            var userDto = new UserDto(
                newUser.Id,
                newUser.Email,
                newUser.FirstName,
                newUser.LastName,
                newUser.PhoneNumber,
                newUser.Role,
                newUser.IsEmailVerified,
                newUser.ProfileImageUrl
            );

            return new AuthResponse(userDto, accessToken, newUser.RefreshToken, DateTime.UtcNow.AddMinutes(30));
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());
            if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            user.RefreshToken = _tokenGenerator.GenerateRefreshToken();
            user.RefreshTokenExpiryTimeUtc = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            var accessToken = _tokenGenerator.GenerateAccessToken(user);
            var userDto = new UserDto(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.PhoneNumber,
                user.Role,
                user.IsEmailVerified,
                user.ProfileImageUrl
            );

            return new AuthResponse(userDto, accessToken, user.RefreshToken, DateTime.UtcNow.AddMinutes(30));
        }

        public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);
            if (user == null || user.RefreshTokenExpiryTimeUtc < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token.");
            }

            user.RefreshToken = _tokenGenerator.GenerateRefreshToken();
            user.RefreshTokenExpiryTimeUtc = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            var newAccessToken = _tokenGenerator.GenerateAccessToken(user);
            var userDto = new UserDto(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.PhoneNumber,
                user.Role,
                user.IsEmailVerified,
                user.ProfileImageUrl
            );

            return new AuthResponse(userDto, newAccessToken, user.RefreshToken, DateTime.UtcNow.AddMinutes(30));
        }
    }
}
