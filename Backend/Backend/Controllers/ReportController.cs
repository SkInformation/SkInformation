using Backend_Models.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using PostmarkDotNet;

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
}