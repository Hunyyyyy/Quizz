namespace Quizz.Models
{
    public class Quiz
    {
        public int quiz_id { get; set; }
        public int user_id { get; set; }
        public DateTime start_time { get; set; }
        public DateTime? end_time { get; set; }
        public int? total_time { get; set; }
        public int correct_answers { get; set; }
        public required string result { get; set; }

        public User User { get; set; } = null!;
        public ICollection<UserAnswer> UserAnswers { get; set; } = null!;
    }

}
