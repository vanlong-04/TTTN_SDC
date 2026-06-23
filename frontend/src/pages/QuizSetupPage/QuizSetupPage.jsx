import { useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "../../services/quizService";
import "./QuizSetupPage.scss";

const TECHNOLOGIES = [
  { label: "JavaScript", value: "JavaScript", description: "Biến, hàm, scope, async/await và promise" },
  { label: "ReactJS", value: "ReactJS", description: "Component, hooks, props, state và lifecycle" },
  { label: "NodeJS", value: "NodeJS", description: "Express, middleware, API, MongoDB và JWT" },
  { label: "OOP", value: "OOP", description: "Class, object, kế thừa, đa hình và đóng gói" },
];

const QuizSetupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tag: "ReactJS",
    difficulty: "Mixed",
    questionCount: 10,
    duration: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: ["questionCount", "duration"].includes(name) ? Number(value) : value,
    }));
  };

  const handleStartQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await quizService.generateQuiz({
        ...formData,
        title: `Mock Test ${formData.tag}`,
      });
      navigate(`/quiz/${result.quiz._id}`, { state: result });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Không thể tạo đề thi. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="quiz-setup-page">
      <div className="quiz-setup-container">
        <section className="setup-hero">
          <div>
            <span className="setup-badge">Mock Test IT Interview</span>
            <h1>Chọn đề thi thử phù hợp với bạn</h1>
            <p>Luyện phỏng vấn theo từng công nghệ, làm bài có thời gian và nhận kết quả ngay sau khi nộp.</p>
          </div>
          <aside className="setup-summary-card">
            <h2>Cấu hình đề thi</h2>
            <div className="summary-item"><span>Công nghệ</span><strong>{formData.tag}</strong></div>
            <div className="summary-item"><span>Độ khó</span><strong>{formData.difficulty}</strong></div>
            <div className="summary-item"><span>Số câu</span><strong>{formData.questionCount}</strong></div>
            <div className="summary-item"><span>Thời gian</span><strong>{formData.duration} phút</strong></div>
          </aside>
        </section>

        {error && <div className="setup-error" role="alert">{error}</div>}

        <section className="setup-section">
          <div className="section-heading">
            <h2>1. Chọn công nghệ</h2>
            <p>Hệ thống sẽ tạo đề ngẫu nhiên dựa trên tag bạn chọn.</p>
          </div>
          <div className="technology-grid">
            {TECHNOLOGIES.map((technology) => (
              <button
                type="button"
                key={technology.value}
                className={`technology-card${formData.tag === technology.value ? " active" : ""}`}
                onClick={() => setFormData((current) => ({ ...current, tag: technology.value }))}
                aria-pressed={formData.tag === technology.value}
              >
                <h3>{technology.label}</h3>
                <p>{technology.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="setup-section">
          <div className="section-heading">
            <h2>2. Cấu hình bài thi</h2>
            <p>Chọn độ khó, số câu hỏi và thời gian làm bài.</p>
          </div>
          <div className="setup-form-grid">
            <label className="setup-field">
              <span>Độ khó</span>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="Mixed">Mixed</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
            <label className="setup-field">
              <span>Số câu hỏi</span>
              <select name="questionCount" value={formData.questionCount} onChange={handleChange}>
                <option value={5}>5 câu</option>
                <option value={10}>10 câu</option>
                <option value={15}>15 câu</option>
              </select>
            </label>
            <label className="setup-field">
              <span>Thời gian làm bài</span>
              <select name="duration" value={formData.duration} onChange={handleChange}>
                <option value={10}>10 phút</option>
                <option value={15}>15 phút</option>
                <option value={30}>30 phút</option>
                <option value={45}>45 phút</option>
              </select>
            </label>
          </div>
        </section>

        <div className="setup-actions">
          <button type="button" onClick={handleStartQuiz} disabled={loading}>
            {loading ? "Đang tạo đề..." : "Bắt đầu làm bài"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default QuizSetupPage;
