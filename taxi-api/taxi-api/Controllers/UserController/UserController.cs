using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taxi_api.Models;

namespace taxi_api.Controllers.UserController
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly TaxiContext _context;

        public UserController(TaxiContext context)
        {
            _context = context;
        }

        // GET api/user/search-booking?code=XG123456
        [HttpGet("search-booking")]
        public async Task<IActionResult> SearchBooking(string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                return BadRequest(new
                {
                    code = 400,
                    data = (object)null,
                    message = "Vui lòng nhập mã chuyến đi."
                });
            }

            var booking = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Arival)
                .FirstOrDefaultAsync(b => b.Code == code);

            if (booking == null)
            {
                return NotFound(new
                {
                    code = 404,
                    data = (object)null,
                    message = "Không tìm thấy chuyến đi với mã đã nhập."
                });
            }

            // Trả về thông tin chuyến đi
            return Ok(new
            {
                code = 200,
                data = new
                {
                    BookingId = booking.Id,
                    booking.Code,
                    booking.StartAt,
                    booking.EndAt,
                    booking.Count,
                    booking.Status,
                    Customer = new
                    {
                        booking.Customer.Name,
                        booking.Customer.Phone
                    },
                    Arival = new
                    {
                        booking.Arival.PickUpAddress,
                        booking.Arival.DropOffAddress,
                        booking.Arival.Price
                    }
                },
                message = "Success"
            });
        }

        [HttpGet("wards/search")]
        public async Task<IActionResult> GetWardInfoByName([FromQuery] string wardName)
        {
            if (string.IsNullOrEmpty(wardName))
            {
                return BadRequest(new
                {
                    code = 400,
                    data = (object)null,
                    message = "Ward name is required."
                });
            }

            var wardInfo = await _context.Wards
                .Where(w => EF.Functions.Like(w.Name, $"%{wardName}%"))
                .Include(w => w.District)
                .ThenInclude(d => d.Province)
                .Select(w => new
                {
                    WardId = w.Id,
                    WardName = w.Name,
                    District = new
                    {
                        DistrictId = w.District.Id,
                        DistrictName = w.District.Name,
                    },
                    Province = new
                    {
                        ProvinceId = w.District.Province.Id,
                        ProvinceName = w.District.Province.Name,
                        ProvincePrice = w.District.Province.Price
                    }
                })
                .Take(30)
                .ToListAsync();

            if (!wardInfo.Any())
            {
                return NotFound(new
                {
                    code = 404,
                    data = (object)null,
                    message = "No matching wards found."
                });
            }

            return Ok(new
            {
                code = 200,
                data = wardInfo,
                message = "Success"
            });
        }
    }
}
