namespace Quizz.DTOs
{
    public class QuizResultDto
    {
        public int QuizId { get; set; }
        public int? TotalTime { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public string Result { get; set; } = string.Empty;
        public List<UserAnswerResultDto> UserAnswers { get; set; } = new();
    }
}
