using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StaySphere.Application.Common.Interfaces;
using StaySphere.Infrastructure.Caching;
using StaySphere.Infrastructure.Persistence;

namespace StaySphere.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // PostgreSQL Entity Framework Core DbContext
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

            return services;
        }
    }
}
