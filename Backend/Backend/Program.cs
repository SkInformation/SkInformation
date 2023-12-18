using Backend;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var connectionString = "temp";
if (Environment.GetEnvironmentVariable("IS_DOCKER") == null)
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
}
else
{
    // Consider the docker appsettings file
    builder.Configuration
        .AddJsonFile("appsettings.Docker.json", true)
        .AddEnvironmentVariables();

    // Grab the base configuration file
    var conf = builder.Configuration;
    
    // Update in-memory strings with secrets loaded from Docker
    conf.GetSection("ChatGPT_API_Key").Value =
        SKUtils.ToString(conf["ChatGPT_API_Key"] ?? "/run/secrets/chatgpt_api_key.txt");
    conf.GetSection("Postmark_API_Key").Value =
        SKUtils.ToString(conf["Postmark_API_Key"] ?? "/run/secrets/postmark_api_key.txt");
    
    // Load the database details
    var dbConf = conf.GetSection("Database");
    // Determine the docker secret file path
    var password = SKUtils.ToString(dbConf["Password"] ?? "/run/secrets/db_password.txt");
    // Setup the connection string
    connectionString =
        $"Server={dbConf["Server"]};Database={dbConf["Database"]};User Id={dbConf["User"]};Password={password};Encrypt=false";
}

// Add the DbContext with the connection string
builder.Services.AddDbContext<AppDbContext>(
    options => options
        .UseSqlServer(connectionString,
            dbOptions => { dbOptions.EnableRetryOnFailure(); }));

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<IIngredientService, IngredientService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "SkInformation API",
    });

    // using System.Reflection;
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

// Reference: https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-8.0
const string originsKey = "_SkInformationAllowedOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: originsKey,
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    SeedData.Initialize(services);
}

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors(originsKey);
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();