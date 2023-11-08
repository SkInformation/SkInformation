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
                if (context.Products.Any())
                {
                    return;
                }
                
                context.Database.EnsureCreated();
                string seedDataDirectory = "Database/Data";
                string[] sqlFilesNames = {"products_import.sql", "attributes_import.sql", "ingredients_import.sql"};
                
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