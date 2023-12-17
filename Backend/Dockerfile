# Use dotnet sdk 7.0 (reference: https://mcr.microsoft.com/product/dotnet/sdk/about)
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Set the working directory
WORKDIR /src

# Copy the .csproj file and restore dependencies
# It is faster this way (reference: https://www.docker.com/blog/9-tips-for-containerizing-your-net-application/)
COPY Backend/*.csproj .
RUN dotnet restore

# Copy the rest of the application code
COPY . .

# Build the application
RUN dotnet publish -c Release -o /app

# Use dotnet runtime 7.0 (reference: https://mcr.microsoft.com/product/dotnet/runtime/about)
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

# Set the working directory
WORKDIR /app

# Copy the published app from the build image
COPY --from=build /app .

# Expose the port the app runs on
EXPOSE 5100

# Run the app
CMD ["dotnet", "Backend.dll"]
