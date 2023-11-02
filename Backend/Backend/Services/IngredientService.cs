using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Models;

namespace Backend.Services
{
    public class IngredientService : IIngredientService
    {
        private readonly IConfiguration Configuration;

        public IngredientService(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public async Task<List<IngredientAttribute>> fillIngredientAttributes(List<string> ingredients)
        {
            var api = new OpenAI_API.OpenAIAPI(Configuration["ChatGPT:APIKey"]);

            var response = await api.Completions.GetCompletion("What is the meaning of life?");

            Console.WriteLine(response);

            return new List<IngredientAttribute>();
        }
    }
}