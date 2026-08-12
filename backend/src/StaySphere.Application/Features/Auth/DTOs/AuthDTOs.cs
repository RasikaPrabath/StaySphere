using System;
using StaySphere.Domain.Enums;

namespace StaySphere.Application.Features.Auth.DTOs
{
    public record RegisterRequest(
        string Email,
        string Password,
        string FirstName,
        string LastName,
        string PhoneNumber,
        UserRole Role = UserRole.Customer
    );

    public record LoginRequest(
        string Email,
        string Password
    );

    public record RefreshTokenRequest(
        string AccessToken,
        string RefreshToken
    );

    public record UserDto(
        Guid Id,
        string Email,
        string FirstName,
        string LastName,
        string PhoneNumber,
        UserRole Role,
        bool IsEmailVerified,
        string? ProfileImageUrl
    );

    public record AuthResponse(
        UserDto User,
        string AccessToken,
        string RefreshToken,
        DateTime ExpiresAtUtc
    );
}
