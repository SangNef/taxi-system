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
                code = 200,
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
                    code = 400,
                    data = (object)null,
                    message = "Invalid request. Driver ID is required."
                });
            }

            // Tìm tài xế trong database theo driverId
            var driver = _context.Drivers.FirstOrDefault(d => d.Id == driverId);
            if (driver == null)
            {
                return NotFound(new
                {
                    code = 404,
                    data = (object)null,
                    message = "Driver not found."
                });
            }

            // Kích hoạt tài xế
            driver.IsActive = true;
            _context.SaveChanges();

            return Ok(new
            {
                code = 200,
                data = new { driverId = driver.Id },
                message = "Driver account activated successfully."
            });
        }
    }
}
