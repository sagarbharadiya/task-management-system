namespace TaskManager.Application.DTOs
{
    public class UpdateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "PENDING";
        public string Priority { get; set; } = "MEDIUM";
        public Guid? AssigneeId { get; set; }
    }
}

