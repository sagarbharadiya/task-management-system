namespace TaskManager.Application.DTOs
{
    public class TaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = "MEDIUM";
        public Guid? AssigneeId { get; set; }
    }
}
