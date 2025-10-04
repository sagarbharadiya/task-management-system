# TaskManager API

A comprehensive task management system built with .NET 8, featuring user authentication, role-based authorization, and task management capabilities.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Password hashing with SHA512

- **Task Management**
  - Create, read, update, delete tasks
  - Task status tracking (Pending, InProgress, Completed)
  - Task priority levels (Low, Medium, High)
  - Assign tasks to users

- **User Management**
  - User registration and login
  - User profile management
  - Admin user management

- **API Features**
  - RESTful API design
  - FluentValidation for request validation
  - CORS support for frontend integration
  - Swagger/OpenAPI documentation
  - Exception handling middleware

## 🏗️ Architecture

The project follows Clean Architecture principles with the following layers:

- **TaskManager.API** - Web API layer (Controllers, Middleware)
- **TaskManager.Application** - Application layer (Services, DTOs, Validators)
- **TaskManager.Core** - Core layer (Interfaces, Utilities)
- **TaskManager.Domain** - Domain layer (Entities, Enums)
- **TaskManager.Infrastructure** - Infrastructure layer (Database, Repository)
- **TaskManager.UnitTests** - Unit tests

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL](https://www.postgresql.org/download/) (or SQL Server)
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) or [VS Code](https://code.visualstudio.com/)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Todo
```

### 2. Database Configuration

#### Option A: PostgreSQL (Recommended)

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE TaskManagerDB;
```

2. Update the connection string in `Todo/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=TaskManagerDB;Username=your_username;Password=your_password"
  }
}
```

### 3. Install Dependencies

```bash
dotnet restore
```

### 4. Database Migration

Create and apply the database migration:

```bash
dotnet ef migrations add InitialCreate --project TaskManager.Infrastructure --startup-project backend/TaskManager.API.csproj --context TaskManagerDBContext
dotnet ef database update --project TaskManager.Infrastructure --startup-project backend/TaskManager.API.csproj --context TaskManagerDBContext
```

### 5. Build the Project

```bash
dotnet build
```

## 🚀 Running the Application

### Start the API

```bash
dotnet run --project backend/TaskManager.API.csproj
```

The API will be available at:
- **HTTP**: `http://localhost:5214`
- **HTTPS**: `https://localhost:7004`

### Access Swagger Documentation

Once the application is running, you can access the Swagger UI at:
- **HTTP**: `http://localhost:5214/swagger`
- **HTTPS**: `https://localhost:7004/swagger`

## 🔐 Default Users

The application comes with seeded data including default users:

### Admin User
- **Email**: `admin@example.com`
- **Password**: `Admin123!`
- **Role**: `ADMIN`

### Regular User
- **Email**: `user@example.com`
- **Password**: `User123!`
- **Role**: `USER`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get tasks (role-based filtering)
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

### Users
- `GET /api/users` - Get users (role-based filtering)
- `GET /api/users/{id}` - Get user by ID

## 🔒 Role-Based Access Control

### USER Role
- Can only view tasks assigned to them
- Can only view their own profile
- Can create, update, and delete their own tasks

### ADMIN Role
- Can view all tasks and users
- Can use query parameters to filter data
- Full CRUD access to all resources

## 🧪 Testing

### Run Unit Tests

```bash
dotnet test
```

### Test with HTTP Client

Example login request:
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "Admin123!"
}
```

## 🌐 CORS Configuration

The API is configured to allow requests from:
- `http://localhost:3000`
- `https://localhost:3000`

Supported methods: GET, POST, PUT, DELETE
Supported headers: All headers

## 🔧 Configuration

### JWT Settings

JWT configuration can be found in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "TaskManagerAPI",
    "Audience": "TaskManagerUsers",
    "ExpiryInMinutes": 15
  }
}
```

### Logging

Logging is configured to use console and debug providers. Log levels can be adjusted in `appsettings.json`.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check connection string in `appsettings.json`
   - Ensure database exists

2. **Migration Issues**
   - Make sure you're in the correct directory
   - Verify the startup project path is correct
   - Check that all dependencies are installed

3. **Build Issues**
   - Run `dotnet clean` and `dotnet build`
   - Ensure .NET 8 SDK is installed
   - Check for any running processes that might lock files

4. **Authentication Issues**
   - Verify JWT settings in `appsettings.json`
   - Check that the token is being sent in the Authorization header
   - Ensure the token hasn't expired

### File Locking Issues

If you encounter file locking issues during build:

```bash
# Stop any running processes
taskkill /F /IM TaskManager.API.exe

# Then build again
dotnet build
```

## 📝 Development Notes

- The application uses Entity Framework Core for data access
- FluentValidation is used for request validation
- Password hashing uses SHA512 algorithm
- The repository pattern is implemented for data access abstraction
- Services are registered using dependency injection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Review the Swagger documentation
3. Check the application logs
4. Create an issue in the repository
