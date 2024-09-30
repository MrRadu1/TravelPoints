using MongoDB.Bson;
using TravelPoints.Models.Entites.Users;

namespace TravelPoints.Services.NotificationService
{
    public interface INotificationService
    {
        Task<IEnumerable<User>> GetUsersToNotifyAsync(string travelPointId);
        Task NotifyAllEligibleUsers(string tavelPointId);

    }
}
