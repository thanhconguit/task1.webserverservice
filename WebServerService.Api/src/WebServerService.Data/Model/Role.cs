using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using WebServerService.Data.Interface;

namespace WebServerService.Data.Model
{
    [CollectionName("Roles")]
    public class Role : MongoIdentityRole, IEntity
    {
    }
}
