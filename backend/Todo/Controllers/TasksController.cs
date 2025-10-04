using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Enums;

namespace TodoManager.API.Controllers
{
    [Route("api/tasks")]
    public class TasksController : BaseController
    {
        private readonly ITaskService _taskService;
        private readonly IValidator<TaskDto> _taskValidator;
        private readonly IValidator<UpdateTaskDto> _updateTaskValidator;

        public TasksController(ITaskService taskService, IValidator<TaskDto> taskValidator, IValidator<UpdateTaskDto> updateTaskValidator)
        {
            _taskService = taskService;
            _taskValidator = taskValidator;
            _updateTaskValidator = updateTaskValidator;
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IActionResult> GetAll([FromQuery] TaskState? status, [FromQuery] Guid? assignee)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();
            Guid? assigneeId = null;

            // Role-based filtering logic
            if (currentUserRole == "USER")
            {
                // For USER role: only show tasks where logged-in user is the assignee
                assigneeId = currentUserId;
            }
            else if (currentUserRole == "ADMIN")
            {
                // For ADMIN role: use assignee from query parameters (if provided)
                assigneeId = assignee;
            }

            var tasks = await _taskService.GetTasksAsync(status, assigneeId);
            return Ok(tasks);
        }

        [HttpGet("{id:guid}")]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null) return NotFound();

            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            // Role-based access control
            if (currentUserRole == "USER")
            {
                // Regular users can only see tasks they are assigned to
                if (task.AssigneeId != currentUserId)
                {
                    return Forbid("You can only view tasks assigned to you.");
                }
            }
            // Admins can see any task

            return Ok(task);
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IActionResult> Create([FromBody] TaskDto dto)
        {
            // Validate the request
            var validationResult = await _taskValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => new { Field = e.PropertyName, Message = e.ErrorMessage });
                return BadRequest(new { Message = "Validation failed", Errors = errors });
            }

            var createdTask = await _taskService.CreateTaskAsync(dto, GetCurrentUserId());
            return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTask);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskDto updateTaskDto)
        {
            // Validate the request
            var validationResult = await _updateTaskValidator.ValidateAsync(updateTaskDto);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => new { Field = e.PropertyName, Message = e.ErrorMessage });
                return BadRequest(new { Message = "Validation failed", Errors = errors });
            }

            var existing = await _taskService.GetTaskByIdAsync(id);
            if (existing == null) return NotFound();

            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            // Only allow users to update their own tasks, or admins to update any task
            if (currentUserRole != "ADMIN" && existing.CreatorId != currentUserId)
            {
                return Forbid("You can only update tasks you created.");
            }

            var updatedTask = await _taskService.UpdateTaskAsync(id, updateTaskDto);
            if (updatedTask == null) return NotFound();

            return Ok(updatedTask);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _taskService.DeleteTaskAsync(id);
            if (!result) return NotFound();
            
            return NoContent();
        }

    }
}
