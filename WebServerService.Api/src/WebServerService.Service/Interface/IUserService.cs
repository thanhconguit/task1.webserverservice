using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebServerService.Domain.Model;
using WebServerService.Service.UserManagement.Dto;

namespace WebServerService.Service.Interface
{
    public interface IUserService
    {
        Task DeleteUserAsync(Guid id);
        Task CheckExistedUser(Guid? id, string email, string phoneNumber);
        Task<UsersDto> GetUsersAsync(AdvancedQuery query);
        Task UpdateUserAsync(UpdatedUserDto userDto);
        Task CreateUserAsync(CreatedUserDto userDto);
    }
}
