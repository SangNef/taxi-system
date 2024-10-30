using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taxi_api.Models;

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
            return Ok(new
            {
                code = CommonErrorCodes.Success,
                data = drivers,
                message = "Retrieved drivers successfully."
            });
        }

        [HttpPost("activate/{driverId}")]
        public IActionResult ActivateDriver(int driverId)
        {
            if (driverId <= 0)
            {
                return BadRequest(new
                {
                    code = CommonErrorCodes.InvalidData,
                    data = (object)null,
                    message = "Invalid request. Driver ID is required."
                });
            }

            // Find the driver in the database by driverId
            var driver = _context.Drivers.FirstOrDefault(d => d.Id == driverId);
            if (driver == null)
            {
                return NotFound(new
                {
                    code = CommonErrorCodes.NotFound,
                    data = (object)null,
                    message = "Driver not found."
                });
            }

            // Activate the driver
            driver.IsActive = true;
            _context.SaveChanges();

            return Ok(new
            {
                code = CommonErrorCodes.Success,
                data = new { driverId = driver.Id },
                message = "Driver account activated successfully."
            });
        }
    }
}
