using FluentValidation;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Validators
{
    public class CreateTaskValidator : AbstractValidator<TaskDto>
    {
        public CreateTaskValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x=> x.AssigneeId).NotEmpty();
        }
    }
}
