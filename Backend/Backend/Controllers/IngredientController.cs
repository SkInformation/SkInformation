using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Backend.Services;
using Backend_Models.Dtos;
using Backend_Models.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class IngredientController : Controller
    {
        private readonly IIngredientService _ingredientService;
        private readonly AppDbContext _appDbContext;

        public IngredientController(AppDbContext appDbContext, IIngredientService ingredientService)
        {
            _ingredientService = ingredientService;
            _appDbContext = appDbContext;
        }

        /// <summary>
        /// Searches database for ingredients with a name that contains term.
        /// </summary>
        /// <param name="term">Ingredient name or partial name.</param>
        /// <returns>A list of ingredients.</returns>
        [HttpGet]
        [Produces("application/json", Type = typeof (List<IngredientAttribute>))]
        public IActionResult Search(string term)
        {
            var ingredients = _appDbContext.IngredientAttributes
                .Where(i => i.Name.Contains(term))
                .ToList();

            return Json(ingredients);
        }

        /// <summary>
        /// Creates an ingredient to add into the database.
        /// </summary>
        /// <param name="ingredient">Name of ingredient to create</param>
        /// <returns>An ingredient id.</returns>
        [HttpPost]
        [Produces("application/json", Type = typeof (IdDto))]
        public IActionResult Create([FromServices] IServiceScopeFactory serviceScopeFactory, string ingredient)
        {
            ingredient = ingredient.ToUpper();

            var existingIngredient = _appDbContext.IngredientAttributes
                .FirstOrDefault(i => i.Name.Equals(ingredient));

            if (existingIngredient != null) {
                return Json( new { Id = existingIngredient.Id });
            }

            var ingredientAttribute = new IngredientAttribute{
                Name = ingredient,
                Usage = "",
            };

            _appDbContext.IngredientAttributes.Add(ingredientAttribute);
            _appDbContext.SaveChanges();


            _ = Task.Run(async () => {
                var temp = await _ingredientService
                    .fillIngredientAttributes(new List<string>{ ingredient });

                if (temp.Count == 1) {
                    using (var scope = serviceScopeFactory.CreateScope()){
                        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                        var ingredientAttribute = context.IngredientAttributes
                            .First(i => i.Name.Equals(ingredient));

                        ingredientAttribute.DriesSkin = temp[0].DriesSkin;
                        ingredientAttribute.EyeIrritant = temp[0].EyeIrritant;
                        ingredientAttribute.Hydrating = temp[0].Hydrating;
                        ingredientAttribute.NonComedogenic = temp[0].NonComedogenic;
                        ingredientAttribute.ReducesRedness = temp[0].ReducesRedness;
                        ingredientAttribute.SafeForPregnancy = temp[0].SafeForPregnancy;
                        ingredientAttribute.Usage = temp[0].Usage;

                        context.SaveChanges();
                    }
                }
            });
            
            return Json(new IdDto{ Id = ingredientAttribute.Id });
        }
    }
}