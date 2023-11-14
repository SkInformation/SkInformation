using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Models;

namespace Backend.Services
{
    public interface IIngredientService
    {
        public Task<List<Ingredient>> fillIngredientAttributes(List<string> ingredients);
    }
}