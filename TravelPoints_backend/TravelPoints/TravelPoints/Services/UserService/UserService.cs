using MongoDB.Driver;
using TravelPoints.Models.Entites.Users;

namespace TravelPoints.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserService(IMongoCollection<User> userCollection)
        {
            _userCollection = userCollection;
        }


        public async Task<bool> CheckUserExistanceAsync(User user)
        {
            var existingUserByEmail = await FindByEmailAsync(user.Email);
            var existingUserByUsername = await FindByUsernameAsync(user.Username);

            return existingUserByEmail != null || existingUserByUsername != null;
        }

        public async Task<User> FindByEmailAsync(string email)
        {
            return await _userCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User> FindByUsernameAsync(string username)
        {
            return await _userCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task<User> FindUserById(string id)
        {
            return await _userCollection.Find(u => u.Id.ToString().Equals(id)).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserAsync(FilterDefinition<User> filter)
        {

            var user = await _userCollection.Find(filter).FirstOrDefaultAsync();

            return user;
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _userCollection.Find(_ => true).ToListAsync();
        }

        public async Task<bool> InsertUserAsync(User user)
        {
            try
            {
                await _userCollection.InsertOneAsync(user);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<ReplaceOneResult> ReplaceUser(User user)
        {
            return await _userCollection.ReplaceOneAsync(
                item => item.Id == user.Id,
                user,
                new ReplaceOptions { IsUpsert = true }
            );
        }

        public async Task UpdateUserAsync(FilterDefinition<User> filter, UpdateDefinition<User> user)
        {
            await _userCollection.UpdateOneAsync(filter, user);
        }
    }
}
