using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_Models.Models
{
    public class ProductIngredient
    {
        public int Id { get; set; }
        
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
        
        public int IngredientId { get; set; }
        [ForeignKey("IngredientId")]
        public Ingredient? Ingredient { get; set; }
    }
}

