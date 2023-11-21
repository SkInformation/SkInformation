using Backend_Models.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class IngredientController : Controller
{
    private readonly AppDbContext _appDbContext;
    private readonly IIngredientService _ingredientService;

    public IngredientController(AppDbContext appDbContext, IIngredientService ingredientService)
    {
        _ingredientService = ingredientService;
        _appDbContext = appDbContext;
    }

    /// <summary>
    /// Returns list of all ingredients.
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json", Type = typeof(List<Ingredient>))]
    public IActionResult All()
    {
        var ingredients = _appDbContext.Ingredients.ToList();
        return Json(ingredients);
    }

    /// <summary>
    ///     Searches database for ingredients with a name that contains term.
    /// </summary>
    /// <param name="term">Ingredient name or partial name.</param>
    /// <returns>A list of ingredients.</returns>
    [HttpGet]
    [Produces("application/json", Type = typeof(List<Ingredient>))]
    public IActionResult Search(string term)
    {
        var ingredients = _appDbContext.Ingredients
            .Where(i => i.Name.Contains(term))
            .ToList();

        return Json(ingredients);
    }

    /// <summary>
    ///     Creates an ingredient to add into the database.
    /// </summary>
    /// <param name="ingredient">Name of ingredient to create</param>
    /// <returns>An ingredient and its attributes.</returns>
    [HttpPost]
    [Produces("application/json", Type = typeof(Ingredient))]
    public IActionResult Create([FromServices] IServiceScopeFactory serviceScopeFactory, string ingredient)
    {
        ingredient = ingredient.ToUpper();

        var existingIngredient = _appDbContext.Ingredients
            .FirstOrDefault(i => i.Name.Equals(ingredient));

        if (existingIngredient != null) return Json(existingIngredient);

        var ingredientAttribute = new Ingredient
        {
            Name = ingredient,
            Usage = ""
        };

        _appDbContext.Ingredients.Add(ingredientAttribute);
        _appDbContext.SaveChanges();


        _ = Task.Run(async () =>
        {
            var temp = await _ingredientService
                .fillIngredientAttributes(new List<string> { ingredient });

            if (temp.Count == 1)
                using (var scope = serviceScopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    var ingredientAttribute = context.Ingredients
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
        });

        return Json(ingredientAttribute);
    }
}