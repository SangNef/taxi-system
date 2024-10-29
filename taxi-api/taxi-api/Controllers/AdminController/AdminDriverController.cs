using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using taxi_api.DTO;
using taxi_api.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace taxi_api.Controllers.AdminController
{
    [Route("api/admin/driver")]
    [ApiController]
    public class AdminDriverController : ControllerBase
    {
        private readonly TaxiContext _context;

        public AdminDriverController(TaxiContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        [HttpGet("index")]
        public IActionResult Index()
        {
            var drivers = _context.Drivers.ToList();
            return Ok(drivers);
        }
        //[HttpPost("activate")]
        //public IActionResult ActivateDriver()
        //{
        //    var driverIdClaim = User.Claims.FirstOrDefault(c => c.Type == "DriverId")?.Value;
        //    if (string.IsNullOrEmpty(driverIdClaim))
        //    {
        //        return Unauthorized("Driver ID not found in token.");
        //    }

        //    if (!int.TryParse(driverIdClaim, out int driverId))
        //    {
        //        return BadRequest("Invalid Driver ID in token.");
        //    }

        //    var driver = _context.Drivers.FirstOrDefault(d => d.Id == driverId);
        //    if (driver == null)
        //    {
        //        return NotFound("Driver not found.");
        //    }

        //    driver.IsActive = true;
        //    _context.SaveChanges();

        //    return Ok(new { message = "Driver account activated successfully." });
        //}
        [HttpPost("activate")]
        public IActionResult ActivateDriver([FromBody] ActivateDriverDto activateDto)
        {
            if (activateDto == null || string.IsNullOrEmpty(activateDto.Token))
            {
                return BadRequest("Invalid request. Token is required.");
            }

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(activateDto.Token);
            var driverIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "DriverId")?.Value;

            if (string.IsNullOrEmpty(driverIdClaim))
            {
                return Unauthorized("Driver ID not found in token.");
            }

            if (!int.TryParse(driverIdClaim, out int driverId))
            {
                return BadRequest("Invalid Driver ID in token.");
            }

            // Tìm tài xế trong database
            var driver = _context.Drivers.FirstOrDefault(d => d.Id == driverId);
            if (driver == null)
            {
                return NotFound("Driver not found.");
            }

            // Kích hoạt tài xế
            driver.IsActive = true;
            _context.SaveChanges();

            return Ok(new { message = "Driver account activated successfully." });
        }
    }
}
