using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Core.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly IRepository<TaskItem> _repo;

        public TaskService(IRepository<TaskItem> repo) { _repo = repo; }

        public async Task<IEnumerable<TaskResponseDto>> GetTasksAsync(TaskState? status, Guid? assigneeId)
        {
            IEnumerable<TaskItem> tasks;

            if (status.HasValue && assigneeId.HasValue)
            {
                tasks = await _repo.GetFilteredAsync(t => t.Status == status.Value && t.AssigneeId == assigneeId.Value);
            }
            else if (status.HasValue)
            {
                tasks = await _repo.GetFilteredAsync(t => t.Status == status.Value);
            }
            else if (assigneeId.HasValue)
            {
                tasks = await _repo.GetFilteredAsync(t => t.AssigneeId == assigneeId.Value);
            }
            else
            {
                tasks = await _repo.GetAllAsync();
            }

            return tasks.Select(MapTaskToDto);
        }

        public async Task<TaskResponseDto?> GetTaskByIdAsync(Guid id)
        {
            var task = await _repo.GetByIdAsync(id);
            return task != null ? MapTaskToDto(task) : null;
        }

        public async Task<TaskResponseDto> CreateTaskAsync(TaskDto taskDto, Guid creatorId)
        {
            var task = new TaskItem
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                Priority = Enum.Parse<TaskPriority>(taskDto.Priority),
                AssigneeId = taskDto.AssigneeId,
                CreatorId = creatorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(task);
            await _repo.SaveChangesAsync();
            return MapTaskToDto(task);
        }

        public async Task<TaskResponseDto?> UpdateTaskAsync(Guid id, UpdateTaskDto updateTaskDto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return null;

            existing.Title = updateTaskDto.Title;
            existing.Description = updateTaskDto.Description;
            existing.Status = Enum.Parse<TaskState>(updateTaskDto.Status);
            existing.Priority = Enum.Parse<TaskPriority>(updateTaskDto.Priority);
            existing.AssigneeId = updateTaskDto.AssigneeId;
            existing.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(existing);
            await _repo.SaveChangesAsync();
            return MapTaskToDto(existing);
        }

        public async Task<bool> DeleteTaskAsync(Guid id)
        {
            var task = await _repo.GetByIdAsync(id);
            if (task == null) return false;

            await _repo.DeleteAsync(id);
            await _repo.SaveChangesAsync();
            return true;
        }

        private TaskResponseDto MapTaskToDto(TaskItem task)
        {
            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                Priority = task.Priority.ToString(),
                AssigneeId = task.AssigneeId,
                CreatorId = task.CreatorId,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt
            };
        }
    }
}
