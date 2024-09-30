using MongoDB.Driver;
using TravelPoints.Models.Entites.Users;

namespace TravelPoints.Services.UserService
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> FindUserById(string id);
        Task<User> FindByEmailAsync(string email);
        Task<User> FindByUsernameAsync(string username);
        Task<bool> InsertUserAsync(User user);
        Task<User?> GetUserAsync(FilterDefinition<User> filter);
        Task UpdateUserAsync(FilterDefinition<User> filter, UpdateDefinition<User> user);
        Task<ReplaceOneResult> ReplaceUser(User user);
        Task<bool> CheckUserExistanceAsync(User user);
    }
}
