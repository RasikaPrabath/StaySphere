using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
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

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS for Frontend Client
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
app.UseAuthorization();

app.MapControllers();

// System Health Check Endpoint
app.MapGet("/api/v1/health", () => Results.Ok(new
{
    Status = "Healthy",
    System = "StaySphere Enterprise Platform",
    Timestamp = System.DateTime.UtcNow,
    Version = "1.0.0-phase1"
}));

Log.Information("StaySphere Enterprise Web API starting up...");
app.Run();
