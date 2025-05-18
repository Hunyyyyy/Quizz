namespace Quizz.Models
{
    public class User
    {
        public int user_id { get; set; }
        public required string username { get; set; }
        public string? email { get; set; }

        public ICollection<Quiz> Quiz { get; set; } = null!;
    }

}
