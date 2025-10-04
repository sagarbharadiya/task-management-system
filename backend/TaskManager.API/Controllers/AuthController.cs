using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Validators;

namespace TodoManager.API.Controllers
{
    [Route("api/auth")]
    public class AuthController : BaseController
    {
        private readonly IAuthService _service;
        private readonly IValidator<LoginDto> _loginValidator;
        private readonly IValidator<RegisterDto> _registerValidator;

        public AuthController(IAuthService service, IValidator<LoginDto> loginValidator, IValidator<RegisterDto> registerValidator)
        {
            _service = service;
            _loginValidator = loginValidator;
            _registerValidator = registerValidator;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Validate the request
            var validationResult = await _registerValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => new { Field = e.PropertyName, Message = e.ErrorMessage });
                return BadRequest(new { Message = "Validation failed", Errors = errors });
            }

            var authResponse = await _service.RegisterAsync(dto.Username, dto.Email, dto.Password);
            return Ok(authResponse);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Validate the request
            var validationResult = await _loginValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => new { Field = e.PropertyName, Message = e.ErrorMessage });
                return BadRequest(new { Message = "Validation failed", Errors = errors });
            }

            var authResponse = await _service.LoginAsync(dto.Email, dto.Password);
            return authResponse == null ? Unauthorized() : Ok(authResponse);
        }
    }
}
