using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Backend.Services;
using Backend_Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
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
        /// Generates a report based on input provided.
        /// </summary>
        /// <param name="reportInput">A GenerateReportDto.</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GenerateReport(GenerateReportDto reportInput)
        {
            var status = await _emailService
                .SendEmail(new (){
                    To = reportInput.Email,
                    From = "testing@acio.dev",
                    TrackOpens = true,
                    Subject = "Your SkInformation Report",
                    TextBody = "Your report is ready!",
                    HtmlBody = "<h1>Your routine is great!</h1>",
                    Tag = "Customized user report about skincare."
                });

            if (status) {
                return Ok();
            }
            
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}