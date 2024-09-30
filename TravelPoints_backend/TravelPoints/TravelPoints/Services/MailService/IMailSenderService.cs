using TravelPoints.Models.Email;
using TravelPoints.Models.Entites.TravelPoints;

namespace TravelPoints.Services.MailService
{
    public interface IMailSenderService
    {
        Task SendEmailAsync(MailData email, string template);
        Task SendPasswordResetMail(MailData email, string link);
        Task SendNewOfferEmailAsync(MailData email, Point travelPoint);
        Task SendRegisterEmailAsync(MailData email);

        Task SendFeedbackEmailAsync(MailData email, string feedback);
    }
}
