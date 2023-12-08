using Backend_Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Backend_Models.Models;
using Microsoft.EntityFrameworkCore;
using Backend_Models.Enums;
using System.Text.Json;
using Backend.Services;
using PostmarkDotNet;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class ReportController : Controller
{
    private readonly AppDbContext _appDbContext;
    private readonly IConfiguration _configuration;

    public ReportController(AppDbContext appDbContext, IConfiguration configuration)
    {
        _appDbContext = appDbContext;
        _configuration = configuration;
    }

    /// <summary>
    ///     Generates a report based on input provided.
    /// </summary>
    /// <param name="reportInput">A GenerateReportDto.</param>
    /// <returns>Report id</returns>
    [HttpPost]
    public async Task<IActionResult> Generate([FromServices] IServiceScopeFactory serviceScopeFactory,
        GenerateReportDto reportInput)
    {
        var triedProducts = GetTriedProducts(reportInput);
        var usedTypes = GetUsedProductTypes(triedProducts);
        var unusedRecommendations = GetUnusedProductRecommendations(usedTypes);

        var irritantAnalysis = new List<ProductIrritantAnalysisDto>();

        foreach (ProductReactionDto reactionDto in reportInput.Products)
        {
            var potentialIrritants = GetIngredientsCausingIrritation(reactionDto);
            var product = _appDbContext.Products.FirstOrDefault(p => p.Id == reactionDto.ProductId);

            if (product == null) continue;

            irritantAnalysis.Add(new ProductIrritantAnalysisDto
            {
                Product = product,
                PotentialIrritants = potentialIrritants
            });
        }

        var report = new ReportDto
        {
            ProductRecommendations = unusedRecommendations,
            IrritantAnalysis = irritantAnalysis
        };

        var serializedReport = JsonSerializer.Serialize(report);
        var reportDb = new Report
        {
            ReportDto = serializedReport
        };

        _appDbContext.Reports.Add(reportDb);
        _appDbContext.SaveChanges();

        string email = reportInput.Email;
        int reportId = reportDb.Id;

        _ = Task.Run(() => { DispatchReportEmail(serviceScopeFactory, email, reportId); });
        
        return Json(new IdDto { Id = reportDb.Id });
    }

    private async void DispatchReportEmail(IServiceScopeFactory serviceScopeFactory, string email, int reportId)
    {
        string templatesDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Templates");
        string emailTemplate = Path.Combine(templatesDirectory, "EmailTemplate.html");

        if (!System.IO.File.Exists(emailTemplate))
        {
            return;
        }
        
        string domain = _configuration.GetValue<string>("APP_URL") ?? "http://localhost:3000";
        string reportUrl = domain + "/report/" + reportId;
        string bodyHtml = System.IO.File.ReadAllText(emailTemplate).Replace("{%REPORT_ID_LINK%}", reportUrl);
        
        using (var scope = serviceScopeFactory.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<IEmailService>();
            await context
                .SendEmail(new PostmarkMessage
                {
                    To = email,
                    From = "SkInformation@skinformation.site",
                    TrackOpens = true,
                    Subject = "Your SkInformation Report",
                    TextBody = "Your report is ready!",
                    HtmlBody = bodyHtml,
                    Tag = "Customized user report about skincare."
                });
        }
    }

    /// <summary>
    ///     Get report details.
    /// </summary>
    /// <param name="reportId">Report id</param>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    public IActionResult Details(int reportId)
    {
        var report = _appDbContext.Reports
            .FirstOrDefault(r => r.Id == reportId);

        if (report == null)
        {
            return NotFound("Report not found");
        }

        var deSerialized = JsonSerializer.Deserialize<ReportDto>(report.ReportDto);

        return Json(deSerialized);
    }

    private HashSet<int> GetTriedProducts(GenerateReportDto dto)
    {
        var productIds = new HashSet<int>();

        foreach (ProductReactionDto p in dto.Products)
        {
            productIds.Add(p.ProductId);
        }

        return productIds;
    }

    private List<string> GetUsedProductTypes(HashSet<int> triedProducts)
    {
        return _appDbContext.Products
            .Where(p => triedProducts.Contains(p.Id))
            .Select(p => p.Type)
            .Distinct()
            .ToList();
    }

    private Dictionary<string, List<Product>> GetUnusedProductRecommendations(List<string> usedTypes)
    {
        var grouping = _appDbContext.Products
            .Where(p => !usedTypes.Contains(p.Type))
            .GroupBy(p => p.Type)
            .Select(group => group.Take(3))
            .ToList();

        var recommendations = new Dictionary<string, List<Product>>();

        foreach (IEnumerable<Product> e in grouping)
        {
            var products = e.ToList();
            recommendations[products[0].Type] = products;
        }

        return recommendations;
    }

    private List<PotentialIrritantDto> GetIngredientsCausingIrritation(ProductReactionDto dto)
    {
        // Store the reaction to all possible irritating ingredient
        var irritants = new Dictionary<ProductReaction, List<Ingredient>>();

        // Defaults
        foreach (ProductReaction reaction in dto.Reactions)
        {
            irritants[reaction] = new List<Ingredient>();
        }

        var productIngredients = _appDbContext.ProductIngredients
            .Include(i => i.Ingredient)
            .Where(i => i.ProductId == dto.ProductId)
            .ToList();

        foreach (var productIngredient in productIngredients)
        {
            var ingredient = productIngredient.Ingredient!;
            AddIngredientsToDictionary(ingredient.EyeIrritant, dto, ProductReaction.EyeIrritation, ingredient,
                irritants);
            AddIngredientsToDictionary(ingredient.DriesSkin, dto, ProductReaction.Flakiness, ingredient, irritants);
            AddIngredientsToDictionary(ingredient.DriesSkin, dto, ProductReaction.Itchiness, ingredient, irritants);
            AddIngredientsToDictionary(ingredient.DriesSkin, dto, ProductReaction.Redness, ingredient, irritants);
            AddIngredientsToDictionary(!ingredient.NonComedogenic, dto, ProductReaction.Swelling, ingredient,
                irritants);
        }

        var productIrritantAnalysisDtos = new List<PotentialIrritantDto>();

        foreach (var kvp in irritants)
        {
            productIrritantAnalysisDtos.Add(new PotentialIrritantDto
            {
                Type = kvp.Key.ToString(),
                Ingredients = kvp.Value
            });
        }

        return productIrritantAnalysisDtos;
    }

    private void AddIngredientsToDictionary(bool knownIrritant,
        ProductReactionDto dto,
        ProductReaction reaction,
        Ingredient ingredient,
        Dictionary<ProductReaction, List<Ingredient>> irritants)
    {
        if (knownIrritant && dto.Reactions.Contains(reaction))
        {
            irritants[reaction].Add(ingredient);
        }
    }
}