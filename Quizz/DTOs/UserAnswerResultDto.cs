namespace Quizz.DTOs
{
    public class UserAnswerResultDto
    {
        public string QuestionText { get; set; } = string.Empty;
        public string SelectedAnswer { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}
