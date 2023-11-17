using Backend_Models.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using PostmarkDotNet;
using Backend_Models.Models;
using Microsoft.EntityFrameworkCore;
using Backend_Models.Enums;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class ReportController : Controller
{
    private readonly AppDbContext _appDbContext;
    private readonly IEmailService _emailService;

    public ReportController(AppDbContext appDbContext, IEmailService emailService)
    {
        _appDbContext = appDbContext;
        _emailService = emailService;
    }

    /// <summary>
    ///     Generates a report based on input provided.
    /// </summary>
    /// <param name="reportInput">A GenerateReportDto.</param>
    /// <returns></returns>
    [HttpPost]
    public async Task<IActionResult> GenerateReport(GenerateReportDto reportInput)
    {
        var status = await _emailService
            .SendEmail(new PostmarkMessage
            {
                To = reportInput.Email,
                From = "testing@acio.dev",
                TrackOpens = true,
                Subject = "Your SkInformation Report",
                TextBody = "Your report is ready!",
                HtmlBody = "<h1>Your routine is great!</h1>",
                Tag = "Customized user report about skincare."
            });

        if (status) return Ok();

        return new StatusCodeResult(StatusCodes.Status500InternalServerError);
    }

    private HashSet<int> GetTriedProducts(GenerateReportDto dto) {
        var productIds = new HashSet<int>();
        
        foreach(ProductReactionDto p in dto.Products) {
            productIds.Add(p.ProductId);
        }

        return productIds;
    }

    private List<string> GetUsedProductTypes(HashSet<int> triedProducts) {
        return _appDbContext.Products
            .Where(p => triedProducts.Contains(p.Id))
            .Select(p => p.Type)
            .Distinct() 
            .ToList();
    }

    private Dictionary<string, List<Product>> GetUnusedProductRecommendations(List<string> usedTypes) {
        var grouping = _appDbContext.Products
             .Where(p => !usedTypes.Contains(p.Type))
             .GroupBy(p => p.Type)
             .Select(group => group.Take(3))
             .ToList();

        var recommendations = new Dictionary<string, List<Product>>();

        foreach(IEnumerable<Product> e in grouping) {
            var products = e.ToList();
            recommendations[products[0].Type] = products;
        }

        return recommendations;
    }

    private Dictionary<ProductReaction, List<Ingredient>> GetIngredientsCausingIrritation(ProductReactionDto dto) {
        // Store the reaction to all possible irritating ingredient
        var irritants = new Dictionary<ProductReaction, List<Ingredient>>();

        // Defaults
        foreach (ProductReaction reaction in dto.Reactions) {
            irritants[reaction] = new List<Ingredient>();
        }

        var productIngredients = _appDbContext.ProductIngredients
            .Include(i => i.Ingredient)
            .Where(i => i.ProductId == dto.ProductId)
            .ToList();
        
        foreach (var productIngredient in productIngredients) {
            var ingredient = productIngredient.Ingredient!;
            AddIngredientsToDictionary(ingredient.EyeIrritant, dto, ProductReaction.EyeIrritation, ingredient, irritants);
            AddIngredientsToDictionary(ingredient.DriesSkin, dto, ProductReaction.Flakiness, ingredient, irritants);
            AddIngredientsToDictionary(ingredient.DriesSkin, dto, ProductReaction.Itchiness, ingredient, irritants);
            AddIngredientsToDictionary(ingredient.DriesSkin, dto, ProductReaction.Redness, ingredient, irritants);
            AddIngredientsToDictionary(!ingredient.NonComedogenic, dto, ProductReaction.Swelling, ingredient, irritants);
        }

        return irritants;
    }

    private void AddIngredientsToDictionary(bool knownIrritant, 
                                            ProductReactionDto dto, 
                                            ProductReaction reaction, 
                                            Ingredient ingredient, 
                                            Dictionary<ProductReaction, List<Ingredient>> irritants)
    {
        if (knownIrritant && dto.Reactions.Contains(reaction)) {
            irritants[reaction].Add(ingredient);
        }
    }
}