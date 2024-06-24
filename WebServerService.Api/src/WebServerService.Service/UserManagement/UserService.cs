using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using WebServerService.Data.Interface;
using WebServerService.Data.Model;
using WebServerService.Domain.Model;
using WebServerService.Service.Interface;
using WebServerService.Service.UserManagement.Dto;

namespace WebServerService.Service
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        public UserService(UserManager<User> UserManager,
            IConfiguration configuration,
            IUserRepository userRepository,
            IRoleRepository roleRepository,
            RoleManager<Role> roleManager)
        {
            _userManager = UserManager;
            _configuration = configuration;
            _userRepository = userRepository;
            _roleManager = roleManager;
            _roleRepository = roleRepository;
        }

        public async Task CreateUserAsync(CreatedUserDto userDto)
        {
            await CheckExistedUser(null, userDto.Email, userDto.PhoneNumber);

            var user = new User()
            {
                UserName = userDto.Name,
                Surname = userDto.Surname,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
            };

            var result = await _userManager.CreateAsync(user, password: userDto.Password);

            if (!result.Succeeded)
            {
                // If creation failed, return errors
                foreach (var error in result.Errors)
                {
                    throw new Exception(error.Description);
                }
            }

            await AddToRoleAsync(user, userDto.AssignedRole.RoleName);
        }

        public async Task UpdateUserAsync(UpdatedUserDto userDto)
        {
            await CheckExistedUser(userDto.Id, userDto.Email, userDto.PhoneNumber);

            var currentUser = await _userManager.FindByIdAsync(userDto.Id.ToString());

            if (currentUser != null)
            {
                currentUser.Email = userDto.Email;
                currentUser.PhoneNumber = userDto.PhoneNumber;
                currentUser.Roles = new List<Guid> { userDto.AssignedRole.RoleId };
                currentUser.Surname = userDto.Surname;
                var result = await _userManager.UpdateAsync(currentUser);

                if (!result.Succeeded)
                {
                    // If creation failed, return errors
                    foreach (var error in result.Errors)
                    {
                        throw new Exception(error.Description);
                    }
                }

                if (currentUser.Roles.First() != userDto.AssignedRole.RoleId)
                {
                    await AddToRoleAsync(currentUser, userDto.AssignedRole.RoleName);
                }

            }
        }

        public async Task<UsersDto> GetUsersAsync(AdvancedQuery query)
        {
            var users = await _userRepository.GetAllAsync(query);
            var roles = await _roleRepository.GetAllAsync();

            return new UsersDto()
            {
                Users = users.Items.Select(x => new UserDto()
                {
                    Id = x.Id,
                    Name = x.UserName,
                    Surname = x.Surname,
                    AssignedRole = roles.Where(r => x.Roles.Contains(r.Id))
                                        .Select(r => new AssignedRole { RoleId = r.Id, RoleName = r.Name })
                                        .FirstOrDefault() ?? new AssignedRole(),
                    Email = x.Email,
                    PhoneNumber = x.PhoneNumber,
                }),
                TotalRecords = users.TotalRecords
            };
        }

        public async Task CheckExistedUser(Guid? id, string email, string phoneNumber)
        {
            var users = await _userRepository.FindAsync(x => x.Email == email || x.PhoneNumber == phoneNumber);

            foreach (var user in users)
            {
                if (id.HasValue && user.Id == id.Value)
                {
                    continue;
                }

                if (user.Email == email)
                {
                    throw new Exception("A user with the same email already exists.");
                }

                if (user.PhoneNumber == phoneNumber)
                {
                    throw new Exception("A user with the same phone number already exists.");
                }
            }
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user != null) await _userManager.DeleteAsync(user);

        }

        public async Task AddToRoleAsync(User user, string roleName)
        {
            var role = await _roleManager.FindByNameAsync(roleName);

            if (role == null) throw new Exception("Not found role");

            if (user.Roles != null && user.Roles.Any())
            {
                user.RemoveRole(user.Roles.First());
                await _userManager.UpdateAsync(user);
                await _userManager.AddToRoleAsync(user, role.Name);
            }
            else
            {
                await _userManager.AddToRoleAsync(user, role.Name);
            }
        }
    }
}
