import { useState } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null); // Để hiển thị phản hồi đúng/sai
  const [showResultPrompt, setShowResultPrompt] = useState(false); // Để hiển thị thông báo hỏi xem kết quả

  const API_BASE_URL = 'https://localhost:7054/api/quiz';

  // Lấy danh sách câu hỏi từ API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/questions`);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách câu hỏi');
      }
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Bắt đầu bài kiểm tra mới
  const startQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: 1, // Thay bằng userId thực tế từ thông tin đăng nhập
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể bắt đầu bài kiểm tra');
      }

      const data = await response.json();
      if (data.success) {
        setQuizId(data.data);
        setQuizStarted(true);
        setQuizCompleted(false);
        setQuizResult(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setFeedback(null);
        setShowResultPrompt(false);
        await fetchQuestions();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gửi đáp án và nhận phản hồi
  const handleAnswerSelect = async (answerId) => {
    setSelectedAnswer(answerId);
    setError(null);

    try {
      setLoading(true);
      const currentQuestion = questions[currentQuestionIndex];
      const requestBody = {
        QuizId: quizId,
        QuestionId: currentQuestion.questionId,
        AnswerId: answerId,
      };

      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Không thể gửi đáp án');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      // Hiển thị phản hồi đúng/sai
      setFeedback(data.data.isCorrect ? 'Đúng!' : 'Sai!');

      // Chuyển sang câu hỏi tiếp theo sau 1 giây
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // Hiển thị thông báo hỏi xem kết quả
          setShowResultPrompt(true);
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lấy kết quả bài kiểm tra
  const fetchQuizResult = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/result/${quizId}`);
      if (!response.ok) {
        throw new Error('Không thể lấy kết quả bài kiểm tra');
      }

      const data = await response.json();
      if (data.success) {
        setQuizResult(data.data);
        setQuizCompleted(true);
        setShowResultPrompt(false);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Chơi lại bài kiểm tra
  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuizResult(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setError(null);
    setFeedback(null);
    setShowResultPrompt(false);
  };

  // Thoát ứng dụng (giả lập bằng cách reset về màn hình chính)
  const exitApp = () => {
    resetQuiz();
  };

return (
    <div className="app-container">
      <header className="app-header">
        <h1>Ứng dụng Quiz</h1>
      </header>

      {/* Màn hình bắt đầu */}
      {!quizStarted && !quizCompleted && !showResultPrompt && (
        <div className="start-screen">
          <button className="start-button" onClick={startQuiz} disabled={loading}>
            {loading ? 'Đang tải...' : 'Bắt đầu bài kiểm tra'}
          </button>
        </div>
      )}

      {/* Hiển thị câu hỏi và đáp án */}
      {quizStarted && !quizCompleted && !showResultPrompt && questions.length > 0 && (
        <div className="quiz-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="question-progress">
            Câu hỏi {currentQuestionIndex + 1} / {questions.length}
          </div>

          <div className="question-card">
            <h3>{questions[currentQuestionIndex].questionText}</h3>

            <div className="answers-grid">
              {questions[currentQuestionIndex].answers.map((answer) => (
                <button
                  key={answer.answerId}
                  className={`answer-button ${
                    selectedAnswer === answer.answerId ? 'selected' : ''
                  } ${
                    feedback && selectedAnswer === answer.answerId
                      ? feedback === 'Đúng!'
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }`}
                  onClick={() => handleAnswerSelect(answer.answerId)}
                  disabled={loading}
                >
                  {answer.answerText}
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`feedback ${feedback === 'Đúng!' ? 'correct' : 'incorrect'}`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thông báo hỏi xem kết quả */}
      {showResultPrompt && (
        <div className="result-prompt">
          <h2>Bạn đã hoàn thành bài kiểm tra!</h2>
          <p>Bạn có muốn xem kết quả không?</p>
          <div className="prompt-buttons">
            <button onClick={fetchQuizResult} disabled={loading}>
              {loading ? 'Đang tải...' : 'Xem kết quả'}
            </button>
            <button onClick={exitApp} disabled={loading}>Thoát</button>
          </div>
        </div>
      )}

      {/* Hiển thị kết quả */}
      {quizCompleted && quizResult && (
        <div className="results-section">
          <h2>Kết quả bài kiểm tra</h2>
          <div className="result-card">
            <p>Điểm số: {quizResult.correctAnswers} / {quizResult.totalQuestions}</p>
            <p>Kết quả: {quizResult.result === 'Pass' ? 'Đạt' : 'Không đạt'}</p>
            <p>Thời gian hoàn thành: {quizResult.totalTime} giây</p>
          </div>

          <h3>Chi tiết câu trả lời:</h3>
          <div className="answer-details">
            {quizResult.userAnswers.map((answer, index) => (
              <div
                key={index}
                className={`answer-detail ${
                  answer.isCorrect ? 'correct' : 'incorrect'
                }`}
              >
                <p><strong>Câu hỏi {index + 1}:</strong> {answer.questionText}</p>
                <p><strong>Đáp án của bạn:</strong> {answer.selectedAnswer}</p>
                {!answer.isCorrect && answer.correctAnswer && (
                  <p><strong>Đáp án đúng:</strong> {answer.correctAnswer}</p>
                )}
                <p><strong>Kết quả:</strong> {answer.isCorrect ? 'Đúng' : 'Sai'}</p>
              </div>
            ))}
          </div>

          <div className="result-actions">
            <button onClick={resetQuiz}>Chơi lại</button>
            <button onClick={exitApp}>Thoát</button>
          </div>
        </div>
      )}

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="error-message">
          <p>Lỗi: {error}</p>
          <button onClick={() => setError(null)}>Ẩn</button>
        </div>
      )}
    </div>
  );
}

export default App;