namespace TaskManager.Application.DTOs
{
    public class TaskUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "TODO";
        public string Priority { get; set; } = "MEDIUM";
        public Guid? AssigneeId { get; set; }
    }
}
