using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.IdentityModel.Tokens.Jwt;
using System.Text.RegularExpressions;
using TravelPoints.Models.Dtos.TravelPoint;
using TravelPoints.Models.Entites.TravelPoints;
using TravelPoints.Models.Enums;
using TravelPoints.Services.NotificationService;
using TravelPoints.Services.TravelPointService;
using System.ComponentModel;

namespace TravelPoints.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TravelPointsController: ControllerBase
    {
        private readonly ILogger<TravelPointsController> _logger;
        private readonly ITravelPointsService _travelPointsService;
        private readonly INotificationService _notificationService;

        public TravelPointsController(
            ILogger<TravelPointsController> logger,
            ITravelPointsService travelPointsService,
            INotificationService notificationService
            )
        {
            _logger = logger;
            _travelPointsService = travelPointsService;
            _notificationService = notificationService;
        }


        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<Point>>> GetTravelPoints()
        {
            try
            { 
                return Ok(await _travelPointsService.GetAllTravelPointsAsync());
            }           
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while getting travel points: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Point>>> GetTravelPoint(string id)
        {
            try
            { 
                return Ok(await _travelPointsService.GetTravelPointAsync(id));
            }           
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while getting travel points: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Add")]
        public async Task<ActionResult<Point>> AddTravelPoint(TravelPointDto travelPoint)
        {
            try
            {
                await _travelPointsService.AddTravelPointAsync(travelPoint);
           
                return Ok(new { Message = "Travel Point added successfully", TravelPoint = travelPoint });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while inserting the travel point: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Update/{id}")]
        public async Task<ActionResult<Point>> UpdateTravelPoint(string id, TravelPointDto updatedTravelPoint)
        {
            try
            {
                if (!ObjectId.TryParse(id, out ObjectId objectId))
                {
                    return BadRequest("Invalid ObjectId format.");
                }

                await _travelPointsService.UpdateTravelPointAsync(id, updatedTravelPoint);

                await _notificationService.NotifyAllEligibleUsers(id);
                return Ok(new { Message = "Travel Point updated successfully", TravelPoint = updatedTravelPoint });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the travel point: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTravelPoint(string id)
        {
            try
            {
                var deleted = await _travelPointsService.DeleteTravelPoint(id);
                if (deleted)
                {
                    return Ok(new { Message = "Travel Point deleted successfully" });
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting the travel point: {ex.Message}");
            }
        }

        [HttpGet("FilterByLocation")]
        public async Task<ActionResult<IEnumerable<Point>>> FilterByLocation(string location)
        {
            try
            {
                return Ok(await _travelPointsService.FilterByLocationAsync(location));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while filtering travel points: {ex.Message}");
            }
        }

        [HttpPost("FindMostVisited")]
        public async Task<ActionResult<IEnumerable<Point>>> GetMostVisited(MostVisitedTravelPointsDto dateRange)
        {
            return Ok(await _travelPointsService.GetMostVisited(dateRange.To, dateRange.From));
        }


        [Authorize]
        [HttpPost("PostReview/{id}")]
        public async Task<ActionResult<string>> PostReview(string id, ReviewDto reviewData)
        {
            var tokenRaw = Regex.Replace(Request.Headers["Authorization"].ToString(), @"^Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(tokenRaw);
            var email = token.Claims.First(cl => cl.Type == "email").Value;
            await _travelPointsService.AddReviewToTravelPoint(id, reviewData, email);
            return Ok("Posted!");
        }

        [HttpGet("FrequencyList/{id}")]
        public async Task<ActionResult<IEnumerable<TravelPointVisitFrequencyDto>>> GetFrequencyList(string id, FrequencyTypeEnum frequencyType)
        {
            var result = await _travelPointsService.GetFrequencyList(id, frequencyType);

            return Ok(result);
        }
    }
}
