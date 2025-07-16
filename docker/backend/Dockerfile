FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS development
WORKDIR /app

# Copy csproj and restore dependencies
COPY modules/backend/*.csproj ./
RUN dotnet restore

# Copy everything else
COPY modules/backend .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development

# For development with hot reload
CMD ["dotnet", "watch", "run"]

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY modules/backend/*.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY modules/backend .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ScanNotesManager.Backend.dll"] 