using System;
using System.ComponentModel.DataAnnotations;

namespace taxi_api.DTO
{
    public class BookingRequestDto
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }

        public int? CustomerId { get; set; } 

        public int? ArivalId { get; set; } 

        public int? InviteId { get; set; } 

        [Required(ErrorMessage = "Start time is required.")]
        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; } 

        [Required(ErrorMessage = "Count is required.")]
        public int Count { get; set; }

        [Required(ErrorMessage = "Type is required.")]
        public string Types { get; set; } 

        [Required(ErrorMessage = "Price is required.")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number.")]
        public decimal Price { get; set; } 

        public int? PickUpId { get; set; }
        public string? PickUpAddress { get; set; }

        public int? DropOffId { get; set; } 

        [Required(ErrorMessage = "Drop-off address is required.")]
        public string DropOffAddress { get; set; } 
        public bool HasFull { get; set; }

        public DateTime CreatedAt { get; set; } 

        public DateTime UpdatedAt { get; set; }
    }
}
