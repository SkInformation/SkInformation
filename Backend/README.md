
# Setting up backend environment
### Step 1
- Install Docker and Docker CLI

### Step 2
- Pull MySQL server image
    ```
    docker pull mysql/mysql-server:latest
    ```

### Step 3: Creating the container
- Run the image
    ```
    docker run -p 3306:3306 --name comp584 -d mysql/mysql-server:latest
    ```

### Step 4: Create MySQL user for backend
- Show default installation password
    ```
    docker logs comp584 2>&1 | grep GENERATED
    ```
- Enter Docker CLI
    ```
    docker exec -it comp584 mysql -u root -p
    ```
- Change root user password
    ```SQL
    ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourPassword';
    ```
- Create user for the backend
    ```SQL
    CREATE USER 'comp584'@'%' IDENTIFIED BY 'YourPassword';
    ```
- Grant all privileges to user
    ```SQL
    GRANT ALL PRIVILEGES ON comp584.* TO 'comp584'@'%' WITH GRANT OPTION;
    ```
- Flush privileges and exit server
    ```
    FLUSH PRIVILEGES;
    ```
    ```
    exit;
    ```

### Step 5: Creating user secrets
- Install dotnet user-secrets tool
    ```
    dotnet tool install --global dotnet-user-secrets
    ```
- Initialize user-secrets
    ```
    dotnet user-secrets init
    ```
- Set user-secrets for db connection string
    ```
    dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=YourServer;Database=YourDatabase;User=YourUser;Password=YourPassword;"
    ```

### Step 6: Running the project
- Update database
    ```
    dotnet ef database update
    ```
- Run backend project
    ```
    dotnet run
    ```
