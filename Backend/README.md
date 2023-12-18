# SkInformation Backend
![license](https://img.shields.io/badge/license-MIT-green)
![dotnet version](https://img.shields.io/badge/dotnet-v7.0-blue)

## How to Run
### Step 1
Install [Docker](https://docs.docker.com/get-docker/)

### Step 2
Pull Microsoft Sql Server image
```bash
docker pull mcr.microsoft.com/mssql/server:2022-latest
```

### Step 3: Creating the container
Run the image
```bash
docker run --platform linux/amd64 -d --name skinformation_db -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=Password1!' -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
```

### Step 4: Creating connection string
Create a file in Backend/Backend folder called `appsettings.Development.json` with the following:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=skinformation;User Id=sa;Password=Password1!;Encrypt=False"
  },
  "ChatGPT_API_Key": "API_KEY",
  "Postmark_API_Key": "API_KEY",
  "FrontendUrl": "http://localhost:3000"
}
```

### Step 5: Running the project
Run backend project
```bash
dotnet run
```
