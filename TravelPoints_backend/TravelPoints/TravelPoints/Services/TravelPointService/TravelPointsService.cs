using MongoDB.Bson;
using MongoDB.Driver;
using TravelPoints.Models.Dtos.TravelPoint;
using TravelPoints.Models.Entites.TravelPoints;
using TravelPoints.Models.Enums;

namespace TravelPoints.Services.TravelPointService
{
    public class TravelPointsService : ITravelPointsService
    {
        private readonly IMongoCollection<Point> _pointCollection;

        public TravelPointsService(IMongoCollection<Point> pointCollection)
        {
            _pointCollection = pointCollection;
        }

        public Task AddTravelPointAsync(TravelPointDto travelPoint)
        {
            var point = new Point {
                Id = string.Empty, 
                Location = travelPoint.Location,
                TextDescription = travelPoint.TextDescription,
                AudioBytes = travelPoint.AudioBytes,
                Price = travelPoint.Price,
                Reviews = travelPoint.Reviews,
                Offers = travelPoint.Offers,
                Reservations = travelPoint.Reservations
            };

            return _pointCollection.InsertOneAsync(point);
        }

        public async Task<bool> DeleteTravelPoint(string id)
        {
            var result = await _pointCollection.DeleteOneAsync(point => point.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<IEnumerable<Point>> FilterByLocationAsync(string location)
        {
            var filter = Builders<Point>.Filter.Eq(point => point.Location, location);
            return await _pointCollection.Find(filter).ToListAsync();
        }

        public async Task<IEnumerable<Point>> GetAllTravelPointsAsync()
        {
            return (await _pointCollection.FindAsync(_ => true)).ToList();
        }

        public async  Task<IEnumerable<TravelPointVisitFrequencyDto>> GetFrequencyList(string travelPointId, FrequencyTypeEnum frequencyType)
        {
            var travelPoint = await GetTravelPointAsync(travelPointId);

            var frequency = new Dictionary<DateTime, int>();
            var frequencyList = new List<TravelPointVisitFrequencyDto>();

            if (travelPoint.Reservations != null) 
            {
                foreach (Reservation res in travelPoint.Reservations)
                {

                    DateTime key = res.StartDate;
                    if (frequencyType == FrequencyTypeEnum.Hourly)
                    { 
                        key = new DateTime(res.StartDate.Year, res.StartDate.Month, 1, res.StartDate.Hour, 0, 0);
                    }
                    else if (frequencyType == FrequencyTypeEnum.Daily)
                    {
                        key = new DateTime(res.StartDate.Year, res.StartDate.Month, res.StartDate.Day, 0, 0, 0);
                    }
                    else if (frequencyType == FrequencyTypeEnum.Monthly)
                    {
                        key = new DateTime(res.StartDate.Year, res.StartDate.Month, 1, 0, 0, 0);
                    }

                    var nrOfReservations = 0;
                    frequency.TryGetValue(key, out nrOfReservations);
                    if (!frequency.ContainsKey(key))
                    {
                        frequency.Add(key, ++nrOfReservations);
                    }
                    else
                    {
                        frequency[key] = ++nrOfReservations;
                    }
                }
                foreach (var kvp in frequency)
                {
                    var dto = new TravelPointVisitFrequencyDto
                    {
                        Date = kvp.Key,
                        NumberOfReservations = kvp.Value
                    };

                    frequencyList.Add(dto);
                }

            }
            return frequencyList;
        }

        public async Task<IEnumerable<Point>> GetMostVisited(DateTime? to, DateTime? from)
        {
            List<BsonDocument> pipeline =
            [
            BsonDocument.Parse("{\r\n    $addFields: {\r\n      score: {\r\n        $size: \"$Reservations\"\r\n      }\r\n    }\r\n  }"),
            BsonDocument.Parse("{\r\n    \"$sort\": {\r\n      \"score\": -1\r\n    }\r\n  }"),
            BsonDocument.Parse("{\r\n    \"$unset\": \"score\"\r\n  }")
            ];
            if (to != null)
            {
                var docTo = new BsonDocument("$addFields", new BsonDocument
                {
                    { "Reservations", new BsonDocument
                        {
                            { "$filter", new BsonDocument
                                {
                                    { "input", "$Reservations" },
                                    { "as", "reserv" },
                                    { "cond", new BsonDocument
                                        {
                                            { "$lte", new BsonArray
                                                {
                                                    "$$reserv.EndDate",
                                                    to
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                pipeline = pipeline.Prepend(docTo).ToList();
            }            
            if (from != null)
            {
                var docFrom = new BsonDocument("$addFields", new BsonDocument
                {
                    { "Reservations", new BsonDocument
                        {
                            { "$filter", new BsonDocument
                                {
                                    { "input", "$Reservations" },
                                    { "as", "reserv" },
                                    { "cond", new BsonDocument
                                        {
                                            { "$gte", new BsonArray
                                                {
                                                    "$$reserv.StartDate",
                                                    from                                               
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                pipeline = pipeline.Prepend(docFrom).ToList();
            }

            return (await _pointCollection.AggregateAsync<Point>(pipeline)).ToList();
        }

        public async Task<Point> GetTravelPointAsync(string id)
        {
            return await (await _pointCollection.FindAsync(x => x.Id.Equals(id))).FirstAsync();
        }

        public async Task UpdateTravelPointAsync(string id, TravelPointDto updatedTravelPoint)
        {
            var newTravelPoint = new Point
            {
                Id = id,
                Location = updatedTravelPoint.Location,
                TextDescription = updatedTravelPoint.TextDescription,
                Price = updatedTravelPoint.Price,
                AudioBytes = updatedTravelPoint.AudioBytes,
                Reviews = updatedTravelPoint.Reviews,
                Offers = updatedTravelPoint.Offers,
                Reservations = updatedTravelPoint.Reservations
           
            };

            var filter = Builders<Point>.Filter.Eq(point => point.Id, id);

            var update = Builders<Point>.Update
                .Set(point => point.Location, newTravelPoint.Location)
                .Set(point => point.TextDescription, newTravelPoint.TextDescription)
                .Set(point => point.Price, newTravelPoint.Price)
                .Set(point => point.AudioBytes, newTravelPoint.AudioBytes)
                .Set(point => point.Reviews, newTravelPoint.Reviews)
                .Set(point => point.Offers, newTravelPoint.Offers)
                .Set(point => point.Reservations, newTravelPoint.Reservations);

            await _pointCollection.UpdateOneAsync(filter, update);
        }

        public async Task AddReviewToTravelPoint(string id, ReviewDto reviewData, string email)
        {            
            var review = new Review
            {
                Id = ObjectId.GenerateNewId(),
                Description = reviewData.Description,
                Rating = reviewData.Rating,
                UserEmail = email,
            };

            var point = await (await _pointCollection.FindAsync(point => point.Id == id)).SingleAsync();
            if (point.Reviews == null)
            {
                List<Review> reviews = new List<Review>();
                reviews.Add(review);
                point.Reviews = reviews.ToArray();
            }
            else
            {
                point.Reviews = point.Reviews.Append(review)
                                             .ToArray();
            }
            var updateDto = new TravelPointDto
            {
                Location = point.Location,
                TextDescription = point.TextDescription,
                Price = point.Price,
                AudioBytes = point.AudioBytes,
                Reviews = point.Reviews,
                Offers = point.Offers,
                Reservations = point.Reservations
            };
            await UpdateTravelPointAsync(id, updateDto);
        }
    }
}
