using MongoDB.Driver;
using WebServerService.Data.Interface;
using WebServerService.Data.Model;

namespace WebServerService.Data.Repository
{
    public class RoleRepository : BaseRepository<Role>, IRoleRepository
    {
        public RoleRepository(IMongoDatabase database) : base(database, "Roles")
        {
        }
    }
}
