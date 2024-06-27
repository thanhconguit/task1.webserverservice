using System.ComponentModel.DataAnnotations;
using WebServerService.Domain.Validation;

namespace WebServerService.Service.UserManagement.Dto
{
    public class CreatedUserDto
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string UserName { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string SurName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [PhoneNumber]
        public string PhoneNumber { get; set; }

        [Required]
        public string Password { get; set; }

        public AssignedRole AssignedRole { get; set; } // List of Role IDs
    }

    public class AssignedRole
    {
        public string RoleName { get; set; }

        public Guid RoleId { get; set; }
    }
}
