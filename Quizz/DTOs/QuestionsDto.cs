using Quizz.Models;

namespace Quizz.DTOs
{
    public class QuestionsDto
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int CorrectAnswer { get; set; }
        public List<AnswerDto> Answers { get; set; } = new();
    }
    public class AnswerDto
    {
        public int AnswerId { get; set; }
        public string AnswerText { get; set; } = string.Empty;
    }

}
