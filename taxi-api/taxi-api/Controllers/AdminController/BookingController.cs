using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using taxi_api.DTO;
using System;
using System.Linq;
using System.Threading.Tasks;
using taxi_api.Models;
using taxi_api.Helpers;

namespace taxi_api.Controllers.AdminController
{
    [Route("api/admin/booking")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly TaxiContext _context;

        public BookingController(TaxiContext context)
        {
            _context = context;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Customer)  // Include customer information if needed
                .Include(b => b.Arival)    // Include Arival information if needed
                .ToListAsync();

            if (bookings == null || !bookings.Any())
            {
                return NotFound(new
                {
                    code = CommonErrorCodes.NotFound,
                    data = (object)null,
                    message = "No trips found."
                });
            }

            // Select necessary information from bookings
            var bookingList = bookings.Select(b => new
            {
                b.Id,
                b.Code,
                CustomerName = b.Customer.Name,
                b.StartAt,
                b.EndAt,
                b.Price,
                b.Status,
                ArivalDetails = new
                {
                    b.Arival.PickUpAddress,
                    b.Arival.DropOffAddress,
                    b.Arival.Price
                }
            });

            return Ok(new
            {
                code = CommonErrorCodes.Success,
                data = bookingList,
                message = "Successfully retrieved the list of trips."
            });
        }

        [HttpPost("store")]
        public async Task<IActionResult> Store([FromBody] BookingRequestDto request)
        {
            // Validate the request
            if (request == null)
            {
                return BadRequest(new
                {
                    code = CommonErrorCodes.InvalidData,
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
                        code = CommonErrorCodes.InvalidData,
                        data = (object)null,
                        message = "Phone number already exists!"
                    });
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
                    return BadRequest(new
                    {
                        code = CommonErrorCodes.InvalidData,
                        data = (object)null,
                        message = "Customer does not exist!"
                    });
                }
            }
            else
            {
                return BadRequest(new
                {
                    code = CommonErrorCodes.InvalidData,
                    data = (object)null,
                    message = "Please select or create a new customer!"
                });
            }

            if (request.PickUpId == null || !await _context.Wards.AnyAsync(w => w.Id == request.PickUpId))
            {
                return BadRequest(new
                {
                    code = CommonErrorCodes.InvalidData,
                    data = (object)null,
                    message = "Invalid pick-up point!"
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
                        code = CommonErrorCodes.InvalidData,
                        data = (object)null,
                        message = "Please select a destination!"
                    });
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
                    code = CommonErrorCodes.InvalidData,
                    data = (object)null,
                    message = "No suitable driver found."
                });
            }

            return Ok(new
            {
                code = CommonErrorCodes.Success,
                data = new { bookingId = booking.Id },
                message = "Trip created successfully!"
            });
        }
    }
}
