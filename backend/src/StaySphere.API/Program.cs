using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Serilog;
using StaySphere.Application.Common.Interfaces;
using StaySphere.API.Hubs;
using StaySphere.API.Services;
using StaySphere.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog Logger
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Add Clean Architecture Infrastructure & Services
builder.Services.AddInfrastructure(builder.Configuration);

// SignalR real-time hub
builder.Services.AddSignalR();

// Hangfire background jobs (PostgreSQL storage)
var connectionString = builder.Configuration["DATABASE_URL"]
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=staysphere_db;Username=postgres;Password=postgres_secure_pass_2026";

builder.Services.AddHangfire(config =>
    config.UsePostgreSqlStorage(opts => opts.UseNpgsqlConnection(connectionString)));
builder.Services.AddHangfireServer();

// Override INotificationService stub with real SignalR implementation
builder.Services.AddScoped<INotificationService, SignalRNotificationService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS for Frontend Client — must allow credentials for SignalR
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowStaySphereFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure HTTP Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "StaySphere Enterprise API v1");
    });
}

app.UseSerilogRequestLogging();
app.UseCors("AllowStaySphereFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// SignalR Hub endpoint
app.MapHub<NotificationHub>("/hubs/notifications");

// Hangfire Dashboard (admin only in production)
app.UseHangfireDashboard("/hangfire");

// System Health Check Endpoint
app.MapGet("/api/v1/health", () => Results.Ok(new
{
    Status = "Healthy",
    System = "StaySphere Enterprise Platform",
    Timestamp = System.DateTime.UtcNow,
    Version = "1.0.0-phase9"
}));

// Apply database schema initialization on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<StaySphere.Infrastructure.Persistence.StaySphereDbContext>();
    try
    {
        var databaseCreator = (Microsoft.EntityFrameworkCore.Storage.IRelationalDatabaseCreator)
            context.Database.GetService<Microsoft.EntityFrameworkCore.Storage.IDatabaseCreator>();
        
        if (!databaseCreator.Exists())
        {
            databaseCreator.Create();
        }
        
        try
        {
            // Specifically check if application tables are initialized
            _ = context.Users.Any();
            Log.Information("Application tables created/verified successfully.");
        }
        catch (System.Exception)
        {
            Log.Information("Application tables do not exist. Initializing schema...");
            databaseCreator.CreateTables();
            Log.Information("Application tables created successfully.");
        }

        // Seed role demo accounts if missing
        try
        {
            var hasher = scope.ServiceProvider.GetRequiredService<StaySphere.Application.Common.Interfaces.IPasswordHasher>();
            var seedUsers = new[]
            {
                new StaySphere.Domain.Entities.User
                {
                    Id = Guid.NewGuid(),
                    Email = "customer@staysphere.com",
                    PasswordHash = hasher.HashPassword("Password123!"),
                    FirstName = "Kasun",
                    LastName = "Perera",
                    PhoneNumber = "0771234567",
                    Role = StaySphere.Domain.Enums.UserRole.Customer,
                    IsEmailVerified = true,
                    CreatedAtUtc = DateTime.UtcNow,
                    LastModifiedAtUtc = DateTime.UtcNow
                },
                new StaySphere.Domain.Entities.User
                {
                    Id = Guid.NewGuid(),
                    Email = "owner@staysphere.com",
                    PasswordHash = hasher.HashPassword("Password123!"),
                    FirstName = "Kamal",
                    LastName = "Silva",
                    PhoneNumber = "0773456789",
                    Role = StaySphere.Domain.Enums.UserRole.Partner,
                    IsEmailVerified = true,
                    CreatedAtUtc = DateTime.UtcNow,
                    LastModifiedAtUtc = DateTime.UtcNow
                },
                new StaySphere.Domain.Entities.User
                {
                    Id = Guid.NewGuid(),
                    Email = "admin@staysphere.com",
                    PasswordHash = hasher.HashPassword("Password123!"),
                    FirstName = "System",
                    LastName = "Admin",
                    PhoneNumber = "0774567890",
                    Role = StaySphere.Domain.Enums.UserRole.Admin,
                    IsEmailVerified = true,
                    CreatedAtUtc = DateTime.UtcNow,
                    LastModifiedAtUtc = DateTime.UtcNow
                }
            };

            // Clear old legacy accounts if present
            var oldEmails = new[] { "staff@staysphere.com", "superadmin@staysphere.com" };
            var oldUsers = context.Users.Where(x => oldEmails.Contains(x.Email)).ToList();
            if (oldUsers.Any())
            {
                context.Users.RemoveRange(oldUsers);
                context.SaveChanges();
            }

            bool seededAny = false;
            foreach (var u in seedUsers)
            {
                var existingUser = context.Users.FirstOrDefault(x => x.Email == u.Email);
                if (existingUser != null)
                {
                    if (existingUser.Role != u.Role)
                    {
                        existingUser.Role = u.Role;
                        seededAny = true;
                    }
                }
                else
                {
                    context.Users.Add(u);
                    seededAny = true;
                }
            }
            if (seededAny)
            {
                context.SaveChanges();
                Log.Information("Role-based user accounts seeded/updated successfully.");
            }
        }
        catch (System.Exception ex)
        {
            Log.Warning(ex, "Failed seeding demo users.");
        }
    }
    catch (System.Exception ex)
    {
        Log.Error(ex, "Failed to initialize Database on startup.");
    }
}

Log.Information("StaySphere Enterprise Web API starting up...");
app.Run();
