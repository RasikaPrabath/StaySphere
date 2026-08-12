using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Auth.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Infrastructure.Identity;
using StaySphere.Infrastructure.Persistence;
using Xunit;

namespace StaySphere.UnitTests
{
    public class AuthServiceTests : IDisposable
    {
        private readonly StaySphereDbContext _context;
        private readonly Mock<IJwtTokenGenerator> _tokenGeneratorMock;
        private readonly Mock<IPasswordHasher> _passwordHasherMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            var options = new DbContextOptionsBuilder<StaySphereDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new StaySphereDbContext(options);
            _tokenGeneratorMock = new Mock<IJwtTokenGenerator>();
            _passwordHasherMock = new Mock<IPasswordHasher>();

            _authService = new AuthService(
                _context,
                _tokenGeneratorMock.Object,
                _passwordHasherMock.Object
            );
        }

        [Fact]
        public async Task RegisterAsync_ShouldCreateUser_WhenEmailIsUnique()
        {
            // Arrange
            var request = new RegisterRequest("john.doe@example.com", "Password123!", "John", "Doe", "0771234567");
            _passwordHasherMock.Setup(h => h.HashPassword(It.IsAny<string>())).Returns("hashed_password");
            _tokenGeneratorMock.Setup(t => t.GenerateAccessToken(It.IsAny<User>())).Returns("access_token");
            _tokenGeneratorMock.Setup(t => t.GenerateRefreshToken()).Returns("refresh_token");

            // Act
            var result = await _authService.RegisterAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("John", result.User.FirstName);
            Assert.Equal("john.doe@example.com", result.User.Email);

            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == "john.doe@example.com");
            Assert.NotNull(dbUser);
            Assert.Equal("hashed_password", dbUser.PasswordHash);
        }

        [Fact]
        public async Task RegisterAsync_ShouldThrowException_WhenEmailAlreadyExists()
        {
            // Arrange
            var existingUser = new User
            {
                Email = "john.doe@example.com",
                PasswordHash = "hash",
                FirstName = "Existing",
                LastName = "User"
            };
            _context.Users.Add(existingUser);
            await _context.SaveChangesAsync();

            var request = new RegisterRequest("john.doe@example.com", "Password123!", "John", "Doe", "0771234567");

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _authService.RegisterAsync(request));
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
