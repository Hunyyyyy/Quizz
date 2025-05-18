namespace Quizz.DTOs
{
    public class UserAnswerSubmitDto
    {
        public int UserAnswerId { get; set; }
        public int QuizId { get; set; }
        public int QuestionId { get; set; }
        public int AnswerId { get; set; }
        public bool IsCorrect { get; set; }
    }
}
