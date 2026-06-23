import React, { useEffect, useState } from "react";

import { questionService } from "../../services/questionService";
import "./QuestionBankPage.scss";

const QuestionBankPage = () => {
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    tag: "",
    difficulty: "",
    type: "",
    page: 1,
    limit: 9,
  });

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tagOptions = [
    "JavaScript",
    "ReactJS",
    "NodeJS",
    "MongoDB",
    "ExpressJS",
    "OOP",
  ];

  const fetchQuestionBank = async () => {
    try {
      setLoading(true);
      setError("");

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      const response = await questionService.getQuestionBank(cleanFilters);

      const result = response.data.data;

      setQuestions(result.questions || []);
      setPagination(result.pagination || null);
    } catch (error) {
      setError(
        error.response?.data?.message || "Không thể tải ngân hàng câu hỏi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionBank();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      tag: "",
      difficulty: "",
      type: "",
      page: 1,
      limit: 9,
    });
  };

  const handleOpenDetail = (question) => {
    setSelectedQuestion(question);
    setShowAnswer(false);
  };

  const handleCloseDetail = () => {
    setSelectedQuestion(null);
    setShowAnswer(false);
  };

  const getTypeLabel = (type) => {
    if (type === "multiple_choice") return "Trắc nghiệm";
    if (type === "short_answer") return "Tự luận";
    return type;
  };

  return (
    <div className="question-bank-page">
      <div className="question-bank-container">
        <section className="question-bank-hero">
          <div>
            <span className="bank-badge">Question Bank</span>
            <h1>Ngân hàng câu hỏi phỏng vấn IT</h1>
            <p>
              Ôn tập các câu hỏi thường gặp về JavaScript, ReactJS, NodeJS,
              MongoDB, ExpressJS và tư duy lập trình.
            </p>
          </div>

          <div className="bank-summary-card">
            <span>Tổng câu hỏi phù hợp</span>
            <strong>{pagination?.totalQuestions || 0}</strong>
            <p>Lọc và tìm kiếm theo công nghệ, độ khó, loại câu hỏi.</p>
          </div>
        </section>

        <section className="bank-filter-card">
          <div className="filter-field search-field">
            <label>Tìm kiếm câu hỏi</label>
            <input
              type="text"
              name="search"
              placeholder="Nhập từ khóa: hook, promise, middleware..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-field">
            <label>Tag</label>
            <select name="tag" value={filters.tag} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label>Độ khó</label>
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="filter-field">
            <label>Loại</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              <option value="multiple_choice">Trắc nghiệm</option>
              <option value="short_answer">Tự luận</option>
            </select>
          </div>

          <button className="reset-bank-filter" onClick={handleResetFilters}>
            Xóa lọc
          </button>
        </section>

        {error && <div className="bank-error">{error}</div>}

        {loading ? (
          <div className="bank-loading">Đang tải ngân hàng câu hỏi...</div>
        ) : questions.length === 0 ? (
          <div className="bank-empty">
            <h2>Không tìm thấy câu hỏi phù hợp</h2>
            <p>Hãy thử đổi từ khóa hoặc bộ lọc khác.</p>
            <button onClick={handleResetFilters}>Xóa bộ lọc</button>
          </div>
        ) : (
          <section className="question-bank-grid">
            {questions.map((question) => (
              <article className="bank-question-card" key={question._id}>
                <div className="question-card-top">
                  <span className={`type-chip ${question.type}`}>
                    {getTypeLabel(question.type)}
                  </span>

                  <span className={`difficulty-chip ${question.difficulty}`}>
                    {question.difficulty}
                  </span>
                </div>

                <h3>{question.content}</h3>

                <div className="question-tags">
                  {question.tags?.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="question-preview-info">
                  {question.type === "multiple_choice" ? (
                    <span>{question.options?.length || 0} lựa chọn</span>
                  ) : (
                    <span>Câu trả lời tự luận ngắn</span>
                  )}
                </div>

                <button onClick={() => handleOpenDetail(question)}>
                  Xem chi tiết
                </button>
              </article>
            ))}
          </section>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="bank-pagination">
            <button
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }))
              }
            >
              Trang trước
            </button>

            <span>
              Trang {pagination.currentPage}/{pagination.totalPages}
            </span>

            <button
              disabled={filters.page >= pagination.totalPages}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
            >
              Trang sau
            </button>
          </div>
        )}
      </div>

      {selectedQuestion && (
        <div className="question-detail-backdrop" onClick={handleCloseDetail}>
          <div className="question-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-detail-btn" onClick={handleCloseDetail}>
              ×
            </button>

            <div className="detail-tags-row">
              <span className={`type-chip ${selectedQuestion.type}`}>
                {getTypeLabel(selectedQuestion.type)}
              </span>

              <span className={`difficulty-chip ${selectedQuestion.difficulty}`}>
                {selectedQuestion.difficulty}
              </span>

              {selectedQuestion.tags?.map((tag) => (
                <span className="detail-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            <h2>{selectedQuestion.content}</h2>

            {selectedQuestion.type === "multiple_choice" && (
              <div className="detail-options">
                {selectedQuestion.options?.map((option, index) => (
                  <div className="detail-option" key={index}>
                    {option}
                  </div>
                ))}
              </div>
            )}

            {selectedQuestion.type === "short_answer" && (
              <div className="essay-note">
                Đây là câu hỏi tự luận. Hãy tự trả lời trước khi xem đáp án mẫu.
              </div>
            )}

            {!showAnswer ? (
              <button
                className="show-answer-btn"
                onClick={() => setShowAnswer(true)}
              >
                Hiện đáp án
              </button>
            ) : (
              <div className="answer-box">
                <h3>Đáp án / Gợi ý trả lời</h3>
                <p>{selectedQuestion.correctAnswer}</p>

                {selectedQuestion.explanation && (
                  <>
                    <h3>Giải thích</h3>
                    <p>{selectedQuestion.explanation}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage;
