using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Models;

namespace Backend_Models.Dtos
{
    public class ProductIngredientDto
    {
        public ProductDto Product { get; set; }
        public List<Ingredient> Ingredients { get; set; }
    }
}