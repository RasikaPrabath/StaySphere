using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Infrastructure.Caching;
using StaySphere.Infrastructure.Identity;
using StaySphere.Infrastructure.Persistence;
using StaySphere.Infrastructure.Services;

namespace StaySphere.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // PostgreSQL DbContext
            var connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? configuration["DATABASE_URL"] 
                ?? "Host=localhost;Port=5432;Database=staysphere_db;Username=postgres;Password=postgres_secure_pass_2026";

            services.AddDbContext<StaySphereDbContext>(options =>
                options.UseNpgsql(connectionString, b => b.MigrationsAssembly(typeof(StaySphereDbContext).Assembly.FullName)));

            // Distributed Redis Cache
            var redisConnection = configuration["REDIS_URL"] ?? "localhost:6379";
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConnection;
                options.InstanceName = "StaySphere_";
            });

            services.AddScoped<ICacheService, RedisCacheService>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IImageUploadService, LocalImageUploadService>();
            services.AddScoped<IHotelService, HotelService>();
            services.AddScoped<IRoomService, RoomService>();
            services.AddScoped<ISearchService, SearchService>();
            services.AddScoped<IBookingService, BookingService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<IFavoriteService, FavoriteService>();
            services.AddScoped<ICouponService, CouponService>();

            // Configure JWT Authentication
            var secretKey = configuration["JWT_SECRET"] ?? "StaySphere_Super_Secret_Enterprise_JWT_Key_2026_Must_Be_At_Least_32_Chars!";
            var key = Encoding.UTF8.GetBytes(secretKey);

            services.AddAuthentication(defaultScheme: JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration["JWT_ISSUER"] ?? "StaySphereAPI",
                        ValidAudience = configuration["JWT_AUDIENCE"] ?? "StaySphereClients",
                        IssuerSigningKey = new SymmetricSecurityKey(key)
                    };
                });

            return services;
        }
    }
}
