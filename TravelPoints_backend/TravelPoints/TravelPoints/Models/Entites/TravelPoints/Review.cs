using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TravelPoints.Models.Entites.TravelPoints
{
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public required ObjectId Id { get; set; }
        public required string Description { get; set; }
        public required string UserEmail { get; set; }

        public required int Rating { get; set; }
    }
}
