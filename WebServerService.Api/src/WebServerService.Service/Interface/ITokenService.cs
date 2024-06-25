using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebServerService.Data.Model;

namespace WebServerService.Service.Interface
{
    public interface ITokenService
    {
        string GenerateRefreshToken();
        Task<string> GenerateJwtToken(User user);
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
