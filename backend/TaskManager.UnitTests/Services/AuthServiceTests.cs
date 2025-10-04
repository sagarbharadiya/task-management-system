using Microsoft.Extensions.Configuration;
using Moq;
using TaskManager.Application.DTOs;
using TaskManager.Application.Services;
using TaskManager.Core.Interfaces;
using TaskManager.Core.Utilities;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;

namespace TaskManager.UnitTests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IRepository<User>> _mockUserRepository;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _mockUserRepository = new Mock<IRepository<User>>();
            _mockConfiguration = new Mock<IConfiguration>();
            
            // Setup configuration mock
            _mockConfiguration.Setup(x => x["Jwt:Key"]).Returns("SuperSecureKeyForJwtSignatures123!");
            _mockConfiguration.Setup(x => x["Jwt:Issuer"]).Returns("TaskManagementApp");
            _mockConfiguration.Setup(x => x["Jwt:Audience"]).Returns("TaskManagementUsers");

            _authService = new AuthService(_mockUserRepository.Object, _mockConfiguration.Object);
        }

        [Fact]
        public async Task RegisterAsync_WithValidData_ShouldReturnAuthResponse()
        {
            // Arrange
            var username = "testuser";
            var email = "test@example.com";
            var password = "Test123!";
            var role = Role.USER;

            var existingUsers = new List<User>(); // Empty list - no existing users
            _mockUserRepository.Setup(x => x.GetAllAsync()).ReturnsAsync(existingUsers);
            _mockUserRepository.Setup(x => x.AddAsync(It.IsAny<User>())).Returns(Task.CompletedTask);
            _mockUserRepository.Setup(x => x.SaveChangesAsync()).Returns(Task.CompletedTask);

            // Act
            var result = await _authService.RegisterAsync(username, email, password, role);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Token);
            Assert.NotNull(result.User);
            Assert.Equal(username, result.User.Username);
            Assert.Equal(email, result.User.Email);
            Assert.Equal(role.ToString(), result.User.Role);
            
            // Verify that AddAsync was called with a user that has the correct properties
            _mockUserRepository.Verify(x => x.AddAsync(It.Is<User>(u => 
                u.Username == username && 
                u.Email == email && 
                u.Role == role &&
                !string.IsNullOrEmpty(u.PasswordHash)
            )), Times.Once);
            _mockUserRepository.Verify(x => x.SaveChangesAsync(), Times.Once);
        }


        [Fact]
        public async Task LoginAsync_WithNullUser_ShouldReturnNull()
        {
            // Arrange
            var email = "user@example.com";
            var password = "User123!";

            var users = new List<User>(); // Empty list
            _mockUserRepository.Setup(x => x.GetAllAsync()).ReturnsAsync(users);

            // Act
            var result = await _authService.LoginAsync(email, password);

            // Assert
            Assert.Null(result);
        }
    }
}

