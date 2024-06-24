using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace WebServerService.Identity.Model
{
    [CollectionName("Users")]
    public class User : MongoIdentityUser
    {
    }
}
