using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taxi_api.Models;

namespace Taxibibi.Helpers
{
    public static class FindDriverHelper
    {
        public static async Task<Driver> FindDriver(int bookingId, TaxiContext context)
        {
            var booking = await context.Bookings.FindAsync(bookingId);
            if (booking == null)
            {
                return null; // Không tìm thấy booking
            }

            var bookingStartDate = booking.StartAt;
            var bookingCount = booking.Count;

            // Bước 1: Lấy danh sách tài xế có số ghế đủ để đáp ứng số lượng khách trong booking hiện tại
            var drivers = await context.Drivers
                .Include(d => d.Taxies)
                .Where(d => d.Taxies.Any(t => t.Seat >= bookingCount)) // Chỉ chọn tài xế có số ghế >= bookingCount
                .ToListAsync();

            if (!drivers.Any())
            {
                return null; // Không tìm thấy tài xế phù hợp
            }

            var validDrivers = new List<Driver>();

            // Bước 2: Lọc tài xế dựa trên số lượng booking hiện có cho tài xế đó
            foreach (var driver in drivers)
            {
                var taxi = driver.Taxies.FirstOrDefault(); // Lấy taxi đầu tiên của tài xế

                if (taxi != null)
                {
                    // Tính tổng số lượng khách đã đặt cho tài xế này trong cùng ngày
                    var totalBookings = await context.BookingDetails
                        .Include(bd => bd.Booking)
                        .Where(bd => bd.TaxiId == taxi.Id &&
                                     bd.Booking.StartAt.HasValue &&  // Kiểm tra nếu StartTime có giá trị
                                     bd.Booking.StartAt.Value.Date == bookingStartDate.Value.Date)  // Sử dụng .Value để truy cập giá trị thực sự của DateTime?
                        .SumAsync(bd => bd.Booking.Count);

                    // Kiểm tra nếu tổng số lượng khách trong các booking <= số ghế của taxi
                    if (totalBookings + bookingCount <= taxi.Seat)
                    {
                        validDrivers.Add(driver);
                    }
                }
            }

            if (!validDrivers.Any())
            {
                return null; // Không còn tài xế nào còn chỗ trống
            }

            // Chọn ngẫu nhiên một tài xế hợp lệ từ danh sách
            var selectedDriver = validDrivers[new Random().Next(validDrivers.Count)];

            // Bước 3: Lưu thông tin taxi và booking_detail
            var selectedTaxi = selectedDriver.Taxies.FirstOrDefault();
            if (selectedTaxi != null)
            {
                // Lưu thông tin taxi và booking_detail
                var bookingDetail = new BookingDetail
                {
                    BookingId = bookingId,
                    TaxiId = selectedTaxi.Id, 
                    Status = "1", 
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await context.BookingDetails.AddAsync(bookingDetail); // Thêm booking detail vào context
                await context.SaveChangesAsync(); // Lưu tất cả các thay đổi vào cơ sở dữ liệu

                return selectedDriver; // Trả về đối tượng Driver đã được chọn
            }

            return null;
        }
    }
}
