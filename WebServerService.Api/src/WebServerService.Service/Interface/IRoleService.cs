using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebServerService.Domain.Model;
using WebServerService.Service.RoleManagement.Dto;

namespace WebServerService.Service.Interface
{
    public interface IRoleService
    {
        Task DeleteRoleAsync(Guid id);
        Task<RolesDto> GetRolesAsync(AdvancedQuery query);
        Task<RolesDto> GetAllRolesAsync();
        Task CreateRoleAsync(CreateOrUpdateRoleDto roleDto);
        Task UpdateRoleAsync(CreateOrUpdateRoleDto roleDto);
    }
}
