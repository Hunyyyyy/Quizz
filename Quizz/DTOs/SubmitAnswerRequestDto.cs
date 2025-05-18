namespace Quizz.DTOs
{
    public class SubmitAnswerRequestDto
    {
        public int QuizId { get; set; }
        public int QuestionId { get; set; }
        public int AnswerId { get; set; }
    }
}
