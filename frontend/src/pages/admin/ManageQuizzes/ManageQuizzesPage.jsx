import { useCallback, useEffect, useMemo, useState } from "react";
import questionService from "../../../services/questionService";
import quizService from "../../../services/quizService";
import getApiError from "../../../utils/getApiError";
import "./ManageQuizzesPage.scss";

const EMPTY_FORM = {
  title: "",
  description: "",
  duration: 30,
  tagsText: "",
  difficulty: "Mixed",
  status: "published",
  questions: [],
};

const EMPTY_QUIZ_FILTERS = {
  tag: "",
  difficulty: "",
  status: "",
  page: 1,
  limit: 10,
};

const EMPTY_QUESTION_FILTERS = {
  search: "",
  tag: "",
  difficulty: "",
  type: "",
};

const getQuestionId = (question) =>
  typeof question === "string" ? question : question?._id;

const getQuestionLabel = (question) =>
  question?.content || question?.title || "Câu hỏi không còn tồn tại";

const ManageQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(EMPTY_QUIZ_FILTERS);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [questionFilters, setQuestionFilters] = useState(EMPTY_QUESTION_FILTERS);

  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [loading, setLoading] = useState(true);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );
      const result = await quizService.getQuizzes(params);
      setQuizzes(result?.quizzes || []);
      setPagination(result?.pagination || null);
    } catch (requestError) {
      setError(getApiError(requestError, "Không thể tải danh sách đề thi."));
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchQuestions = useCallback(async () => {
    if (!showForm) return;

    try {
      setQuestionLoading(true);
      setQuestionError("");
      const params = Object.fromEntries(
        Object.entries(questionFilters).filter(([, value]) => value !== "")
      );
      const response = await questionService.getQuestionBank({
        ...params,
        page: 1,
        limit: 100,
      });
      setAvailableQuestions(response.data?.data?.questions || []);
    } catch (requestError) {
      setAvailableQuestions([]);
      setQuestionError(
        getApiError(requestError, "Không thể tải ngân hàng câu hỏi.")
      );
    } finally {
      setQuestionLoading(false);
    }
  }, [questionFilters, showForm]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  useEffect(() => {
    const timer = window.setTimeout(fetchQuestions, 250);
    return () => window.clearTimeout(timer);
  }, [fetchQuestions]);

  useEffect(() => {
    if (!success) return undefined;
    const timer = window.setTimeout(() => setSuccess(""), 3500);
    return () => window.clearTimeout(timer);
  }, [success]);

  const selectedIds = useMemo(
    () => new Set(formData.questions),
    [formData.questions]
  );

  const selectedQuestions = useMemo(() => {
    const questionMap = new Map();
    availableQuestions.forEach((question) => questionMap.set(question._id, question));
    editingQuiz?.questions?.forEach((question) => {
      if (typeof question !== "string") questionMap.set(question._id, question);
    });

    return formData.questions.map((id) => ({
      _id: id,
      ...(questionMap.get(id) || {}),
    }));
  }, [availableQuestions, editingQuiz, formData.questions]);

  const openCreateForm = () => {
    setEditingQuiz(null);
    setFormData({ ...EMPTY_FORM, questions: [] });
    setQuestionFilters(EMPTY_QUESTION_FILTERS);
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title || "",
      description: quiz.description || "",
      duration: quiz.duration || 30,
      tagsText: quiz.tags?.join(", ") || "",
      difficulty: quiz.difficulty || "Mixed",
      status: quiz.status || "published",
      questions: (quiz.questions || []).map(getQuestionId).filter(Boolean),
    });
    setQuestionFilters(EMPTY_QUESTION_FILTERS);
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingQuiz(null);
    setFormData({ ...EMPTY_FORM, questions: [] });
    setQuestionError("");
  };

  const changeForm = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const toggleQuestion = (questionId) => {
    setFormData((current) => ({
      ...current,
      questions: current.questions.includes(questionId)
        ? current.questions.filter((id) => id !== questionId)
        : [...current.questions, questionId],
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.questions.length) {
      setError("Vui lòng chọn ít nhất một câu hỏi cho đề thi.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      duration: formData.duration,
      tags: [...new Set(
        formData.tagsText.split(",").map((tag) => tag.trim()).filter(Boolean)
      )],
      difficulty: formData.difficulty,
      status: formData.status,
      questions: formData.questions,
    };

    try {
      setSaving(true);
      if (editingQuiz) {
        await quizService.updateQuiz(editingQuiz._id, payload);
        setSuccess("Cập nhật đề thi thành công.");
      } else {
        await quizService.createQuiz(payload);
        setSuccess("Tạo đề thi thành công.");
      }
      closeForm();
      await fetchQuizzes();
    } catch (requestError) {
      setError(getApiError(requestError, "Lưu đề thi thất bại."));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      setError("");
      await quizService.deleteQuiz(deleteTarget._id);
      setDeleteTarget(null);
      setSuccess("Xóa đề thi thành công.");

      if (quizzes.length === 1 && filters.page > 1) {
        setFilters((current) => ({ ...current, page: current.page - 1 }));
      } else {
        await fetchQuizzes();
      }
    } catch (requestError) {
      setError(getApiError(requestError, "Xóa đề thi thất bại."));
    } finally {
      setDeleting(false);
    }
  };

  const changeQuizFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  };

  const statusLabel = (status) => ({
    published: "Đang xuất bản",
    draft: "Bản nháp",
    archived: "Lưu trữ",
  }[status] || status);

  return (
    <div className="manage-quizzes-page">
      <header className="quiz-admin-heading">
        <div>
          <span className="heading-kicker">SPRINT 10</span>
          <h1>Quản lý đề thi</h1>
          <p>Tạo đề thủ công từ ngân hàng câu hỏi và quản lý các đề hiện có.</p>
        </div>
        <button type="button" className="primary-action" onClick={openCreateForm}>
          <span aria-hidden="true">＋</span> Tạo đề thi
        </button>
      </header>

      <section className="quiz-admin-stats" aria-label="Thống kê đề thi">
        <article><span>Tổng đề thi</span><strong>{pagination?.totalQuizzes ?? 0}</strong></article>
        <article><span>Trang hiện tại</span><strong>{pagination?.currentPage ?? 1}</strong></article>
        <article><span>Tổng số trang</span><strong>{pagination?.totalPages ?? 0}</strong></article>
      </section>

      {error && <div className="quiz-notice error" role="alert">{error}</div>}
      {success && <div className="quiz-notice success" role="status">{success}</div>}

      {showForm && (
        <section className="quiz-form-card">
          <div className="quiz-form-heading">
            <div>
              <span className="heading-kicker">{editingQuiz ? "CHỈNH SỬA" : "ĐỀ THI MỚI"}</span>
              <h2>{editingQuiz ? "Cập nhật đề thi" : "Tạo đề thi thủ công"}</h2>
              <p>Nhập thông tin và chọn các câu hỏi sẽ xuất hiện trong đề.</p>
            </div>
            <button type="button" className="close-form" onClick={closeForm}>Đóng</button>
          </div>

          <form onSubmit={submitForm}>
            <div className="quiz-form-grid">
              <label className="quiz-field full">
                <span>Tên đề thi *</span>
                <input name="title" value={formData.title} onChange={changeForm}
                  placeholder="Ví dụ: Mock Test ReactJS Junior" required />
              </label>
              <label className="quiz-field full">
                <span>Mô tả</span>
                <textarea name="description" value={formData.description}
                  onChange={changeForm} placeholder="Mô tả ngắn về nội dung đề thi..." />
              </label>
              <label className="quiz-field">
                <span>Thời gian (phút) *</span>
                <input type="number" name="duration" min="1" value={formData.duration}
                  onChange={changeForm} required />
              </label>
              <label className="quiz-field">
                <span>Độ khó</span>
                <select name="difficulty" value={formData.difficulty} onChange={changeForm}>
                  <option value="Mixed">Tổng hợp</option>
                  <option value="Easy">Dễ</option>
                  <option value="Medium">Trung bình</option>
                  <option value="Hard">Khó</option>
                </select>
              </label>
              <label className="quiz-field">
                <span>Trạng thái</span>
                <select name="status" value={formData.status} onChange={changeForm}>
                  <option value="published">Xuất bản</option>
                  <option value="draft">Bản nháp</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </label>
              <label className="quiz-field full">
                <span>Tags</span>
                <input name="tagsText" value={formData.tagsText} onChange={changeForm}
                  placeholder="ReactJS, JavaScript, Frontend" />
                <small>Phân tách nhiều tag bằng dấu phẩy.</small>
              </label>
            </div>

            <div className="question-picker-section">
              <div className="picker-heading">
                <div>
                  <h3>Chọn câu hỏi cho đề</h3>
                  <p>Đã chọn <strong>{formData.questions.length}</strong> câu hỏi</p>
                </div>
                {formData.questions.length > 0 && (
                  <button type="button" onClick={() => setFormData((current) => ({ ...current, questions: [] }))}>
                    Bỏ chọn tất cả
                  </button>
                )}
              </div>

              <div className="question-picker-filter">
                <input name="search" aria-label="Tìm câu hỏi" placeholder="Tìm theo nội dung..."
                  value={questionFilters.search}
                  onChange={(e) => setQuestionFilters((current) => ({ ...current, search: e.target.value }))} />
                <input name="tag" aria-label="Lọc tag câu hỏi" placeholder="Tag công nghệ..."
                  value={questionFilters.tag}
                  onChange={(e) => setQuestionFilters((current) => ({ ...current, tag: e.target.value }))} />
                <select aria-label="Lọc độ khó câu hỏi" value={questionFilters.difficulty}
                  onChange={(e) => setQuestionFilters((current) => ({ ...current, difficulty: e.target.value }))}>
                  <option value="">Mọi độ khó</option>
                  <option value="Easy">Dễ</option><option value="Medium">Trung bình</option><option value="Hard">Khó</option>
                </select>
                <select aria-label="Lọc loại câu hỏi" value={questionFilters.type}
                  onChange={(e) => setQuestionFilters((current) => ({ ...current, type: e.target.value }))}>
                  <option value="">Mọi loại câu hỏi</option>
                  <option value="multiple_choice">Trắc nghiệm</option>
                  <option value="short_answer">Trả lời ngắn</option>
                </select>
              </div>

              {questionError && <div className="picker-state error">{questionError}</div>}
              {questionLoading ? (
                <div className="picker-state">Đang tải câu hỏi...</div>
              ) : availableQuestions.length === 0 ? (
                <div className="picker-state">Không tìm thấy câu hỏi published phù hợp.</div>
              ) : (
                <div className="question-picker-list">
                  {availableQuestions.map((question) => (
                    <label className={`picker-question-item ${selectedIds.has(question._id) ? "selected" : ""}`}
                      key={question._id}>
                      <input type="checkbox" checked={selectedIds.has(question._id)}
                        onChange={() => toggleQuestion(question._id)} />
                      <div>
                        <strong>{getQuestionLabel(question)}</strong>
                        <div className="picker-question-meta">
                          <span>{question.type === "short_answer" ? "Trả lời ngắn" : "Trắc nghiệm"}</span>
                          <span>{question.difficulty}</span>
                          {question.tags?.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedQuestions.length > 0 && (
                <div className="selected-question-preview">
                  <h3>Câu hỏi trong đề ({selectedQuestions.length})</h3>
                  <div className="selected-question-list">
                    {selectedQuestions.map((question, index) => (
                      <div className="selected-question-item" key={question._id}>
                        <span>{index + 1}</span>
                        <p>{getQuestionLabel(question)}</p>
                        <button type="button" aria-label={`Bỏ câu hỏi ${index + 1}`}
                          onClick={() => toggleQuestion(question._id)}>Bỏ chọn</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="quiz-form-actions">
              <button type="button" className="secondary-action" onClick={closeForm}>Hủy</button>
              <button type="submit" className="save-action" disabled={saving}>
                {saving ? "Đang lưu..." : editingQuiz ? "Lưu thay đổi" : "Tạo đề thi"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="quiz-list-filter" aria-label="Bộ lọc đề thi">
        <label><span>Tag</span><input name="tag" value={filters.tag} onChange={changeQuizFilter} placeholder="Ví dụ: ReactJS" /></label>
        <label><span>Độ khó</span><select name="difficulty" value={filters.difficulty} onChange={changeQuizFilter}>
          <option value="">Tất cả</option><option value="Mixed">Tổng hợp</option><option value="Easy">Dễ</option><option value="Medium">Trung bình</option><option value="Hard">Khó</option>
        </select></label>
        <label><span>Trạng thái</span><select name="status" value={filters.status} onChange={changeQuizFilter}>
          <option value="">Tất cả</option><option value="published">Xuất bản</option><option value="draft">Bản nháp</option><option value="archived">Lưu trữ</option>
        </select></label>
        <button type="button" onClick={() => setFilters(EMPTY_QUIZ_FILTERS)}>Đặt lại</button>
      </section>

      {loading ? (
        <div className="quiz-admin-state">Đang tải danh sách đề thi...</div>
      ) : quizzes.length === 0 ? (
        <div className="quiz-admin-state empty">
          <span aria-hidden="true">⌁</span><h2>Chưa có đề thi phù hợp</h2>
          <p>Thử thay đổi bộ lọc hoặc tạo đề thi đầu tiên.</p>
          <button type="button" onClick={openCreateForm}>Tạo đề thi</button>
        </div>
      ) : (
        <div className="quiz-admin-table-card">
          <table className="quiz-admin-table">
            <thead><tr><th>Đề thi</th><th>Câu hỏi</th><th>Thời gian</th><th>Độ khó</th><th>Tags</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td><strong>{quiz.title}</strong><span>{quiz.description || "Không có mô tả"}</span></td>
                  <td><strong>{quiz.questionCount ?? quiz.questions?.length ?? 0}</strong><span>câu</span></td>
                  <td><strong>{quiz.duration}</strong><span>phút</span></td>
                  <td><span className={`difficulty-badge ${quiz.difficulty}`}>{quiz.difficulty}</span></td>
                  <td><div className="quiz-tag-list">{quiz.tags?.length ? quiz.tags.map((tag) => <span key={tag}>#{tag}</span>) : <em>—</em>}</div></td>
                  <td><span className={`quiz-status ${quiz.status}`}>{statusLabel(quiz.status)}</span></td>
                  <td><div className="quiz-table-actions">
                    <button type="button" className="edit" onClick={() => openEditForm(quiz)}>Sửa</button>
                    <button type="button" className="delete" onClick={() => setDeleteTarget(quiz)}>Xóa</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(pagination?.totalPages || 0) > 1 && (
        <nav className="quiz-pagination" aria-label="Phân trang đề thi">
          <button type="button" disabled={filters.page <= 1 || loading}
            onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>← Trước</button>
          <span>Trang {pagination.currentPage} / {pagination.totalPages}</span>
          <button type="button" disabled={filters.page >= pagination.totalPages || loading}
            onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>Sau →</button>
        </nav>
      )}

      {deleteTarget && (
        <div className="delete-quiz-backdrop" role="presentation" onMouseDown={(e) => {
          if (e.target === e.currentTarget && !deleting) setDeleteTarget(null);
        }}>
          <div className="delete-quiz-modal" role="dialog" aria-modal="true" aria-labelledby="delete-quiz-title">
            <div className="danger-icon" aria-hidden="true">!</div>
            <h3 id="delete-quiz-title">Xóa đề thi?</h3>
            <p>Đề <strong>“{deleteTarget.title}”</strong> sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.</p>
            <div className="delete-quiz-actions">
              <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button type="button" className="confirm" disabled={deleting} onClick={confirmDelete}>{deleting ? "Đang xóa..." : "Xóa đề thi"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuizzesPage;
