using TaskManager.Application.DTOs;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskResponseDto>> GetTasksAsync(TaskState? status, Guid? assigneeId);
        Task<TaskResponseDto?> GetTaskByIdAsync(Guid id);
        Task<TaskResponseDto> CreateTaskAsync(TaskDto taskDto, Guid creatorId);
        Task<TaskResponseDto?> UpdateTaskAsync(Guid id, UpdateTaskDto updateTaskDto);
        Task<bool> DeleteTaskAsync(Guid id);
    }
}
