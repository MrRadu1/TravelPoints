using MongoDB.Bson;

namespace TravelPoints.Models.Entites.Users
{
    public enum UserRole {
        Client,
        Admin
    }

    public class User
    {   
        public ObjectId Id { get; set; }
        public required string Username { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }

        public required UserRole Role {  get; set; }

        public Wishlist[]? Whishlist { get; set; }
    }
}
