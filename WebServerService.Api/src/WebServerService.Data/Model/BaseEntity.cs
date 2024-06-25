using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace WebServerService.Data.Interface
{
    public class BaseEntity : IEntity
    {
        [BsonId]
        [BsonRequired]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
    }

}
