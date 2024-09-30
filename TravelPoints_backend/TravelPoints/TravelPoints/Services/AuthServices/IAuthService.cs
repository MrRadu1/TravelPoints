namespace TravelPoints.Services.AuthServices

{
    public interface IAuthService
    {
        Task<string> AuthorizeUser(string username, string password);
        string EncryptPassword(string password);
    }
}
