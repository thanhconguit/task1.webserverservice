using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace WebServerService.Identity.Model
{
    [CollectionName("Roles")]
    public class Role : MongoIdentityRole
    {
    }
}
