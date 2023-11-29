using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Models;

namespace Backend_Models.Dtos
{

    public class ReportDto
    {
        public Dictionary<string, List<Product>> ProductRecommendations { get; set; }
        public List<ProductIrritantAnalysisDto> IrritantAnalysis { get; set; }
    }
}