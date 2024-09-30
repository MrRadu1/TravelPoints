using MongoDB.Bson;

namespace TravelPoints.Models.Entites.Users
{
    public class Wishlist
    {
        public ObjectId Id { get; set; }
        public required string PointId { get; set; }
    }
}
