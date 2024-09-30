using TravelPoints.Models.Email;
using TravelPoints.Models.Entites.TravelPoints;

namespace TravelPoints.Services.MailService
{
    public interface IEmailTemplateService
    {
        string GetRegisteredTemplate(EmailBody emailBody, string supportEmail);
        string GetResetPasswordTemplate(EmailBody emailBody, string supportEmail, string link);
        string GetNewOfferTemplate(EmailBody emailBody, string supportEmail, Point travelPoint);

        string GetFeedbackTemplate(EmailBody emailBody, string feedback);
    }
}
