namespace TaskManager.Application.DTOs
{
    public class    AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserResponseDto User { get; set; } = new UserResponseDto();
    }
}


