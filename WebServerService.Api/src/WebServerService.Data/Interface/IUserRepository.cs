using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebServerService.Data.Model;

namespace WebServerService.Data.Interface
{
    public interface IUserRepository : IBaseRepository<User>
    {
    }
}
