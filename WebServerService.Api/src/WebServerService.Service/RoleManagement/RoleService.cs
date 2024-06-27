using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using WebServerService.Data.Interface;
using WebServerService.Data.Model;
using WebServerService.Domain.Model;
using WebServerService.Service.Interface;
using WebServerService.Service.RoleManagement.Dto;

namespace WebServerService.Service
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<Role> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IRoleRepository _roleRepository;
        public RoleService(RoleManager<Role> roleManager,
            IConfiguration configuration,
            IRoleRepository roleRepository)
        {
            _roleManager = roleManager;
            _configuration = configuration;
            _roleRepository = roleRepository;
        }

        public async Task CreateRoleAsync(CreateOrUpdateRoleDto roleDto)
        {
            var isExistedRole = await _roleManager.RoleExistsAsync(roleName: roleDto.Name);
            if (isExistedRole) throw new Exception("Existed Role name");
            await _roleManager.CreateAsync(new Role()
            {
                Id = Guid.NewGuid(),
                Name = roleDto.Name,
                NormalizedName = roleDto.Name.ToLower(),
            });
        }

        public async Task UpdateRoleAsync(CreateOrUpdateRoleDto roleDto)
        {
            var role = await _roleManager.FindByIdAsync(roleDto.Id.ToString());
            if (role == null) throw new Exception("Not found");
            role.Name = roleDto.Name;
            await _roleManager.UpdateAsync(role);
        }

        public async Task<RolesDto> GetRolesAsync(AdvancedQuery query)
        {
            var roles = await _roleRepository.GetAllAsync(query);

            return new RolesDto()
            {
                Roles = roles.Items.Select(x => new RoleDto()
                {
                    Id = x.Id,
                    Name = x.Name
                }),
                TotalRecords = roles.TotalRecords
            };
        }

        public async Task<RolesDto> GetAllRolesAsync()
        {
            var roles = await _roleRepository.GetAllAsync();

            return new RolesDto()
            {
                Roles = roles.Select(x => new RoleDto()
                {
                    Id = x.Id,
                    Name = x.Name
                }),
                TotalRecords = roles.Count()
            };
        }

        public async Task DeleteRoleAsync(Guid id)
        {
            await _roleRepository.DeleteAsync(id);
        }
    }
}
