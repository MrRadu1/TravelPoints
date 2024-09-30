
using Microsoft.Extensions.Options;
using System.Net.Mail;
using TravelPoints.Models.Email;
using TravelPoints.Models.Entites.TravelPoints;

namespace TravelPoints.Services.MailService
{
    public class MailSenderService : IMailSenderService
    {
        private readonly MailSettings _mailSettings;
        private readonly SmtpClient _smtpClient;
        private readonly IEmailTemplateService _emailTemplate;
        public MailSenderService(IOptions<MailSettings> mailSettings, 
            IEmailTemplateService emailTemplate) 
        {
            _mailSettings = mailSettings.Value;
            _emailTemplate = emailTemplate;
            _smtpClient = new SmtpClient();

            this.SetUpMailConfiguration();
        }

        public async Task SendEmailAsync(MailData mailData, string template)
        {
            MailMessage email = new MailMessage();

            email.To.Add(mailData.EmailToAddress);
            email.From = new MailAddress(_mailSettings.SenderEmail, _mailSettings.SenderName);
            email.Subject = mailData.EmailSubject;

            email.IsBodyHtml = true;
            email.Body = template;

            await _smtpClient.SendMailAsync(email);
        }

        public async Task SendNewOfferEmailAsync(MailData email, Point travelPoint)
        {
            var template = _emailTemplate.GetNewOfferTemplate(email.EmailBody, _mailSettings.SenderEmail, travelPoint);

            await SendEmailAsync(email, template);
        }

        public async Task SendRegisterEmailAsync(MailData email)
        {
            var template = _emailTemplate.GetRegisteredTemplate(email.EmailBody, _mailSettings.SenderEmail);

            await SendEmailAsync(email, template);
        }

        public async Task SendFeedbackEmailAsync(MailData email, string feedback)
        {
            var template = _emailTemplate.GetFeedbackTemplate(email.EmailBody, feedback);

            await SendEmailAsync(email, template);
        }

        public async Task SendPasswordResetMail(MailData mailData, string link)
        {

            var template = _emailTemplate.GetResetPasswordTemplate(mailData.EmailBody, _mailSettings.SenderEmail, link);

            await SendEmailAsync(mailData, template);
        }

        private void SetUpMailConfiguration()
        {
            _smtpClient.Host = _mailSettings.Host;
            _smtpClient.Port = _mailSettings.Port;
            _smtpClient.EnableSsl = true;
            _smtpClient.UseDefaultCredentials = false;
            _smtpClient.Credentials = new System.Net.NetworkCredential(
                _mailSettings.SenderEmail,
                _mailSettings.Password
                );
        }
    }
}
