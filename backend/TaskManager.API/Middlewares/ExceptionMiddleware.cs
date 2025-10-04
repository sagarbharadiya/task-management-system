using System.Net;
using FluentValidation;
using System.Text.Json;

namespace TodoManager.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger) 
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try { await _next(context); }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var code = HttpStatusCode.InternalServerError;
            object? payload = null;

            switch (exception)
            {
                case ValidationException vex:
                    code = HttpStatusCode.BadRequest;
                    payload = new
                    {
                        error = "ValidationFailed",
                        details = vex.Errors.Select(e => new { e.PropertyName, e.ErrorMessage })
                    };
                    break;

                case UnauthorizedAccessException _:
                    code = HttpStatusCode.Unauthorized;
                    payload = new { error = "Unauthorized" };
                    break;

                case InvalidOperationException ioe:
                    code = HttpStatusCode.BadRequest;
                    payload = new { error = "InvalidOperation", message = ioe.Message };
                    break;

                // map more domain exceptions here if you use them
                default:
                    payload = new { error = "ServerError", message = exception.Message };
                    break;
            }

            context.Response.StatusCode = (int)code;
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            return context.Response.WriteAsync(JsonSerializer.Serialize(payload, options));
        }
    }
}
