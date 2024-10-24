using System.ComponentModel.DataAnnotations;

namespace taxi_api.DTO
{
    public class DriverRegisterDto
    {
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Phone is required.")]
        [Phone(ErrorMessage = "Invalid phone number format.")]
        public string Phone { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, ErrorMessage = "Password must be at least {2} characters long.", MinimumLength = 6)]
        public string Password { get; set; } = null!;

        public bool IsDelete { get; set; } = false;

        public int? Point { get; set; } = 0;

        public bool IsActive { get; set; } = false;

        public int? Commission { get; set; } = 0;
    }
}
