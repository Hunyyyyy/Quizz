namespace Quizz.Models
{
    public class Question
    {
        public int question_id { get; set; }
        public required string question_text { get; set; }
        public int correct_answer { get; set; } 

        public ICollection<Answer> Answer { get; set; } = null!;
        public ICollection<UserAnswer> UserAnswer { get; set; } = null!;
    }

}
