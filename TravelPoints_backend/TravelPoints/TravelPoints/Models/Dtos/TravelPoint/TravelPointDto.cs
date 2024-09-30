using TravelPoints.Models.Entites.TravelPoints;

namespace TravelPoints.Models.Dtos.TravelPoint
{
    public class TravelPointDto
    {
        public string Location { get; set; }
        public string TextDescription { get; set; }
        public float Price { get; set; }
        public string? AudioBytes { get; set; }

        public Review[]? Reviews { get; set; }
        public Offer[]? Offers { get; set; }
        
        public Reservation[]? Reservations { get; set; }
    }
}
