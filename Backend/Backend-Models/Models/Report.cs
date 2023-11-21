using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Models.Dtos;

namespace Backend_Models.Models
{
    public class Report
    {
        public int Id { get; set; }
        public required string ReportDto { get; set; }
    }
}