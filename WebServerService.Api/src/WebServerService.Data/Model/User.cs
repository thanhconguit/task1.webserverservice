using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using WebServerService.Data.Interface;

namespace WebServerService.Data.Model
{
    [CollectionName("Users")]
    public class User : MongoIdentityUser, IEntity
    {
        public string? Surname { get; set; }
    }
}
