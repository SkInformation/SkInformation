using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PostmarkDotNet;

namespace Backend.Services
{
    public interface IEmailService
    {
        public Task<bool> SendEmail(PostmarkMessage email);
    }
}