using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_Models.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        [Column(TypeName = "ENUM('MOISTURIZER','CLEANSER','SERUM','SUNSCREEN')")]
        public string Type { get; set; }
        public string Url { get; set; }
    }
}

