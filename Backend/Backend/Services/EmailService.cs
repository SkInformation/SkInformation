using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PostmarkDotNet;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly PostmarkClient _postmarkClient;
        public EmailService(IConfiguration configuration)
        {
            _postmarkClient = new PostmarkClient(configuration.GetValue<string>("PostmarkAPI"));
        }
        public async Task<bool> SendEmail(PostmarkMessage email)
        {
            var sendResult = await _postmarkClient.SendMessageAsync(email);

            return sendResult.Status == PostmarkStatus.Success;
        }
    }
}