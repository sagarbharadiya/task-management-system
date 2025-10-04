using Microsoft.EntityFrameworkCore;
using TaskManager.Core.Utilities;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskManager.Infrastructure.Context;

namespace TaskManager.Infrastructure.Seeding
{
    public class SeedDataService
    {
        private readonly TaskManagerDBContext _context;
        
        private static readonly Guid AdminId = Guid.NewGuid();
        private static readonly Guid UserId = Guid.NewGuid();

        public SeedDataService(TaskManagerDBContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // Ensure database is created
            await _context.Database.EnsureCreatedAsync();

            // Seed users if they don't exist
            var users = await SeedUsersAsync();

            // Seed tasks if they don't exist
            await SeedTasksAsync(users);

            await _context.SaveChangesAsync();
        }

        private async Task<List<User>> SeedUsersAsync()
        {
            if (await _context.Users.AnyAsync())
            {
                // Return existing users
                return await _context.Users.ToListAsync();
            }

            var users = new List<User>
            {
                new User
                {
                    Id = AdminId,
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = PasswordHasher.HashPassword("Admin123!"),
                    Role = Role.ADMIN,
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new User
                {
                    Id = UserId,
                    Username = "user",
                    Email = "user@example.com",
                    PasswordHash = PasswordHasher.HashPassword("User123!"),
                    Role = Role.USER,
                    CreatedAt = DateTime.UtcNow.AddDays(-25)
                }
            };

            await _context.Users.AddRangeAsync(users);
            return users;
        }

        private async Task SeedTasksAsync(List<User> users)
        {
            if (await _context.Tasks.AnyAsync())
                return;

            var adminUser = users.FirstOrDefault(u => u.Role == Role.ADMIN);
            var regularUser = users.FirstOrDefault(u => u.Role == Role.USER);
            
            if (adminUser == null || regularUser == null)
                return;

            var tasks = new List<TaskItem>
            {
                new TaskItem
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Title = "Setup Development Environment",
                    Description = "Configure the development environment with all necessary tools and dependencies",
                    Status = TaskState.COMPLETED,
                    Priority = TaskPriority.HIGH,
                    AssigneeId = adminUser.Id,
                    CreatorId = adminUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    UpdatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new TaskItem
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Title = "Implement User Authentication",
                    Description = "Create JWT-based authentication system with login and registration endpoints",
                    Status = TaskState.COMPLETED,
                    Priority = TaskPriority.HIGH,
                    AssigneeId = adminUser.Id,
                    CreatorId = adminUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-18),
                    UpdatedAt = DateTime.UtcNow.AddDays(-12)
                },
                new TaskItem
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    Title = "Design Database Schema",
                    Description = "Create Entity Framework models and database migrations for the task management system",
                    Status = TaskState.IN_PROGRESS,
                    Priority = TaskPriority.MEDIUM,
                    AssigneeId = regularUser.Id,
                    CreatorId = adminUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    UpdatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new TaskItem
                {
                    Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                    Title = "Create Task CRUD Operations",
                    Description = "Implement Create, Read, Update, Delete operations for task management",
                    Status = TaskState.IN_PROGRESS,
                    Priority = TaskPriority.HIGH,
                    AssigneeId = regularUser.Id,
                    CreatorId = adminUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-12),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new TaskItem
                {
                    Id = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                    Title = "Add Task Validation",
                    Description = "Implement FluentValidation for task creation and updates",
                    Status = TaskState.COMPLETED,
                    Priority = TaskPriority.MEDIUM,
                    AssigneeId = adminUser.Id,
                    CreatorId = adminUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new TaskItem
                {
                    Id = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                    Title = "Implement Task Filtering",
                    Description = "Add filtering capabilities by status, priority, and assignee",
                    Status = TaskState.COMPLETED,
                    Priority = TaskPriority.MEDIUM,
                    AssigneeId = regularUser.Id,
                    CreatorId = adminUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-8),
                    UpdatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new TaskItem
                {
                    Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                    Title = "Add Task Comments Feature",
                    Description = "Allow users to add comments to tasks for better collaboration",
                    Status = TaskState.PENDING,
                    Priority = TaskPriority.LOW,
                    AssigneeId = null,
                    CreatorId = adminUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-6),
                    UpdatedAt = DateTime.UtcNow.AddDays(-6)
                },
                new TaskItem
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Title = "Create API Documentation",
                    Description = "Generate comprehensive API documentation using Swagger/OpenAPI",
                    Status = TaskState.IN_PROGRESS,
                    Priority = TaskPriority.MEDIUM,
                    AssigneeId = adminUser.Id,
                    CreatorId = adminUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new TaskItem
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    Title = "Implement Email Notifications",
                    Description = "Send email notifications when tasks are assigned or status changes",
                    Status = TaskState.PENDING,
                    Priority = TaskPriority.LOW,
                    AssigneeId = regularUser.Id,
                    CreatorId = adminUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new TaskItem
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Title = "Add Task Attachments",
                    Description = "Allow users to attach files to tasks for better context and documentation",
                    Status = TaskState.PENDING,
                    Priority = TaskPriority.LOW,
                    AssigneeId = null,
                    CreatorId = regularUser.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await _context.Tasks.AddRangeAsync(tasks);
        }
    }
}
