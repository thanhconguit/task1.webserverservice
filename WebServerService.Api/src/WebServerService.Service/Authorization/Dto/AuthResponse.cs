using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServerService.Service.Authorization.Dto
{
    public class AuthResponse
    {
        public string AccessToken { get; set; }

        public string RefreshToken { get; set; }
    }
}
