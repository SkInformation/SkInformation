using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [Route("[controller]/[action]")]
    public class IngredientController : Controller
    {
        private readonly IIngredientService _ingredientService;
        private readonly ILogger<IngredientController> _logger;
        private readonly AppDbContext _appDbContext;

        public IngredientController(ILogger<IngredientController> logger, AppDbContext appDbContext, IIngredientService ingredientService)
        {
            _ingredientService = ingredientService;
            _logger = logger;
            _appDbContext = appDbContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("Error!");
        }

        public IActionResult All()
        {
            var ingredients = _appDbContext.Ingredients.ToList();

            return Json( new { ingredients });
        }

        public IActionResult Search(string term)
        {
            var ingredients = _appDbContext.IngredientAttributes
                .Where(i => i.Name.Contains(term))
                .ToList();

            return Json(new { ingredients });
        }

        public async Task<IActionResult> Test()
        {
            await _ingredientService.fillIngredientAttributes(new List<string>());

            return Ok();
        }
    }
}