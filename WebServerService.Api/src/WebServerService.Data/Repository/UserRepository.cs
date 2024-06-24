using MongoDB.Driver;
using WebServerService.Data.Interface;
using WebServerService.Data.Model;

namespace WebServerService.Data.Repository
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(IMongoDatabase database) : base(database, "Users")
        {
            
        }
    }
}
