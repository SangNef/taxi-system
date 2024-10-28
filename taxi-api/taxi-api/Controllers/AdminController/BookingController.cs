using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using taxi_api.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using taxi_api.Models;
using Taxibibi.Helpers;


namespace Taxibibi.Controllers.AdminController
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly TaxiContext _context;

        public BookingController(TaxiContext context)
        {
            _context = context;
        }

        [HttpPost("store")]
        public async Task<IActionResult> Store([FromBody] BookingRequestDto request)
        {
            // Validate the request
            if (request == null)
            {
                return BadRequest("Invalid data.");
            }

            Customer customer;

            if (!string.IsNullOrEmpty(request.Name) && !string.IsNullOrEmpty(request.Phone))
            {
                customer = await _context.Customers.FirstOrDefaultAsync(c => c.Phone == request.Phone);
                if (customer != null)
                {
                    return BadRequest("Số điện thoại đã tồn tại!");
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
                    return BadRequest("Khách hàng không tồn tại!");
                }
            }
            else
            {
                return BadRequest("Vui lòng chọn hoặc tạo mới khách hàng!");
            }

            if (request.PickUpId == null || !await _context.Wards.AnyAsync(w => w.Id == request.PickUpId))
            {
                return BadRequest("Điểm đón không hợp lệ!");
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
                    return BadRequest("Vui lòng chọn điểm đến!");
                }
                arival.DropOffId = request.DropOffId;
                arival.DropOffAddress = request.DropOffAddress;
            }

            await _context.Arivals.AddAsync(arival);
            await _context.SaveChangesAsync();

            // Create new Booking
            var booking = new Booking
            {
                Code = "XG" + DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                CustomerId = customer.Id,
                ArivalId = arival.Id,
                StartAt = request.StartTime,
                EndAt = request.EndTime, 
                Count = request.Count,
                Price = request.Price,
                HasFull = request.HasFull,
                Status = "1"
            };

            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();

            var taxi = await FindDriverHelper.FindDriver(booking.Id, _context);

            return Ok("Tạo chuyến đi thành công!");
        }
    }
}
