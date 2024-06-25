using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson.Serialization.Attributes;
using MongoDbGenericRepository.Attributes;
using WebServerService.Data.Interface;

namespace WebServerService.Data.Model
{
    [CollectionName("Users")]
    public class User : MongoIdentityUser, IEntity
    {
        public string? Surname { get; set; }

        [BsonElement("RefreshToken")]
        public string RefreshToken { get; set; }

        [BsonElement("RefreshTokenExpiry")]
        public DateTime RefreshTokenExpiry { get; set; }
    }
}
