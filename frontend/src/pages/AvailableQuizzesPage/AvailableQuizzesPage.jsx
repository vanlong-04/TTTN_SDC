import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "../../services/quizService";
import "./AvailableQuizzesPage.scss";

const INITIAL_FILTERS = { tag: "", difficulty: "", page: 1, limit: 9 };
const TAGS = ["JavaScript", "ReactJS", "NodeJS", "MongoDB", "ExpressJS", "OOP"];

const difficultyLabel = {
  Mixed: "Tổng hợp",
  Easy: "Dễ",
  Medium: "Trung bình",
  Hard: "Khó",
};

const AvailableQuizzesPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );
      const result = await quizService.getPublishedQuizzes(params);
      setQuizzes(result?.quizzes || []);
      setPagination(result?.pagination || null);
    } catch (requestError) {
      setQuizzes([]);
      setError(
        requestError.response?.data?.message ||
          "Không thể tải danh sách đề thi. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const changeFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  };

  return (
    <main className="available-quizzes-page">
      <div className="available-quizzes-container">
        <section className="available-hero">
          <div className="available-hero-copy">
            <span className="available-badge">THƯ VIỆN MOCK TEST</span>
            <h1>Chọn đề thi phù hợp với bạn</h1>
            <p>
              Luyện phỏng vấn IT với các đề đã được biên soạn theo công nghệ,
              độ khó và thời gian làm bài.
            </p>
          </div>
          <aside className="available-summary-card">
            <span>Đề thi đang mở</span>
            <strong>{pagination?.totalQuizzes ?? 0}</strong>
            <p>Chỉ hiển thị các đề đã được xuất bản.</p>
          </aside>
        </section>

        <section className="available-filter-card" aria-label="Bộ lọc đề thi">
          <label>
            <span>Tag công nghệ</span>
            <select name="tag" value={filters.tag} onChange={changeFilter}>
              <option value="">Tất cả công nghệ</option>
              {TAGS.map((tag) => <option value={tag} key={tag}>{tag}</option>)}
            </select>
          </label>
          <label>
            <span>Độ khó</span>
            <select name="difficulty" value={filters.difficulty} onChange={changeFilter}>
              <option value="">Tất cả độ khó</option>
              <option value="Mixed">Tổng hợp</option>
              <option value="Easy">Dễ</option>
              <option value="Medium">Trung bình</option>
              <option value="Hard">Khó</option>
            </select>
          </label>
          <button type="button" onClick={() => setFilters(INITIAL_FILTERS)}>
            Xóa bộ lọc
          </button>
        </section>

        {error && <div className="available-error" role="alert">{error}</div>}

        {loading ? (
          <div className="available-state">
            <div className="available-spinner" aria-hidden="true" />
            <p>Đang tải danh sách đề thi...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="available-state empty">
            <span aria-hidden="true">⌁</span>
            <h2>Chưa có đề thi phù hợp</h2>
            <p>Hãy đổi bộ lọc hoặc tạo một đề ngẫu nhiên để bắt đầu.</p>
            <button type="button" onClick={() => navigate("/quiz/setup")}>Tạo đề ngẫu nhiên</button>
          </div>
        ) : (
          <section className="available-quiz-grid" aria-label="Danh sách đề thi">
            {quizzes.map((quiz) => (
              <article className="available-quiz-card" key={quiz._id}>
                <div className="quiz-card-topline">
                  <span className={`available-difficulty ${quiz.difficulty}`}>
                    {difficultyLabel[quiz.difficulty] || quiz.difficulty}
                  </span>
                  <span className="published-dot">Đã xuất bản</span>
                </div>
                <h2>{quiz.title}</h2>
                <p className="available-description">
                  {quiz.description || "Đề thi luyện tập kiến thức phỏng vấn IT."}
                </p>
                <div className="available-meta">
                  <span><strong>{quiz.questionCount || 0}</strong> câu hỏi</span>
                  <span><strong>{quiz.duration}</strong> phút</span>
                </div>
                <div className="available-tags">
                  {quiz.tags?.length
                    ? quiz.tags.map((tag) => <span key={tag}>#{tag}</span>)
                    : <span>#General</span>}
                </div>
                <button type="button" className="start-quiz-button"
                  onClick={() => navigate(`/quiz/${quiz._id}`)}>
                  Bắt đầu làm bài <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </section>
        )}

        {(pagination?.totalPages || 0) > 1 && (
          <nav className="available-pagination" aria-label="Phân trang đề thi">
            <button type="button" disabled={filters.page <= 1 || loading}
              onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>
              ← Trang trước
            </button>
            <span>Trang {pagination.currentPage} / {pagination.totalPages}</span>
            <button type="button" disabled={filters.page >= pagination.totalPages || loading}
              onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>
              Trang sau →
            </button>
          </nav>
        )}
      </div>
    </main>
  );
};

export default AvailableQuizzesPage;
