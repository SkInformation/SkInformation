using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Models;
using Newtonsoft.Json.Linq;

namespace Backend.Services
{
    public class IngredientService : IIngredientService
    {
        private readonly IConfiguration Configuration;

        public IngredientService(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// A function that will use ChatGPT to fill ingredient(s) attributes.
        /// </summary>
        /// <param name="ingredients">A list of ingredient(s)</param>
        /// <returns>A list of ingredient attributes</returns>
        public async Task<List<IngredientAttribute>> fillIngredientAttributes(List<string> ingredients)
        {
            var api = new OpenAI_API.OpenAIAPI(Configuration["ChatGPT:APIKey"]);

            JArray jsonArray = new JArray();

            foreach (string i in ingredients) {
                JObject jsonObj = new JObject();
                jsonObj["Name"] = i;
                jsonObj["Usage"] = "";
                jsonObj["EyeIrritant"] = false;
                jsonObj["DriesSkin"] = false;
                jsonObj["ReducesRedness"] = false;
                jsonObj["Hydrating"] = false;
                jsonObj["NonComedogenic"] = false;
                jsonObj["SafeForPregnancy"] = false;

                jsonArray.Add(jsonObj);
            }

            var chat = api.Chat.CreateConversation();

            /// give instruction as System
            chat.AppendSystemMessage(@"For each JSON object in the JSON array below, update all properties based on the ingredient Name field:
            Usage: A short description of what the ingredient does,
            EyeIrritant: If the ingredient causes eye irritation,
            DriesSkin: If the ingredient dries out the skin,
            ReducesRedness: If the ingredient reduces skin redness,
            Hydrating: If the ingredient provides skin hydration,
            NonComedogenic: If the ingredient is non-comedogenic,
            SafeForPregnancy: If the ingredient is safe to use during pregnancy,
            return the response as a parsable JSON array only. Do not include explanations or any other ingredients besides the list below:
            " + jsonArray.ToString());

            string response = await chat.GetResponseFromChatbotAsync();
            // Console.WriteLine(response);

            var ingredientList = new List<IngredientAttribute>();
            
            JArray ingredientJArray = JArray.Parse(response);
            
            foreach(JObject j in ingredientJArray) {
                ingredientList.Add(new (){
                    Name = (string) j["Name"]!,
                    Usage = (string) j["Usage"]!,
                    EyeIrritant = (bool) j["EyeIrritant"]!,
                    DriesSkin = (bool) j["DriesSkin"]!,
                    ReducesRedness = (bool) j["ReducesRedness"]!,
                    Hydrating = (bool) j["Hydrating"]!,
                    NonComedogenic = (bool) j["NonComedogenic"]!,
                    SafeForPregnancy = (bool) j["SafeForPregnancy"]!
                });
            }

            return ingredientList;
        }
    }
}