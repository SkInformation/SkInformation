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
    [Route("[controller]/[action]")]
    public class ProductController : Controller
    {
        private readonly ILogger<ProductController> _logger;
        private readonly AppDbContext _appDbContext;

        public ProductController(ILogger<ProductController> logger, AppDbContext appDbContext)
        {
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
            var products = _appDbContext.Products.ToList();

            return Json(new { products });
        }

        public IActionResult Search(string term) {
            var products = _appDbContext.Products
                .Where(p => p.Name.Contains(term))
                .Select(p => new ProductDto{
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Type = p.Type,
                    Url = p.Url,
                    Thumbnail = "/images/products/" + p.Id + ".png"
                })
                .ToList();

            return Json(new { products });
        }

    }
}