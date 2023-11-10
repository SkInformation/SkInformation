using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_Models.Models
{
    public class ProductIngredient
    {
        public int Id { get; set; }
        
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
        
        public int AttributeId { get; set; }
        [ForeignKey("AttributeId")]
        public Ingredient Attribute { get; set; }
    }
}

