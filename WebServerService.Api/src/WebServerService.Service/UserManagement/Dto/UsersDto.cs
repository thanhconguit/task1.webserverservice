using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebServerService.Domain.Model;
using WebServerService.Domain.Validation;

namespace WebServerService.Service.UserManagement.Dto
{
    public class UsersDto : BaseResult
    {
        public IEnumerable<UserDto> Users { get; set; }
    }

    public class UserDto
    {
        public Guid Id { get; set; }

        public string UserName { get; set; }

        public string SurName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public AssignedRole AssignedRole { get; set; } // List of Roles
    }
}
