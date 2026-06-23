import { useLocation, useNavigate } from "react-router-dom";
import "./ResultPage.scss";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const quiz = location.state?.quiz;
  const submitType = location.state?.submitType;

  if (!result) {
    return (
      <main className="result-page">
        <section className="result-card">
          <h1>Không có dữ liệu kết quả</h1>
          <button type="button" onClick={() => navigate("/quiz/setup")}>Làm bài thi mới</button>
        </section>
      </main>
    );
  }

  const percent = result.maxScore > 0
    ? Math.round((result.totalScore / result.maxScore) * 100)
    : 0;

  return (
    <main className="result-page">
      <section className="result-card">
        <span className="result-badge">
          {submitType === "timeout" ? "Tự động nộp bài" : "Nộp bài thành công"}
        </span>
        <h1>Kết quả bài thi</h1>
        <p className="result-quiz-title">{quiz?.title}</p>

        <div className="score-circle">
          <strong>{percent}%</strong>
          <span>{result.totalScore}/{result.maxScore} điểm</span>
        </div>

        <div className="result-info-grid">
          <div><span>Tổng câu hỏi</span><strong>{result.totalQuestions}</strong></div>
          <div><span>Điểm trắc nghiệm</span><strong>{result.totalScore}/{result.maxScore}</strong></div>
          <div><span>Mã bài nộp</span><strong>{result.submission_id}</strong></div>
        </div>

        {submitType === "timeout" && (
          <div className="timeout-message">Hết thời gian, hệ thống đã tự động nộp bài cho bạn.</div>
        )}

        <div className="result-actions">
          <button type="button" onClick={() => navigate("/quiz/setup")}>Làm bài khác</button>
          <button type="button" className="secondary" onClick={() => navigate("/history")}>Xem lịch sử</button>
          <button type="button" className="secondary" onClick={() => navigate("/")}>Về trang chủ</button>
        </div>
      </section>
    </main>
  );
};

export default ResultPage;
