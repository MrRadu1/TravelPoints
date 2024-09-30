namespace TravelPoints.Models.Email
{
    public class MailData
    {
        public string EmailToAddress { get; set; }
        public string EmailToName { get; set; }
        public string EmailSubject { get; set; }
        public EmailBody EmailBody { get; set; }
    }
}
