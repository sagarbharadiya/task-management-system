using FluentValidation;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Validators
{
    public class UpdateTaskValidator : AbstractValidator<UpdateTaskDto>
    {
        public UpdateTaskValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required")
                .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required")
                .Must(BeValidStatus).WithMessage("Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED");

            RuleFor(x => x.Priority)
                .NotEmpty().WithMessage("Priority is required")
                .Must(BeValidPriority).WithMessage("Priority must be one of: LOW, MEDIUM, HIGH, URGENT");
        }

        private bool BeValidStatus(string status)
        {
            return Enum.TryParse<TaskState>(status, true, out _);
        }

        private bool BeValidPriority(string priority)
        {
            return Enum.TryParse<TaskPriority>(priority, true, out _);
        }
    }
}

