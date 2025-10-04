
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Application.Validators;
using TaskManager.Core.Interfaces;
using TaskManager.Infrastructure.Context;
using TaskManager.Infrastructure.Repository;
using TaskManager.Infrastructure.Seeding;
using TodoManager.API.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<TaskManagerDBContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ---- Authentication (JWT) ----
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

// --- Controllers & FluentValidation ---
builder.Services.AddValidatorsFromAssemblyContaining<RegisterUserValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<LoginValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateTaskValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<UpdateTaskValidator>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.RequireHttpsMetadata = false;
    opt.SaveToken = true;
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ClockSkew = TimeSpan.Zero,
        RequireExpirationTime = true
    };
    
    // Handle authentication failures
    opt.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers["Token-Expired"] = "true";
            }
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            var result = System.Text.Json.JsonSerializer.Serialize(new { message = "Unauthorized" });
            return context.Response.WriteAsync(result);
        }
    };
});


builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<SeedDataService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var seedDataService = scope.ServiceProvider.GetRequiredService<SeedDataService>();
    await seedDataService.SeedAsync();
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<JwtMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS - must be before UseAuthentication and UseAuthorization
app.UseCors("CORSPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
