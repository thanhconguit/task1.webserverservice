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
           var token = await _authService.LoginAsync(loginDto);

            if (string.IsNullOrEmpty(token.AccessToken)) return Unauthorized();

            return Ok(token);
        }

        [HttpPost("token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenDto refreshTokenDto)
        {
            var token = await _authService.RefreshTokenAsync(refreshTokenDto.Token, refreshTokenDto.RefreshToken);

            if (string.IsNullOrEmpty(token.AccessToken)) return Unauthorized();

            return Ok(token);
        }
    }
}
