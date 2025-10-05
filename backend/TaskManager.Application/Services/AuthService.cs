using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Core.Interfaces;
using TaskManager.Core.Utilities;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IRepository<User> _userRepo;
        private readonly IConfiguration _config;

        public AuthService(IRepository<User> userRepo, IConfiguration config)
        {
            _userRepo = userRepo;
            _config = config;
        }

        public async Task<AuthResponseDto> RegisterAsync(string username, string email, string password, Role role = Role.USER)
        {
            var emailExists = await _userRepo.AnyAsync(u => u.Email == email || u.Username.ToLower().Equals(username.ToLower()));
            if (emailExists)
                throw new InvalidOperationException("Username or Email already registered.");

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = PasswordHasher.HashPassword(password),
                Role = role
            };

            await _userRepo.AddAsync(user);
            await _userRepo.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var userDto = MapUserToDto(user);

            return new AuthResponseDto
            {
                Token = token,
                User = userDto
            };
        }

        public async Task<AuthResponseDto?> LoginAsync(string email, string password)
        {
            var user = await _userRepo.GetFirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !PasswordHasher.VerifyPassword(password, user.PasswordHash))
                return null;

            var token = GenerateJwtToken(user);
            var userDto = MapUserToDto(user);

            return new AuthResponseDto
            {
                Token = token,
                User = userDto
            };
        }


        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserResponseDto MapUserToDto(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt
            };
        }
    }
}
