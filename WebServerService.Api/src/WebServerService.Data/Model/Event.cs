using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDbGenericRepository.Attributes;
using WebServerService.Data.Interface;

namespace WebServerService.Data.Model
{
    [CollectionName("Events")]
    public class Event : BaseEntity
    {
        [BsonElement("Data")]
        public string Data { get; set; }

        [BsonElement("Timestamp")]
        public DateTime Timestamp { get; set; }

        [BsonElement("IsProcessed")]
        public bool IsProcessed { get; set; }
    }
}
