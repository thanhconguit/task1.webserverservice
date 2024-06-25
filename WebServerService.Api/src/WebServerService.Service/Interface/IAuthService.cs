using WebServerService.Service.Authorization.Dto;

namespace WebServerService.Service.Interface
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginDto loginDto);
        Task<AuthResponse> RefreshTokenAsync(string token, string refreshToken);
    }
}
