using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
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
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
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

Log.Information("StaySphere Enterprise Web API starting up...");
app.Run();
