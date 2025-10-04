using System.Security.Cryptography;
using System.Text;

namespace TaskManager.Core.Utilities
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            using var sha = SHA512.Create();
            return Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }

        public static bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}


