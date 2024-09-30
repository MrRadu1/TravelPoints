using MongoDB.Bson;
using TravelPoints.Models.Email;
using TravelPoints.Models.Entites.Users;
using TravelPoints.Services.MailService;
using TravelPoints.Services.TravelPointService;
using TravelPoints.Services.UserService;

namespace TravelPoints.Services.NotificationService
{
    public class NotificationService : INotificationService
    {
        private readonly IUserService _userService;
        private readonly IMailSenderService _mailSenderService;
        private readonly ITravelPointsService _travelPointsService;

        public NotificationService
            (
            IUserService userService,
            IMailSenderService mailSenderService,
            ITravelPointsService travelPointsService
            )
        {
            _userService = userService;
            _mailSenderService = mailSenderService;
            _travelPointsService = travelPointsService;
        }

        public async Task<IEnumerable<User>> GetUsersToNotifyAsync(string travelPointId)
        {
            var users = await _userService.GetUsersAsync();

            var eligibleUsers = users.Where(u =>
            u.Whishlist != null
            && u.Whishlist.Any(w => w.PointId.Equals(travelPointId))).ToList();

            Console.WriteLine(eligibleUsers);

            return eligibleUsers;
        }

        public async Task NotifyAllEligibleUsers(string travelPointId)
        {
            var travelPoint = await _travelPointsService.GetTravelPointAsync(travelPointId);
            var eligibleUsers = await GetUsersToNotifyAsync(travelPointId);

            foreach(User user in eligibleUsers)
            {
                MailData mailData = new MailData()
                {
                    EmailToAddress = user.Email,
                    EmailToName = user.Username,
                    EmailSubject = "New Offer for "+ travelPoint.Location,
                    EmailBody = new EmailBody()
                    {
                        UserName = user.Username,
                        UserAddress = "Ceahlau 77",
                        UserEmail = user.Email
                    }
                };
                await _mailSenderService.SendNewOfferEmailAsync(mailData, travelPoint);
            }
        }
    }
}
