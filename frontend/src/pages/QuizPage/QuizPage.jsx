import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CountdownTimer from "../../components/quiz/CountdownTimer/CountdownTimer";
import QuestionCard from "../../components/quiz/QuestionCard/QuestionCard";
import QuestionNavigator from "../../components/quiz/QuestionNavigator/QuestionNavigator";
import SubmitConfirmModal from "../../components/quiz/SubmitConfirmModal/SubmitConfirmModal";
import useCountdown from "../../hooks/useCountdown";
import quizService from "../../services/quizService";
import submissionService from "../../services/submissionService";
import "./QuizPage.scss";

const hasAnswer = (answer) => answer !== undefined && String(answer).trim() !== "";

const QuizPage = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const hasSubmittedRef = useRef(false);
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    let active = true;

    const loadQuiz = async () => {
      if (!quizId) {
        navigate("/quizzes", { replace: true });
        return;
      }

      try {
        setPageLoading(true);
        setPageError("");
        setCurrentIndex(0);
        setAnswers({});
        hasSubmittedRef.current = false;

        const stateQuiz = location.state?.quiz;
        const stateQuestions = location.state?.questions;
        let result;

        if (stateQuiz?._id === quizId && stateQuestions?.length) {
          result = { quiz: stateQuiz, questions: stateQuestions };
        } else {
          result = await quizService.getPublishedQuizById(quizId);
        }

        if (!active) return;
        setQuiz(result.quiz);
        setQuestions(result.questions || []);
      } catch (requestError) {
        if (!active) return;
        setQuiz(null);
        setQuestions([]);
        setPageError(
          requestError.response?.data?.message ||
            "Không thể tải đề thi. Vui lòng thử lại."
        );
      } finally {
        if (active) setPageLoading(false);
      }
    };

    loadQuiz();
    return () => { active = false; };
  }, [location.state, navigate, quizId]);

  const answeredCount = useMemo(
    () => questions.filter((question) => hasAnswer(answers[question._id])).length,
    [answers, questions]
  );

  const handleSubmitQuiz = useCallback(
    async (submitType = "manual") => {
      if (hasSubmittedRef.current || !quiz || questions.length === 0) return;

      hasSubmittedRef.current = true;
      setIsSubmitting(true);
      setSubmitError("");

      try {
        const result = await submissionService.submitQuiz({
          quiz_id: quiz._id,
          answers: questions.map((question) => ({
            question_id: question._id,
            userAnswer: answersRef.current[question._id] || "",
          })),
        });

        navigate("/result", {
          replace: true,
          state: { result, quiz, submitType },
        });
      } catch (requestError) {
        setSubmitError(
          requestError.response?.data?.message || "Nộp bài thất bại. Vui lòng thử lại."
        );
        hasSubmittedRef.current = false;
        setShowSubmitModal(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate, questions, quiz]
  );

  const { timeLeft, resetCountdown } = useCountdown({
    enabled: Boolean(quiz) && !pageLoading && !isSubmitting,
    onExpire: () => handleSubmitQuiz("timeout"),
  });

  useEffect(() => {
    if (!quiz) return;
    resetCountdown((quiz.duration || 30) * 60);
  }, [quiz, resetCountdown]);

  if (pageLoading) {
    return (
      <main className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-state-card"><div className="quiz-state-spinner" />Đang tải đề thi...</div>
        </div>
      </main>
    );
  }

  if (pageError) {
    return (
      <main className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-state-card error">
            <h2>Không thể mở đề thi</h2>
            <p>{pageError}</p>
            <button type="button" onClick={() => navigate("/quizzes")}>Quay lại danh sách đề</button>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (!quiz || !currentQuestion) {
    return (
      <main className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-state-card">
            <h2>Đề thi chưa có câu hỏi khả dụng</h2>
            <p>Các câu hỏi trong đề có thể chưa được xuất bản.</p>
            <button type="button" onClick={() => navigate("/quizzes")}>Chọn đề khác</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="quiz-page">
      <div className="quiz-container">
        <header className="quiz-topbar">
          <div className="quiz-title-block">
            <span className="quiz-label">Phòng thi thử</span>
            <h1>{quiz.title}</h1>
            <p>Câu {currentIndex + 1}/{questions.length} · Đã trả lời {answeredCount}/{questions.length}</p>
          </div>
          <CountdownTimer timeLeft={timeLeft} />
        </header>

        {submitError && (
          <div className="exam-submit-error" role="alert">
            <span>{submitError}</span>
            {timeLeft === 0 && (
              <button type="button" onClick={() => handleSubmitQuiz("timeout")}>Thử nộp lại</button>
            )}
          </div>
        )}

        <div className="quiz-layout">
          <section className="quiz-main">
            <QuestionCard
              question={currentQuestion}
              answer={answers[currentQuestion._id]}
              disabled={isSubmitting}
              onAnswerChange={(questionId, value) =>
                setAnswers((current) => ({ ...current, [questionId]: value }))
              }
            />

            <div className="quiz-actions">
              <button type="button" className="secondary-btn"
                disabled={currentIndex === 0 || isSubmitting}
                onClick={() => setCurrentIndex((index) => index - 1)}>
                Câu trước đó
              </button>
              {currentIndex < questions.length - 1 ? (
                <button type="button" className="primary-btn" disabled={isSubmitting}
                  onClick={() => setCurrentIndex((index) => index + 1)}>
                  Câu tiếp theo
                </button>
              ) : (
                <button type="button" className="exam-submit-btn" disabled={isSubmitting}
                  onClick={() => setShowSubmitModal(true)}>
                  Nộp bài
                </button>
              )}
            </div>
          </section>

          <aside className="quiz-sidebar">
            <QuestionNavigator questions={questions} currentIndex={currentIndex}
              answers={answers} disabled={isSubmitting} onJump={setCurrentIndex} />
            <section className="exam-note">
              <h3>Lưu ý</h3>
              <ul>
                <li>Hết giờ hệ thống sẽ tự động nộp bài.</li>
                <li>Câu trả lời ngắn sẽ được lưu để admin chấm sau.</li>
                <li>Bạn có thể chuyển giữa các câu trước khi nộp.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {showSubmitModal && (
        <SubmitConfirmModal totalQuestions={questions.length} answeredCount={answeredCount}
          loading={isSubmitting} onCancel={() => setShowSubmitModal(false)}
          onConfirm={() => handleSubmitQuiz("manual")} />
      )}
    </main>
  );
};

export default QuizPage;
