using Moq;
using TaskManager.Application.DTOs;
using TaskManager.Application.Services;
using TaskManager.Core.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;

namespace TaskManager.UnitTests.Services
{
    public class TaskServiceTests
    {
        private readonly Mock<IRepository<TaskItem>> _mockTaskRepository;
        private readonly TaskService _taskService;

        public TaskServiceTests()
        {
            _mockTaskRepository = new Mock<IRepository<TaskItem>>();
            _taskService = new TaskService(_mockTaskRepository.Object);
        }

        [Fact]
        public async Task GetTasksAsync_WithNoFilters_ShouldReturnAllTasks()
        {
            // Arrange
            var tasks = new List<TaskItem>
            {
                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Task 1",
                    Description = "Description 1",
                    Status = TaskState.PENDING,
                    Priority = TaskPriority.HIGH,
                    CreatorId = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Task 2",
                    Description = "Description 2",
                    Status = TaskState.IN_PROGRESS,
                    Priority = TaskPriority.MEDIUM,
                    CreatorId = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            _mockTaskRepository.Setup(x => x.GetAllAsync()).ReturnsAsync(tasks);

            // Act
            var result = await _taskService.GetTasksAsync(null, null);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, t => t.Title == "Task 1");
            Assert.Contains(result, t => t.Title == "Task 2");
        }


        [Fact]
        public async Task GetTasksAsync_WithAssigneeFilter_ShouldReturnFilteredTasks()
        {
            // Arrange
            var assigneeId = Guid.NewGuid();
            var tasks = new List<TaskItem>
            {
                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Assigned Task 1",
                    Description = "Description",
                    Status = TaskState.PENDING,
                    Priority = TaskPriority.HIGH,
                    AssigneeId = assigneeId,
                    CreatorId = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Assigned Task 2",
                    Description = "Description",
                    Status = TaskState.IN_PROGRESS,
                    Priority = TaskPriority.MEDIUM,
                    AssigneeId = assigneeId,
                    CreatorId = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TaskItem
                {
                    Id = Guid.NewGuid(),
                    Title = "Unassigned Task",
                    Description = "Description",
                    Status = TaskState.PENDING,
                    Priority = TaskPriority.LOW,
                    AssigneeId = null,
                    CreatorId = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            var filteredTasks = tasks.Where(t => t.AssigneeId == assigneeId).ToList();
            _mockTaskRepository.Setup(x => x.GetFilteredAsync(It.IsAny<System.Linq.Expressions.Expression<Func<TaskItem, bool>>>()))
                .ReturnsAsync(filteredTasks);

            // Act
            var result = await _taskService.GetTasksAsync(null, assigneeId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.All(result, task => Assert.Equal(assigneeId, task.AssigneeId));
        }

        [Fact]
        public async Task GetTaskByIdAsync_WithValidId_ShouldReturnTask()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var task = new TaskItem
            {
                Id = taskId,
                Title = "Test Task",
                Description = "Test Description",
                Status = TaskState.PENDING,
                Priority = TaskPriority.HIGH,
                CreatorId = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _mockTaskRepository.Setup(x => x.GetByIdAsync(taskId)).ReturnsAsync(task);

            // Act
            var result = await _taskService.GetTaskByIdAsync(taskId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(taskId, result.Id);
            Assert.Equal("Test Task", result.Title);
            Assert.Equal("Test Description", result.Description);
            Assert.Equal("PENDING", result.Status);
            Assert.Equal("HIGH", result.Priority);
        }

        [Fact]
        public async Task GetTaskByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            _mockTaskRepository.Setup(x => x.GetByIdAsync(taskId)).ReturnsAsync((TaskItem?)null);

            // Act
            var result = await _taskService.GetTaskByIdAsync(taskId);

            // Assert
            Assert.Null(result);
        }
    }
}
