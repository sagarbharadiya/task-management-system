using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Validators
{
    public class RegisterUserValidator : AbstractValidator<RegisterDto>
    {
        public RegisterUserValidator()
        {
            RuleFor(x => x.Username).NotEmpty()
                .NotEmpty().WithMessage("Username is required")
                .Matches(@"^[a-zA-Z0-9_]+$").WithMessage("Username can only contain letters, numbers, and underscores")
                .MinimumLength(3).WithMessage("Username must be at least 3 characters long")
                .MaximumLength(20).WithMessage("Username cannot exceed 20 characters");
            RuleFor(x => x.Email).NotEmpty()
                .WithMessage("Email is required")
                .EmailAddress();
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter")
                .Matches("[0-9]").WithMessage("Password must contain at least one number")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character");                       
        }
    }
}
