using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace WebServerService.Data.Interface
{
    public interface IEntity
    {
        [BsonId]
        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        Guid Id { get; set; }
    }
}
