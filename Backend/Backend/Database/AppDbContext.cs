using Backend_Models.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend
{
    public class AppDbContext : DbContext
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<IngredientAttribute> IngredientAttributes { get; set; }
        
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<IngredientAttribute>()
                .HasIndex(u => u.Name)
                .IsUnique();
        }
    }
}
