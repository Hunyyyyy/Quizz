namespace Quizz.Models
{
    public class Answer
    {
        public int answer_id { get; set; }
        public int question_id { get; set; }
        public required string answer_text { get; set; }
        public bool is_correct { get; set; }

        public Question Question { get; set; } = null!;
        public ICollection<UserAnswer> UserAnswers { get; set; } = null!;
    }

}
