using WebServerService.Domain.Model;

namespace WebServerService.Service.RoleManagement.Dto
{
    public class RolesDto : BaseResult
    {
        public IEnumerable<RoleDto> Roles { get; set; }

    }

    public class RoleDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }
    }
}
