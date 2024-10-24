using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using taxi_api.DTO;
using taxi_api.Models;

namespace Taxi.Controllers.DriverController
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly TaxiContext _context;
        private readonly IPasswordHasher<Driver> _passwordHasher;
        private readonly IConfiguration _config;

        public DriverController(TaxiContext context, IPasswordHasher<Driver> passwordHasher, IConfiguration config)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
            _config = config;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] DriverRegisterDto driverDto)
        {
            if (driverDto == null)
            {
                return BadRequest("Invalid driver data.");
            }

            var existingDriver = _context.Drivers.FirstOrDefault(d => d.Phone == driverDto.Phone);
            if (existingDriver != null)
            {
                return Conflict("Driver with this phone number already exists.");
            }

            var newDriver = new Driver
            {
                Fullname = driverDto.Name,
                Phone = driverDto.Phone,
                Password = _passwordHasher.HashPassword(null, driverDto.Password),
                IsActive = driverDto.IsActive,
                IsDelete = driverDto.IsDelete,
                Point = driverDto.Point,
                Commission = driverDto.Commission ?? 0,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Drivers.Add(newDriver);
            _context.SaveChanges();

            var token = GenerateJwtToken(newDriver);
            return Ok(new { message = "Driver registered successfully.", token });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] DriverLoginDto loginDto)
        {
            if (loginDto == null)
                return BadRequest("Invalid login data.");

            var driver = _context.Drivers.FirstOrDefault(d => d.Phone == loginDto.Phone);
            if (driver == null)
                return NotFound("Driver not found.");

            var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(driver, driver.Password, loginDto.Password);
            if (passwordVerificationResult == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid password.");

            var token = GenerateJwtToken(driver);
            var refreshToken = GenerateRefreshToken();

            driver.RefreshToken = refreshToken;
            driver.RefreshTokenExpiryTime = DateTime.Now.AddDays(Convert.ToDouble(_config["Jwt:RefreshTokenExpiryDays"]));

            _context.SaveChanges();

            return Ok(new { message = "Driver login successfully.", token, refreshToken });
        }

        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenRequest)
        {
            if (refreshTokenRequest == null)
                return BadRequest("Invalid client request.");

            var driver = _context.Drivers.FirstOrDefault(d => d.RefreshToken == refreshTokenRequest.RefreshToken);
            if (driver == null || driver.RefreshTokenExpiryTime <= DateTime.Now)
                return Unauthorized("Invalid or expired refresh token.");

            var newToken = GenerateJwtToken(driver);
            var newRefreshToken = GenerateRefreshToken();

            driver.RefreshToken = newRefreshToken;
            driver.RefreshTokenExpiryTime = DateTime.Now.AddDays(Convert.ToDouble(_config["Jwt:RefreshTokenExpiryDays"]));

            _context.SaveChanges();

            return Ok(new { token = newToken, refreshToken = newRefreshToken });
        }

        private string GenerateJwtToken(Driver driver)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, driver.Fullname), // Changed to driver.Fullname
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("Phone", driver.Phone ?? ""),
                new Claim("DriverId", driver.Id.ToString()) // Add DriverId as a claim
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiryMinutes"])),
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
