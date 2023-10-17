using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Backend_Models.Enums
{
    public enum ProductType
    {
        [Display(Name = "MOISTURIZER")]
        Moisturizer,
        [Display(Name = "SERUM")]
        Serum,
        [Display(Name = "SUNSCREEN")]
        Sunscreen,
        [Display(Name = "CLEANSER")]
        Cleanser
    }
}