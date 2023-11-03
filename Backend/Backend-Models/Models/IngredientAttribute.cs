using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_Models.Models
{
    public class IngredientAttribute
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Usage { get; set; } = string.Empty;  //Ex: Glycerin improves hydration.
        public bool EyeIrritant { get; set; }
        public bool DriesSkin { get; set; }
        public bool ReducesRedness { get; set; }
        public bool Hydrating { get; set; }
        public bool NonComedogenic { get; set; }
        public bool SafeForPregnancy { get; set; }
    }
}