using MongoDB.Bson;
using TravelPoints.Models.Dtos.TravelPoint;
using TravelPoints.Models.Entites.TravelPoints;
using TravelPoints.Models.Enums;


namespace TravelPoints.Services.TravelPointService
{
    public interface ITravelPointsService
    {
        Task<Point> GetTravelPointAsync(string id);
        Task<IEnumerable<Point>> GetAllTravelPointsAsync();
        Task AddTravelPointAsync(TravelPointDto point);
        Task<bool> DeleteTravelPoint(string id);
        Task UpdateTravelPointAsync(string id, TravelPointDto newTravelPoint);
        Task<IEnumerable<Point>> FilterByLocationAsync(string location);

        Task<IEnumerable<Point>> GetMostVisited(DateTime? to,  DateTime? from);
        Task AddReviewToTravelPoint(string id, ReviewDto review, string email);
	    Task<IEnumerable<TravelPointVisitFrequencyDto>> GetFrequencyList(string travelPointId, FrequencyTypeEnum frequencyType);
    }
}
