namespace Quizz.Models
{
    public class UserAnswer
    {
        public int user_answer_id { get; set; }
        public int quiz_id { get; set; }
        public int question_id { get; set; }
        public int answer_id { get; set; }
        public bool is_correct { get; set; }

        public Quiz Quiz { get; set; } = null!;
        public Question Question { get; set; } = null!;
        public Answer Answer { get; set; } = null!;
    }

}
