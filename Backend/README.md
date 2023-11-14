
# Setting up backend environment
### Step 1
- Install Docker and Docker CLI

### Step 2
- Pull Sql server image
    ```
    docker pull mcr.microsoft.com/mssql/server:2022-latest
    ```

### Step 3: Creating the container
- Run the image
    ```
    docker run --platform linux/amd64 -d --name mssql_dev -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=Password1!' -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
    ```

### Step 4: Creating connection string
- Create a file in Backend/Backend folder called `appsettings.Development.json`
- Add the following to the file
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
            "DefaultConnection": "Server=localhost;Database=yourDatabase;User Id=username;Password=password"
        }
    }
    ```
- Update db connection details

### Step 5: Running the project
- Update database
    ```
    dotnet ef database update
    ```
- Run backend project
    ```
    dotnet run
    ```
