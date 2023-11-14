using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Enums;

namespace Backend_Models.Dtos
{
    public class ProductReactionDto
    {
        public int ProductId { get; set; }
        public List<ProductReaction> Reactions { get; set; }
    }
}