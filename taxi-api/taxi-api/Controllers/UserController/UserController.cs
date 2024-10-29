using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taxi_api.Models;
using taxi_api.DTO;
using taxi_api.Helpers;

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
        [HttpPost("store")]
        public async Task<IActionResult> Store([FromBody] BookingRequestDto request)
        {
            if (request == null)
            {
                return BadRequest(new
                {
                    code = 400,
                    data = (object)null,
                    message = "Invalid data."
                });
            }

            Customer customer;

            if (!string.IsNullOrEmpty(request.Name) && !string.IsNullOrEmpty(request.Phone))
            {
                customer = await _context.Customers.FirstOrDefaultAsync(c => c.Phone == request.Phone);
                if (customer != null)
                {
                    return BadRequest(new
                    {
                        code = 400,
                        data = (object)null,
                        message = "Số điện thoại đã tồn tại!"
                    });
                }
                else
                {
                    // Tạo khách hàng mới
                    customer = new Customer
                    {
                        Name = request.Name,
                        Phone = request.Phone
                    };
                    await _context.Customers.AddAsync(customer);
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                return BadRequest(new
                {
                    code = 400,
                    data = (object)null,
                    message = "Vui lòng nhập tên và số điện thoại của khách hàng!"
                });
            }

            // Kiểm tra điểm đón hợp lệ
            if (request.PickUpId == null || !await _context.Wards.AnyAsync(w => w.Id == request.PickUpId))
            {
                return BadRequest(new
                {
                    code = 400,
                    data = (object)null,
                    message = "Điểm đón không hợp lệ!"
                });
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
                    return BadRequest(new
                    {
                        code = 400,
                        data = (object)null,
                        message = "Vui lòng chọn điểm đến!"
                    });
                }
                arival.DropOffId = request.DropOffId;
                arival.DropOffAddress = request.DropOffAddress;
            }

            await _context.Arivals.AddAsync(arival);
            await _context.SaveChangesAsync();

            // Tạo chuyến đi mới
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
                InviteId = 0
            };

            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();

            var taxi = await FindDriverHelper.FindDriver(booking.Id, 0, _context);

            if (taxi == null)
            {
                return BadRequest(new
                {
                    code = 400,
                    data = (object)null,
                    message = "Không tìm thấy tài xế phù hợp."
                });
            }

            return Ok(new
            {
                code = 200,
                data = new { bookingId = booking.Id },
                message = "Tạo chuyến đi thành công!"
            });
        }

    }
}
