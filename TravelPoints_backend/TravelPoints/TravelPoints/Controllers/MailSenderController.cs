using Microsoft.AspNetCore.Mvc;
using TravelPoints.Models.Email;
using TravelPoints.Services.MailService;

namespace TravelPoints.Controllers
{
    //this controller is just for testing reasons and to help the FE Team understand the structure of the email sender. 
    //We will only use the Service combined with other controller in order to send emails.
    [Route("api/[controller]")]
    [ApiController] 
    public class MailSenderController : ControllerBase
    {
        private readonly IMailSenderService _mailSenderService;
        private ILogger<MailSenderController> _logger;
        public MailSenderController(IMailSenderService mailSenderService, ILogger<MailSenderController> logger)
        {
            _mailSenderService = mailSenderService;
            _logger = logger;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail(MailData email)
        {
            try
            {
               await _mailSenderService.SendRegisterEmailAsync(email);
               return Ok(new { Message = "The email was successfully sent!", MailData = email });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while sending the email");
            }
        }
    }
}
