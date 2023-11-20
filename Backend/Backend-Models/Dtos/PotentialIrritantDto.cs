using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Enums;
using Backend_Models.Models;

namespace Backend_Models.Dtos
{
    public class PotentialIrritantDto
    {
        public string Type { get; set; }
        public List<Ingredient> Ingredients { get; set; }
    }
}