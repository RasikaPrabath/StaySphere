using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Application.Features.Hotels.DTOs;
using StaySphere.Domain.Entities;
using StaySphere.Domain.Enums;
using StaySphere.Infrastructure.Persistence;
using StaySphere.Infrastructure.Services;
using Xunit;

namespace StaySphere.UnitTests
{
    public class HotelServiceTests : IDisposable
    {
        private readonly StaySphereDbContext _context;
        private readonly Mock<IImageUploadService> _imageUploadMock;
        private readonly HotelService _hotelService;

        public HotelServiceTests()
        {
            var options = new DbContextOptionsBuilder<StaySphereDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new StaySphereDbContext(options);
            _imageUploadMock = new Mock<IImageUploadService>();

            _hotelService = new HotelService(_context, _imageUploadMock.Object);
        }

        [Fact]
        public async Task CreateHotelAsync_ShouldCreateHotelInDraftStatus()
        {
            // Arrange
            var ownerId = Guid.NewGuid();
            var request = new CreateHotelRequest(
                "Luxury Villa",
                "Beautiful beachfront hotel",
                "123 Beach Rd",
                "Galle",
                "Sri Lanka",
                6.03,
                80.21,
                "0911234567",
                "info@luxuryvilla.com",
                new List<string> { "Pool", "Wifi" }
            );

            // Act
            var result = await _hotelService.CreateHotelAsync(request, ownerId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Luxury Villa", result.Name);
            Assert.Equal(HotelApprovalStatus.Draft, result.ApprovalStatus);

            var dbHotel = await _context.Hotels.FindAsync(result.Id);
            Assert.NotNull(dbHotel);
            Assert.Equal(ownerId, dbHotel.OwnerId);
        }

        [Fact]
        public async Task ApproveHotelAsync_ShouldChangeApprovalStatusToApproved()
        {
            // Arrange
            var hotel = new Hotel
            {
                Name = "Grand Hotel",
                ApprovalStatus = HotelApprovalStatus.PendingReview,
                OwnerId = Guid.NewGuid()
            };
            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();

            // Act
            var result = await _hotelService.ReviewHotelAsync(hotel.Id, HotelApprovalStatus.Approved);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(HotelApprovalStatus.Approved, result.ApprovalStatus);

            var dbHotel = await _context.Hotels.FindAsync(hotel.Id);
            Assert.NotNull(dbHotel);
            Assert.Equal(HotelApprovalStatus.Approved, dbHotel.ApprovalStatus);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
