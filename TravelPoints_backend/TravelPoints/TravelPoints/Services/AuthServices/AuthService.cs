using Microsoft.AspNetCore.DataProtection;
using MongoDB.Bson;
using MongoDB.Driver;
using TravelPoints.Models.Entites.Users;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System;
using System.Security.Cryptography;
using System.Runtime.Intrinsics.Arm;

namespace TravelPoints.Services.AuthServices
{
    public class AuthService(IMongoCollection<User> userCollection) : IAuthService
    {
        private readonly IMongoCollection<User> _userCollection = userCollection;

        private static readonly HashAlgorithm hasher;
        public static readonly string secret;

        static AuthService()
        {
            hasher = SHA256.Create();
            var random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            secret = Encoding.ASCII.GetString(hasher.ComputeHash(Encoding.ASCII.GetBytes(new string(Enumerable.Repeat(chars, 256)
                .Select(s => s[random.Next(s.Length)]).ToArray()))));

        }

        public async Task<string> AuthorizeUser(string email, string password)
        {
            var user = await GetUserInfoByEmail(email);
            var passwordHash = ComputeSHA256Hash(password);
            if (user == null || user.Password != passwordHash)
            {
                return "";
            }
            return GenerateJWT(user);
        }

        public string EncryptPassword(string password) 
        {
            return ComputeSHA256Hash(password);
        }

        static string ComputeSHA256Hash(string input)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(input);

            byte[] hashBytes = hasher.ComputeHash(bytes);

            var stringBuilder = new StringBuilder();
            for (int i = 0; i < hashBytes.Length; i++)
            {
                stringBuilder.Append(hashBytes[i].ToString("x2"));
            }

            return stringBuilder.ToString();
        }
        private async Task<User> GetUserInfoByUsername(string username)
        {
            var results = await _userCollection.FindAsync(x => x.Username == username);

            var user = await results.SingleOrDefaultAsync();
            return user;
        }

        private async Task<User> GetUserInfoByEmail(string email)
        {            
            var results = await _userCollection.FindAsync(x => x.Email == email);
            var user = await results.SingleAsync();
            return user;
        }

        private static string GenerateJWT(User user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity([new Claim("id", user.Id.ToString()), new Claim(ClaimTypes.Role, user.Role.ToString()), new Claim("email", user.Email.ToString())]),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
