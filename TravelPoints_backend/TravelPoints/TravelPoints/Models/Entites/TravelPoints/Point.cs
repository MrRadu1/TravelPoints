using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace TravelPoints.Models.Entites.TravelPoints
{
    public class Point
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }
        public required string Location { get; set; }
        public required string TextDescription { get; set; }
        public float Price { get; set; }
        public string? AudioBytes { get; set; }

        public Review[]? Reviews { get; set; }
        public Offer[]? Offers { get; set; }

        public Reservation[]? Reservations { get; set; }

    }
}
