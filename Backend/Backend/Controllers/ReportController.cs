using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
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
    }
}