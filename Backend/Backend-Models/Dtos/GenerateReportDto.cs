using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Enums;

namespace Backend_Models.Dtos
{
    public class GenerateReportDto
    {
        public string Email { get; set; }
        public SkinType SkinType { get; set; }
        public List<SkinGoal> SkinGoals { get; set; }
        public List<ProductReactionDto> Products { get; set; }
    }
}