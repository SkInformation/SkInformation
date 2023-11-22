using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_Models.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        [Required]
        // [Column(TypeName = "ENUM('MOISTURIZER','CLEANSER','SERUM','SUNSCREEN')")]
        public string Type { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        
        public ICollection<ProductIngredient> Mappings { get; set; }
    }
}

