using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Security.Cryptography;
using System.Text;
using TravelPoints.Models.Dtos.User;
using TravelPoints.Models.Email;
using TravelPoints.Models.Entites.Users;
using TravelPoints.Services.AuthServices;
using TravelPoints.Services.MailService;
using TravelPoints.Services.UserService;

namespace TravelPoints.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IAuthService _authService;
        private readonly IMailSenderService _mailSenderService;
        private readonly IUserService _userService;
        public UserController(
            ILogger<UserController> logger,
            IAuthService authService,
            IMailSenderService mailSenderService,
            IUserService userService
            )
        {
            _logger = logger;
            _authService = authService;
            _mailSenderService = mailSenderService;
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            try
            {
                var user = await _userService.FindUserById(id);
                return Ok(user);
            }
            catch ( Exception ex )
            {
                _logger.LogError(ex, "An error occurred while getting the user.");

                return StatusCode(500, $"An error occurred while getting the user: {ex.Message}");
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                var users = await _userService.GetUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while getting the user: {ex.Message}");
            }
        }

        [HttpPost("Register")]
        public async Task<ActionResult<User>> Register(User user)
        {
            try
            {    
                var userExistance = await _userService.CheckUserExistanceAsync(user);
                if (userExistance)
                {
                    return BadRequest("Email or Username is already in use.");
                }

                MailData mailData = new MailData()
                {
                    EmailToAddress = user.Email,
                    EmailToName = user.Username,
                    EmailSubject = "Welcome to TravelPoints",
                    EmailBody = new EmailBody()
                    {
                        UserName = user.Username,
                        UserAddress = "Ceahlau 77",
                        UserEmail = user.Email
                    }
                };

                user.Password = _authService.EncryptPassword(user.Password);
         
                await _userService.InsertUserAsync(user);
                await _mailSenderService.SendRegisterEmailAsync(mailData);

                return Ok("User added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while inserting the user: {ex.Message}");
            }
        }

        // endpoint for sending feedback mail
        [HttpPost("SendFeedback")]
        public async Task<ActionResult<string>> SendFeedback([FromQuery] string userName, [FromBody] string feedback)
        {
            try
            {
                MailData mailData = new MailData()
                {
                    EmailToAddress = "travel.points00@gmail.com",
                    EmailToName = userName,
                    EmailSubject = "Feedback for TravelPoints",
                    EmailBody = new EmailBody()
                    {
                        UserName = userName,
                        UserAddress = "Ceahlau 77",
                        UserEmail = "travel.points00@gmail.com"
                    }
                };
                await _mailSenderService.SendFeedbackEmailAsync(mailData, feedback);
                return Ok("Feedback sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while sending feedback: {ex.Message}");
            }
        }

        [HttpPost("AddToWishlist/{userEmail}/{pointId}")]
        public async Task<ActionResult<string>> AddToWishlist(string userEmail, string pointId)
        {
            try
            {
                var userFilter = Builders<User>.Filter.Eq(u => u.Email, userEmail);
                var user = await _userService.GetUserAsync(userFilter);

                if (user == null)
                {
                    return NotFound("User not found");
                }

                var wishlistItem = new Wishlist
                {
                    PointId = pointId
                };

                if (user.Whishlist == null)
                {
                    user.Whishlist = new Wishlist[] { wishlistItem };
                }
                else
                {
                    var updatedWishlist = user.Whishlist.ToList();
                    updatedWishlist.Add(wishlistItem);
                    user.Whishlist = updatedWishlist.ToArray();
                }

                var update = Builders<User>.Update.Set(u => u.Whishlist, user.Whishlist);
                await _userService.UpdateUserAsync(userFilter, update);

                return Ok("Point added to wishlist successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while adding to wishlist: {ex.Message}");
            }
        }


        [HttpPost("auth")]
        public async Task<ActionResult<string>> AuthUser(UserAuthDto userAuth)
        {
            var result =  await _authService.AuthorizeUser(userAuth.Email, userAuth.Password);
            if (result.IsNullOrEmpty())
            {
                return Unauthorized("Invalid login credentials");
            }

            return Ok(result);
        }

        [HttpPost("forgotPassword")]
        public async Task<ActionResult<string>> ForgotPassword(string email)
        {
            static string ComputeSHA256Hash(string input)
            {
                byte[] bytes = Encoding.UTF8.GetBytes(input);

                byte[] hashBytes = SHA256.Create().ComputeHash(bytes);

                var stringBuilder = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    stringBuilder.Append(hashBytes[i].ToString("x2"));
                }

                return stringBuilder.ToString();
            }

            var user = await _userService.FindByEmailAsync(email);
            
            if (user == null)
            {
                return BadRequest("No user with the specified email!");
            }
            var origin = this.Request.Headers.Origin;
            var link = origin + "/resetPassword/" + ComputeSHA256Hash(user.Id.ToString());
            MailData mailData = new MailData()
            {
                EmailToAddress = user.Email,
                EmailToName = user.Username,
                EmailSubject = "TravelPoints account password reset requested",
                EmailBody = new EmailBody()
                {
                    UserName = user.Username,
                    UserAddress = "Ceahlau 77",
                    UserEmail = user.Email
                }
            };
            await _mailSenderService.SendPasswordResetMail(mailData, link);

            return Ok("Reset Password email sent!");
        }

        [HttpPost("resetPassword")]
        public async Task<ActionResult<string>> PasswordReset(PasswordResetDto passwordReset)
        {
            static string ComputeSHA256Hash(string input)
            {
                byte[] bytes = Encoding.UTF8.GetBytes(input);

                byte[] hashBytes = SHA256.Create().ComputeHash(bytes);

                var stringBuilder = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    stringBuilder.Append(hashBytes[i].ToString("x2"));
                }

                return stringBuilder.ToString();
            }

            var incoming = passwordReset.Verification;
            var user = await _userService.FindByEmailAsync(passwordReset.Email);
            if (user == null)
            {
                return BadRequest("No user with the specified email!");
            }
            var expected = ComputeSHA256Hash(user.Id.ToString());
            if (!(expected.Equals(incoming)))
            {
                return BadRequest("Failed to verify something!");
            }
            user.Password = _authService.EncryptPassword(passwordReset.NewPassword);

            var res = _userService.ReplaceUser(user);

            return Ok("Reset password!");
        }
    }
}
