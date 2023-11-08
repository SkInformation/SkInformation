using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ReportController : Controller
    {
        private readonly AppDbContext _appDbContext;

        public ReportController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        /// <summary>
        /// Generates a report based on input provided.
        /// </summary>
        /// <param name="reportInput">A GenerateReportDto.</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GenerateReport(GenerateReportDto reportInput)
        {
            return Ok();
        }
    }
}