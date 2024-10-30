using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using taxi_api.DTO;
using taxi_api.Models;
using taxi_api.Helpers;

namespace taxi_api.Controllers.DriverController
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly TaxiContext _context;
        private readonly IPasswordHasher<Driver> _passwordHasher;
        private readonly IConfiguration _config;
        private readonly IMemoryCache _cache;

        public DriverController(TaxiContext context, IPasswordHasher<Driver> passwordHasher, IConfiguration config, IMemoryCache cache)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
            _config = config;
            _cache = cache;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] DriverRegisterDto driverDto)
        {
            if (driverDto == null)
            {
                return BadRequest(new { code = CommonErrorCodes.InvalidData, message = "Invalid Data." });
            }

            var existingDriver = _context.Drivers.FirstOrDefault(d => d.Phone == driverDto.Phone);
            if (existingDriver != null)
            {
                return Conflict(new { code = CommonErrorCodes.InvalidData, message = "The driver with this phone number already exists." });
            }

            var newDriver = new Driver
            {
                Fullname = driverDto.Name,
                Phone = driverDto.Phone,
                Password = _passwordHasher.HashPassword(null, driverDto.Password),
                IsActive = false,
                IsDelete = false,
                Point = 0,
                Commission = 0,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Drivers.Add(newDriver);
            _context.SaveChanges();

            var token = GenerateJwtToken(newDriver);
            return Ok(new { code = CommonErrorCodes.Success, message = "Register Driver Successfully", data = new { token } });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] DriverLoginDto loginDto)
        {
            if (loginDto == null)
                return BadRequest(new { code = CommonErrorCodes.InvalidData, message = "Invalid login data." });

            var driver = _context.Drivers.FirstOrDefault(d => d.Phone == loginDto.Phone);
            if (driver == null)
                return NotFound(new { code = CommonErrorCodes.NotFound, message = "Driver does not exist." });

            var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(driver, driver.Password, loginDto.Password);
            if (passwordVerificationResult == PasswordVerificationResult.Failed)
                return Unauthorized(new { code = CommonErrorCodes.Unauthorized, message = "Invalid account or password" });

            if (driver.IsActive != true)
                return Unauthorized(new { code = CommonErrorCodes.Unauthorized, message = "Driver account is not activated." });

            if (driver.IsDelete == true)
                return Unauthorized(new { code = CommonErrorCodes.Unauthorized, message = "Your account is locked. Please contact customer support." });

            // Check if the driver has an assigned vehicle
            var taxi = _context.Taxies.FirstOrDefault(t => t.DriverId == driver.Id && t.DeletedAt == null);
            if (taxi == null)
            {
                return Unauthorized(new { code = CommonErrorCodes.Unauthorized, message = "Driver has no vehicle assigned." });
            }

            var token = GenerateJwtToken(driver);
            var refreshToken = GenerateRefreshToken();
            _cache.Set(driver.Id.ToString(), refreshToken, TimeSpan.FromDays(1));

            return Ok(new { code = CommonErrorCodes.Success, message = "Driver logged in successfully.", data = new { token, refreshToken } });
        }

        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenRequest)
        {
            if (refreshTokenRequest == null)
                return BadRequest(new { code = CommonErrorCodes.InvalidData, message = "Invalid client request." });

            if (!_cache.TryGetValue(refreshTokenRequest.RefreshToken, out string driverId))
                return Unauthorized(new { code = CommonErrorCodes.Unauthorized, message = "Invalid or expired refresh token." });

            var driver = _context.Drivers.FirstOrDefault(d => d.Id.ToString() == driverId);
            if (driver == null)
                return NotFound(new { code = CommonErrorCodes.NotFound, message = "Driver not found." });

            var newToken = GenerateJwtToken(driver);
            var newRefreshToken = GenerateRefreshToken();

            _cache.Set(driver.Id.ToString(), newRefreshToken, TimeSpan.FromDays(1));

            return Ok(new { token = newToken, refreshToken = newRefreshToken });
        }

        private string GenerateJwtToken(Driver driver)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, driver.Fullname),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("Phone", driver.Phone ?? ""),
                new Claim("DriverId", driver.Id.ToString())
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

        [HttpPost("create-booking")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDto request)
        {
            if (request == null)
                return BadRequest(new { code = CommonErrorCodes.InvalidData, message = "Invalid data." });

            var driverIdClaim = User.Claims.FirstOrDefault(c => c.Type == "DriverId")?.Value;
            if (string.IsNullOrEmpty(driverIdClaim) || !int.TryParse(driverIdClaim, out int driverId))
            {
                return Unauthorized(new { code = CommonErrorCodes.Unauthorized, message = "Invalid driver." });
            }

            Customer customer;
            if (!string.IsNullOrEmpty(request.Name) && !string.IsNullOrEmpty(request.Phone))
            {
                customer = await _context.Customers.FirstOrDefaultAsync(c => c.Phone == request.Phone);
                if (customer != null)
                {
                    return BadRequest(new { code = CommonErrorCodes.InvalidData, message = "Phone number already exists!" });
                }
                else
                {
                    customer = new Customer
                    {
                        Name = request.Name,
                        Phone = request.Phone
                    };
                    await _context.Customers.AddAsync(customer);
                }
            }
            else if (request.CustomerId.HasValue)
            {
                customer = await _context.Customers.FindAsync(request.CustomerId);
                if (customer == null)
                {
                    return BadRequest(new { code = CommonErrorCodes.InvalidData, message = "Customer does not exist!" });
                }
            }
            else
            {
                return BadRequest(new { code = CommonErrorCodes.InvalidData, message = "Please select or create a new customer!" });
            }

            if (request.PickUpId == null || !await _context.Wards.AnyAsync(w => w.Id == request.PickUpId))
            {
                return BadRequest(new { code = CommonErrorCodes.InvalidData, message = "Invalid pickup point!" });
            }

            var arival = new Arival
            {
                Type = request.Types,
                Price = request.Price,
                PickUpId = request.PickUpId,
                PickUpAddress = request.PickUpAddress,
                DropOffId = request.DropOffId,
                DropOffAddress = request.DropOffAddress
            };

            if (request.Types == "province")
            {
                if (request.DropOffId == null || string.IsNullOrEmpty(request.DropOffAddress))
                {
                    return BadRequest(new { code = CommonErrorCodes.InvalidData, message = "Please select a destination!" });
                }
                arival.DropOffId = request.DropOffId;
                arival.DropOffAddress = request.DropOffAddress;
            }

            await _context.Arivals.AddAsync(arival);
            await _context.SaveChangesAsync();

            var booking = new Booking
            {
                Code = "XG" + DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                CustomerId = customer.Id,
                ArivalId = arival.Id,
                StartAt = request.StartTime,
                EndAt = null,
                Count = request.Count,
                Price = request.Price,
                HasFull = request.HasFull,
                Status = "1",
                InviteId = driverId,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();

            return Ok(new { code = CommonErrorCodes.Success, message = "Booking created successfully!", data = booking });
        }
        [HttpGet("unassigned-bookings")]
        public async Task<IActionResult> GetUnassignedBookings()
        {
            var unassignedBookings = await _context.Bookings
                .Where(b => !_context.BookingDetails.Any(bd => bd.BookingId == b.Id))
                .ToListAsync();

            return Ok(new { code = CommonErrorCodes.Success, message = "Successfully retrieved the list of unassigned trips.", data = unassignedBookings });
        }

        [HttpGet("assigned-bookings")]
        public async Task<IActionResult> GetAssignedBookings()
        {
            var driverIdClaim = User.Claims.FirstOrDefault(c => c.Type == "DriverId")?.Value;
            if (string.IsNullOrEmpty(driverIdClaim) || !int.TryParse(driverIdClaim, out int driverId))
            {
                return Unauthorized(new { code = CommonErrorCodes.Unauthorized, message = "Invalid driver." });
            }

            var assignedBookings = await _context.Bookings
                .Where(b => b.InviteId == driverId)
                .Include(b => b.Customer)
                .Include(b => b.Arival)
                .ToListAsync();

            if (!assignedBookings.Any())
            {
                return NotFound(new { code = CommonErrorCodes.NotFound, message = "No trips assigned to this driver." });
            }

            var result = assignedBookings.Select(b => new
            {
                BookingId = b.Id,
                b.Code,
                b.StartAt,
                b.EndAt,
                b.Count,
                b.Price,
                b.Status,
                CustomerName = b.Customer.Name,
                CustomerPhone = b.Customer.Phone
            }).ToList();

            return Ok(new { code = CommonErrorCodes.Success, message = "Successfully retrieved assigned trips.", data = result });
        }

    }
}
