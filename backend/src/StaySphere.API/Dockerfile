# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

# Copy csproj and restore dependencies
COPY src/StaySphere.Domain/StaySphere.Domain.csproj src/StaySphere.Domain/
COPY src/StaySphere.Application/StaySphere.Application.csproj src/StaySphere.Application/
COPY src/StaySphere.Infrastructure/StaySphere.Infrastructure.csproj src/StaySphere.Infrastructure/
COPY src/StaySphere.API/StaySphere.API.csproj src/StaySphere.API/
COPY src/StaySphere.UnitTests/StaySphere.UnitTests.csproj src/StaySphere.UnitTests/
COPY StaySphere.sln ./
RUN dotnet restore StaySphere.sln

# Copy everything else and build release
COPY src/ ./src/
RUN dotnet publish src/StaySphere.API/StaySphere.API.csproj -c Release -o out

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /app/out .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "StaySphere.API.dll"]
