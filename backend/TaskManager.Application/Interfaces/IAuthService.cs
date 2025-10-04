using TaskManager.Application.DTOs;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(string username, string email, string password, Role role = Role.USER);
        Task<AuthResponseDto?> LoginAsync(string email, string password);
    }
}
