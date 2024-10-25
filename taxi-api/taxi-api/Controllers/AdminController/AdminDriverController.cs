using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using taxi_api.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace taxi_api.Controllers.AdminController
{
    [Route("api/[controller]")]
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
        [HttpPost("activate/{driverId}")]
        public IActionResult ActivateDriver(int driverId)
        {
            var driver = _context.Drivers.FirstOrDefault(d => d.Id == driverId);
            if (driver == null)
            {
                return NotFound("Driver not found.");
            }

            driver.IsActive = true;
            _context.SaveChanges();

            return Ok(new { message = "Driver account activated successfully." });
        }
    }
}
