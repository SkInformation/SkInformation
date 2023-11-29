using Backend_Models.Dtos;
using Backend_Models.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class ProductController : Controller
{
    private readonly AppDbContext _appDbContext;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public ProductController(AppDbContext appDbContext, IWebHostEnvironment webHostEnvironment)
    {
        _appDbContext = appDbContext;
        _webHostEnvironment = webHostEnvironment;
    }

    /// <summary>
    ///     Searches database for a product name that contains term.
    /// </summary>
    /// <param name="term">The product name or partial name.</param>
    /// <returns>A list of products and their ingredients.</returns>
    [HttpGet]
    [Produces("application/json", Type = typeof(List<ProductDto>))]
    public IActionResult Search(string term)
    {
        var products = _appDbContext.Products
            .Where(p => p.Name.Contains(term))
            .Select(p => new ProductDto()
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Type = p.Type,
                Url = p.Url,
                Thumbnail = "/images/products/" + p.Id + ".png",
                Ingredients = p.Mappings.Select(pi => pi.Ingredient!).ToList()
            })
            .ToList();

        return Json(products);
    }

    /// <summary>
    ///     Creates a product to add to the database.
    /// </summary>
    /// <param name="product">Product form details</param>
    /// <returns>A product id.</returns>
    [HttpPost]
    [Produces("application/json", Type = typeof(IdDto))]
    public IActionResult Create([FromForm] CreateProductDto product)
    {
        var productExists = _appDbContext.Products
            .FirstOrDefault(p => p.Name.Equals(product.Name));

        if (productExists != null) return Json(new IdDto { Id = productExists.Id });

        var newProduct = new Product
        {
            Name = product.Name,
            Description = product.Description,
            Type = product.Type,
            Url = product.Url
        };

        _appDbContext.Products.Add(newProduct);

        _appDbContext.SaveChanges();

        UploadImage(product.thumbnail, newProduct.Id);

        return Json(new IdDto { Id = newProduct.Id });
    }

    /// <summary>
    ///     Helper function that will create an image file for file upload.
    /// </summary>
    /// <param name="thumbnail">File upload for image</param>
    /// <param name="id">The product id</param>
    private void UploadImage(IFormFile? thumbnail, int id)
    {
        if (thumbnail == null) return;

        var wwwrootPath = _webHostEnvironment.WebRootPath;

        var imagePath = Path.Combine(wwwrootPath, @"images/products");

        using (var fileStream = new FileStream(Path.Combine(imagePath, $"{id}.png"), FileMode.Create))
        {
            thumbnail.CopyTo(fileStream);
        }
    }

    /// <summary>
    ///     Function to add an ingredient to a product
    /// </summary>
    /// <param name="attributeId">The ingredient id</param>
    /// <param name="productId">The product id</param>
    /// <returns></returns>
    [HttpPost]
    public IActionResult AddIngredient(int attributeId, int productId)
    {
        var ingredientExists = _appDbContext.ProductIngredients
            .FirstOrDefault(i => i.IngredientId == attributeId && i.ProductId == productId);

        if (ingredientExists != null) return Ok();

        var ingredient = new ProductIngredient
        {
            ProductId = productId,
            IngredientId = attributeId
        };

        _appDbContext.ProductIngredients.Add(ingredient);
        _appDbContext.SaveChanges();

        return Ok();
    }

    /// <summary>
    ///     Function to add multiple ingredients to a single product.
    /// </summary>
    /// <param name="attributeIds">List of ingredient ids.</param>
    /// <param name="productId">A single product id</param>
    /// <returns></returns>
    [HttpPost]
    public IActionResult AddIngredients(List<int> attributeIds, int productId)
    {
        foreach (var i in attributeIds)
        {
            var ingredientExists = _appDbContext.ProductIngredients
                .FirstOrDefault(ingredient => ingredient.IngredientId == i && ingredient.ProductId == productId);

            if (ingredientExists != null) continue;

            _appDbContext.ProductIngredients.Add(new ProductIngredient
            {
                ProductId = productId,
                IngredientId = i
            });
        }

        _appDbContext.SaveChanges();

        return Ok();
    }
}