using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServerService.Domain.Const;
using WebServerService.Domain.Model;
using WebServerService.Service.Interface;
using WebServerService.Service.RoleManagement.Dto;

namespace WebServerService.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        public RoleController(IRoleService RoleService)
        {
            _roleService = RoleService;
        }

        [HttpPost("add")]
        [Authorize(Roles = RoleConstants.Admin)]
        public async Task<IActionResult> CreateRoleAsync([FromBody] CreateOrUpdateRoleDto createdRoleDto)
        {
            await _roleService.CreateRoleAsync(createdRoleDto);

            return Ok();
        }

        [HttpPut("edit")]
        [Authorize(Roles = RoleConstants.Admin)]
        public async Task<IActionResult> UpdateRoleAsync([FromBody] CreateOrUpdateRoleDto updatedRoleDto)
        {
            await _roleService.UpdateRoleAsync(updatedRoleDto);

            return Ok();
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = RoleConstants.Admin)]
        public async Task<IActionResult> DeleteRoleAsync(Guid id)
        {
            await _roleService.DeleteRoleAsync(id);

            return Ok();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetRolesAsync([FromQuery] AdvancedQuery query)
        {
            return Ok(await _roleService.GetRolesAsync(query));
        }
    }
}
