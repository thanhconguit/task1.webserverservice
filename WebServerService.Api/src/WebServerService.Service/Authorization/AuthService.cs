using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using WebServerService.Data.Model;
using WebServerService.Service.Authorization.Dto;
using WebServerService.Service.Interface;

namespace WebServerService.Service.Authorization
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;
        public AuthService(UserManager<User> userManager, 
            IConfiguration configuration,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _configuration = configuration; 
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return new AuthResponse();
            }
            user.RefreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("Auth:RefreshTokenLifeTime"));

            await _userManager.UpdateAsync(user);
            return new AuthResponse
            {
                RefreshToken = user.RefreshToken,
                AccessToken = await _tokenService.GenerateJwtToken(user)
            };
        }

        public async Task<AuthResponse> RefreshTokenAsync(string token, string refreshToken)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(token);
            var username = principal?.Identity?.Name; // Extract username from claims

            var user = await _userManager.FindByNameAsync(username);
            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiry <= DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            // Generate new JWT token
            var newToken = await _tokenService.GenerateJwtToken(user);
            return new AuthResponse { AccessToken = newToken };
        }
    }
}
