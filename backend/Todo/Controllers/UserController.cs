using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TodoManager.API.Controllers
{
    [Route("api/users")]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IActionResult> GetAll([FromQuery] Guid? userId)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();
            Guid? targetUserId = null;

            // Role-based filtering logic
            if (currentUserRole == "USER")
            {
                // For USER role: only show the logged-in user's own profile
                targetUserId = currentUserId;
            }
            else if (currentUserRole == "ADMIN")
            {
                // For ADMIN role: use userId from query parameters (if provided)
                targetUserId = userId;
            }

            if (targetUserId.HasValue)
            {
                // Get specific user
                var user = await _userService.GetUserByIdAsync(targetUserId.Value);
                if (user == null) return NotFound();
                return Ok(new[] { user });
            }
            else
            {
                // Get all users (only for ADMIN when no specific userId is requested)
                if (currentUserRole != "ADMIN")
                {
                    return Forbid("You can only view your own profile.");
                }
                var users = await _userService.GetUsersAsync();
                return Ok(users);
            }
        }

        [HttpGet("{id:guid}")]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();

            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            // Regular users can only view their own profile
            if (currentUserRole == "USER" && user.Id != currentUserId)
            {
                return Forbid("You can only view your own profile.");
            }

            return Ok(user);
        }
    }
}
