using Microsoft.EntityFrameworkCore;

namespace Backend
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context =
                   new AppDbContext(serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>()))
            {
                context.Database.Migrate();
                
                if (context.Products.Any())
                {
                    return;
                }
                
                context.Database.EnsureCreated();
                string seedDataDirectory = "Database/Data";
                string[] sqlFilesNames = {"Products.sql"};
                
                foreach (string sqlFileName in sqlFilesNames)
                {
                    string sqlFilePath = Path.Combine(seedDataDirectory, sqlFileName);

                    if (File.Exists(sqlFilePath))
                    {
                        string sqlScript = File.ReadAllText(sqlFilePath);
                        context.Database.ExecuteSqlRaw(sqlScript);
                    }
                }
            }
        }
    }
}