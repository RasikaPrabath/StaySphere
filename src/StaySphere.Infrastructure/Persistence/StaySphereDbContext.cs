using Microsoft.EntityFrameworkCore;
using StaySphere.Domain.Entities;

namespace StaySphere.Infrastructure.Persistence
{
    public class StaySphereDbContext : DbContext
    {
        public StaySphereDbContext(DbContextOptions<StaySphereDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Hotel> Hotels => Set<Hotel>();
        public DbSet<Room> Rooms => Set<Room>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Review> Reviews => Set<Review>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
            });

            // Hotel configuration
            modelBuilder.Entity<Hotel>(entity =>
            {
                entity.HasKey(h => h.Id);
                entity.Property(h => h.Name).IsRequired().HasMaxLength(200);
                entity.HasIndex(h => h.City);
                entity.HasIndex(h => h.Country);
                entity.HasIndex(h => h.ApprovalStatus);
                entity.HasOne(h => h.Owner)
                      .WithMany(u => u.OwnedHotels)
                      .HasForeignKey(h => h.OwnerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Room configuration
            modelBuilder.Entity<Room>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.HasIndex(r => r.Status);
                entity.HasIndex(r => r.PricePerNight);
                entity.HasOne(r => r.Hotel)
                      .WithMany(h => h.Rooms)
                      .HasForeignKey(r => r.HotelId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Booking configuration
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.HasIndex(b => b.BookingReference).IsUnique();
                entity.HasOne(b => b.User)
                      .WithMany(u => u.Bookings)
                      .HasForeignKey(b => b.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(b => b.Room)
                      .WithMany(r => r.Bookings)
                      .HasForeignKey(b => b.RoomId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Payment configuration
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.HasOne(p => p.Booking)
                      .WithOne(b => b.Payment)
                      .HasForeignKey<Payment>(p => p.BookingId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Review configuration
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(rw => rw.Id);
                entity.HasOne(rw => rw.Hotel)
                      .WithMany(h => h.Reviews)
                      .HasForeignKey(rw => rw.HotelId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
