using Microsoft.AspNetCore.Mvc;
using WebServerService.Service.Authorization.Dto;
using WebServerService.Service.Interface;

namespace WebServerService.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
           var token = await _authService.Login(loginDto);

            if (token == null) return Unauthorized();

            return Ok(new { Token = token });
        }
    }
}
