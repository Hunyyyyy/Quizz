using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quizz.DTOs;
using Quizz.Models;

namespace Quizz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public QuizController(QuizDbContext context)
        {
            _context = context;
        }
        [HttpGet("questions")]
        public async Task<IActionResult> GetQuestions()
        {
            var questions = await _context.Question
                .Include(q => q.Answer)
                .Select(q => new QuestionsDto
                {
                    QuestionId = q.question_id,
                    QuestionText = q.question_text,
                    Answers = q.Answer.Select(a => new AnswerDto
                    {
                        AnswerId = a.answer_id,
                        AnswerText = a.answer_text
                    }).ToList()
                })
                .ToListAsync();
            if(questions.Count()==0)
            {
                return NotFound("Không có câu hỏi nào trong hệ thống.");
            }
            var response = new ResponseModel<List<QuestionsDto>>(
            success: true,
            message: "Lấy danh sách câu hỏi thành công.",
            data: questions,
            code: 200
            );
            return Ok(response);
        }
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitAnswer([FromBody] SubmitAnswerRequestDto request)
        {
            try
            {
                var answer = await _context.Answer
                .FirstOrDefaultAsync(a => a.answer_id == request.AnswerId && a.question_id == request.QuestionId);

                if (answer == null)
                    return NotFound("Câu hỏi hoặc đáp án không tồn tại.");

                var isCorrect = answer.is_correct;

                var userAnswer = new UserAnswer
                {
                    quiz_id = request.QuizId,
                    question_id = request.QuestionId,
                    answer_id = request.AnswerId,
                    is_correct = isCorrect
                };
                _context.User_Answer.Add(userAnswer);
                var quiz = await _context.Quiz.FindAsync(request.QuizId);
                if (quiz != null && isCorrect)
                {
                    quiz.correct_answers += 1;
                }

                await _context.SaveChangesAsync();
                var userAnswerDto = new UserAnswerSubmitDto
                {
                    UserAnswerId = userAnswer.user_answer_id,
                    QuizId = userAnswer.quiz_id,
                    QuestionId = userAnswer.question_id,
                    AnswerId = userAnswer.answer_id,
                    IsCorrect = userAnswer.is_correct
                };
                var response = new ResponseModel<UserAnswerSubmitDto>(
                    success: true,
                    message: "Đáp án đã được lưu thành công.",
                    data: userAnswerDto,
                    code: 200
                );
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel<string>(false, "Có lỗi xảy ra khi lưu đáp án.", ex.Message, 500));

            }
        }
        [HttpPost("start")]
        public async Task<IActionResult> StartQuiz([FromBody] StartQuizRequestDto request)
        {
            try
            {
                var user = await _context.User.FindAsync(request.UserId);
                if (user == null)
                    return NotFound(new ResponseModel<string>(false, "Người dùng không tồn tại.", "", 404));

                var quiz = new Quiz
                {
                    user_id = request.UserId,
                    start_time = DateTime.UtcNow,
                    correct_answers = 0,
                    result = "InProgress"
                };

                _context.Quiz.Add(quiz);
                await _context.SaveChangesAsync();

                var response = new ResponseModel<int>(
                    success: true,
                    message: "Bắt đầu bài kiểm tra thành công.",
                    data: quiz.quiz_id,
                    code: 200
                );
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel<string>(false, "Có lỗi xảy ra khi bắt đầu bài kiểm tra.", ex.Message, 500));

            }

        }

        [HttpGet("result/{quizId}")]
        public async Task<IActionResult> GetQuizResult(int quizId)
        {
            var quiz = await _context.Quiz
                .Include(q => q.UserAnswers)
                    .ThenInclude(ua => ua.Question)
                .Include(q => q.UserAnswers)
                    .ThenInclude(ua => ua.Answer)
                .FirstOrDefaultAsync(q => q.quiz_id == quizId);

            if (quiz == null)
                return NotFound(new ResponseModel<string>(false, "Bài kiểm tra không tồn tại.", "", 404));

            var passingThreshold = 0.6;
            var totalQuestions = quiz.UserAnswers.Count;
            var correctAnswers = quiz.correct_answers;
            var pass = (double)correctAnswers / totalQuestions >= passingThreshold;

            if (quiz.end_time == null)
            {
                quiz.end_time = DateTime.UtcNow;
                quiz.total_time = (int)(quiz.end_time.Value - quiz.start_time).TotalSeconds;
                quiz.result = pass ? "Pass" : "Fail";
                await _context.SaveChangesAsync();
            }

            var resultDto = new QuizResultDto
            {
                QuizId = quiz.quiz_id,
                TotalTime = quiz.total_time,
                CorrectAnswers = correctAnswers,
                TotalQuestions = totalQuestions,
                Result = quiz.result!,
                UserAnswers = quiz.UserAnswers.Select(ua => new UserAnswerResultDto
                {
                    QuestionText = ua.Question?.question_text ?? "Unknown Question",
                    SelectedAnswer = ua.Answer?.answer_text ?? "Unknown Answer",
                    IsCorrect = ua.is_correct
                }).ToList()
            };

            var response = new ResponseModel<QuizResultDto>
            (true, "Lấy kết quả bài kiểm tra thành công.", resultDto, 200);

            return Ok(response);
        }
    }

}
