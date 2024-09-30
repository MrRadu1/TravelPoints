using TravelPoints.Models.Email;
using TravelPoints.Models.Entites.TravelPoints;

namespace TravelPoints.Services.MailService
{
    public class EmailTemplateService : IEmailTemplateService
    {
        public string GetNewOfferTemplate(EmailBody emailBody, string supportEmail, Point travelPoint)
        {
            var lastOffer = travelPoint.Offers?.LastOrDefault();
            if (lastOffer != null)
            {
                return $@"
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Hot Deals at Travel Point</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; text-align: left;'>
                <h2>Hot Deal for {travelPoint.Location}!</h2>
                <p>Dear {emailBody.UserName},</p>
                <p>Don't miss out on our latest offers for your favorite places!</p>
                <p>We saw that you have {travelPoint.Location} in your wishList. Now it is time to get it because we have a special offer:</p>
                <p>
                    <b>Last Offer:</b><br>
                    Price: <span style='color: green;'>{lastOffer.Price}$</span><br>
                    Start Date: <b>{lastOffer.StartDate}</b><br>
                    End Date: <b>{lastOffer.EndDate}</b>
                </p>
                <p>Check out our exclusive offers and book your next adventure today!</p>
                <p>If you have any questions or need assistance, feel free to contact us at {supportEmail}.</p>
                <p>Best regards,<br> The Travel Point Team</p>
            </div>
        </body>
        </html>";
            }
            else
            {
                return $@"
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Hot Deals at Travel Point</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; text-align: left;'>
                <h2>Hot Deals at Travel Point!</h2>
                <p>Dear {emailBody.UserName},</p>
                <p>Don't miss out on our latest offers for your favorite places! </p>
                <p>We saw that you have {travelPoint.Location} in your wishList.</p>
                <p>Check out our exclusive offers and book your next adventure today!</p>
                <p>If you have any questions or need assistance, feel free to contact us at {supportEmail}.</p>
                <p>Best regards,<br> The Travel Point Team</p>
            </div>
        </body>
        </html>";
            }
        }


        public string GetRegisteredTemplate(EmailBody emailBody, string supportEmail)
        {
            return @"
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Hot Deals at Travel Point</title>
        </head>
        <body>
        <div style='font-family: Arial, sans-serif; max-width: 600px; text-align: left;'>
            <h2>Welcome at Travel Point!</h2>
            <p>Dear " + emailBody.UserName + @",</p>
            <p>Thank you for registering with Travel Point. We are thrilled to welcome you to our community!</p>
            <p>At Travel Point, we strive to provide you with the best travel experiences and assistance.</p>
            <p>If you have any questions or need assistance, feel free to contact us at " + supportEmail + @".</p>
            <p>Best regards,<br> The Travel Point Team</p>
        </div>
    </body>
    </html>";
        }

        public string GetFeedbackTemplate(EmailBody emailBody, string feedback)
        {
            return @"
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Feedback from Travel Point User</title>
        </head>
        <body>
        <div style='font-family: Arial, sans-serif; max-width: 600px; text-align: left;'>
            <h2Feedback from a Happy Traveler!</h2>
            <p>Hey there,</p>
            <p>We just received some awesome feedback from " + emailBody.UserName + @":</p>
            <p>" + feedback + @"</p>
            <p>Let's keep spreading the joy of travel!</p>
            <p>Best Wishes,<br> The Travel Point Team</p>
        </div>
    </body>
    </html>";
        }

        public string GetResetPasswordTemplate(EmailBody emailBody, string supportEmail, string link)
        {
            return @"
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Password reset</title>
    </head>
    <body>
        <div style='font-family: Arial, sans-serif; max-width: 600px; text-align: left;'>
            <h2>You requested a password reset!</h2>
            <p>Dear " + emailBody.UserName + @",</p>
            <p>You can reset your password <a href=" + "\"" + link + "\"" + @">here</a></p>
            <p>If you have any questions or need assistance, feel free to contact us at " + supportEmail + @".</p>
        </div>
    </body>
    </html>";

        }
    }
}
