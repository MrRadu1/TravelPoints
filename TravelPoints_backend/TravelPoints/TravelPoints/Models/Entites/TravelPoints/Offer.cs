using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TravelPoints.Models.Entites.TravelPoints
{
    public class Offer
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public required float Price { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
    }
}
