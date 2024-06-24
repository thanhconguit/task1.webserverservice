using WebServerService.Service.Authorization.Dto;

namespace WebServerService.Service.Interface
{
    public interface IAuthService
    {
        Task<string?> Login(LoginDto loginDto);
    }
}
