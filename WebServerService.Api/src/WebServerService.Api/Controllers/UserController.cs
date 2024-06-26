using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServerService.Domain.Const;
using WebServerService.Domain.Model;
using WebServerService.Service.Interface;
using WebServerService.Service.UserManagement.Dto;

namespace WebServerService.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("add")]
        [Authorize(Roles = RoleConstants.Admin)]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreatedUserDto createdUserDto)
        {
            await _userService.CreateUserAsync(createdUserDto);

            return Ok();
        }

        [HttpPut("edit")]
        [Authorize(Roles = RoleConstants.Admin)]
        public async Task<IActionResult> UpdateUserAsync([FromBody] UpdatedUserDto updatedUserDto)
        {
            await _userService.UpdateUserAsync(updatedUserDto);

            return Ok();
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = RoleConstants.Admin)]
        public async Task<IActionResult> DeleteUserAsync(Guid id)
        {
            await _userService.DeleteUserAsync(id);

            return Ok();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUsersAsync([FromQuery] AdvancedQuery query)
        {
            return Ok(await _userService.GetUsersAsync(query));
        }
    }
}
