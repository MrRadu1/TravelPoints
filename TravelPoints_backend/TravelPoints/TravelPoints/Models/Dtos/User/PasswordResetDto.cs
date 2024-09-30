namespace TravelPoints.Models.Dtos.User
{
    public class PasswordResetDto
    {
        public string Email { get; set; }
        public string Verification { get; set; }
        public string NewPassword { get; set; }
    }
}
