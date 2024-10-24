using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography; // Thêm namespace này
using System.Text;
using taxi_api.DTO;
using taxi_api.Models;
using Microsoft.Extensions.Caching.Memory;

namespace Taxibibi.Controllers.AdminController
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly TaxiContext _context;
        private readonly IPasswordHasher<Admin> _passwordHasher;
        private readonly IConfiguration _config;
        private readonly IMemoryCache _cache; 

        public AdminController(TaxiContext context, IPasswordHasher<Admin> passwordHasher, IConfiguration config, IMemoryCache cache)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
            _config = config;
            _cache = cache; 
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginDto loginDto)
        {
            if (loginDto == null)
            {
                return BadRequest("Invalid login data.");
            }

            var admin = _context.Admins.FirstOrDefault(a => a.Email == loginDto.Email);
            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

            var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(admin, admin.Password, loginDto.Password);
            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid password.");
            }

            var token = GenerateJwtToken(admin);
            var refreshToken = GenerateRefreshToken();

            _cache.Set(refreshToken, admin.Email, TimeSpan.FromMinutes(30));

            return Ok(new { message = "Admin login successfully.", token, refreshToken });
        }

        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenRequest)
        {
            if (refreshTokenRequest == null)
            {
                return BadRequest("Invalid client request.");
            }

            // Kiểm tra refresh token trong cache
            if (!_cache.TryGetValue(refreshTokenRequest.RefreshToken, out string adminEmail))
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            var admin = _context.Admins.FirstOrDefault(a => a.Email == adminEmail);
            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

            var newToken = GenerateJwtToken(admin);
            var newRefreshToken = GenerateRefreshToken();

            // Cập nhật refresh token mới vào cache
            _cache.Set(newRefreshToken, admin.Email, TimeSpan.FromMinutes(30));

            return Ok(new { token = newToken, refreshToken = newRefreshToken });
        }

        private string GenerateJwtToken(Admin admin)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, admin.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("Email", admin.Email ?? ""),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}
