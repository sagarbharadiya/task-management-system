using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetUsersAsync();
        Task<UserResponseDto?> GetUserByIdAsync(Guid id);
    }
}

