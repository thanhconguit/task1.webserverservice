using MongoDB.Driver;
using WebServerService.Data.Interface;
using WebServerService.Data.Model;

namespace WebServerService.Data.Repository
{
    public class EventRepository : BaseRepository<Event>, IEventRepository
    {
        public EventRepository(IMongoDatabase database) : base(database, "Events")
        {
        }
    }
}
