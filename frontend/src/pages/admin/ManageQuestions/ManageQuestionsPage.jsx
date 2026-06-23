import { useCallback, useEffect, useState } from "react";
import QuestionFilter from "../../../components/admin/QuestionFilter/QuestionFilter";
import QuestionForm from "../../../components/admin/QuestionForm/QuestionForm";
import QuestionTable from "../../../components/admin/QuestionTable/QuestionTable";
import questionService from "../../../services/questionService";
import getApiError from "../../../utils/getApiError";
import "./ManageQuestionsPage.scss";

const INITIAL_FILTERS = {
  tag: "",
  difficulty: "",
  type: "",
  status: "",
  page: 1,
  limit: 10,
};

const ManageQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchQuestions = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );
      const result = await questionService.getQuestions(params, { signal });
      setQuestions(result.questions || []);
      setPagination(result.pagination || null);
    } catch (requestError) {
      if (requestError.code !== "ERR_CANCELED") {
        setError(getApiError(requestError, "Không thể tải danh sách câu hỏi"));
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    fetchQuestions(controller.signal);
    return () => controller.abort();
  }, [fetchQuestions]);

  useEffect(() => {
    if (!deleteTarget) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !deleteLoading) setDeleteTarget(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [deleteLoading, deleteTarget]);

  const openForm = (question = null) => {
    setEditingQuestion(question);
    setShowForm(true);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  const submitForm = async (payload) => {
    setFormLoading(true);
    setError("");

    try {
      if (editingQuestion) {
        await questionService.updateQuestion(editingQuestion._id, payload);
        setNotice("Cập nhật câu hỏi thành công.");
      } else {
        await questionService.createQuestion(payload);
        setNotice("Thêm câu hỏi thành công.");
      }
      closeForm();
      await fetchQuestions();
    } catch (requestError) {
      setError(getApiError(requestError, "Lưu câu hỏi thất bại"));
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setError("");

    try {
      await questionService.deleteQuestion(deleteTarget._id);
      setDeleteTarget(null);
      setNotice("Xóa câu hỏi thành công.");

      if (questions.length === 1 && filters.page > 1) {
        setFilters((current) => ({ ...current, page: current.page - 1 }));
      } else {
        await fetchQuestions();
      }
    } catch (requestError) {
      setError(getApiError(requestError, "Xóa câu hỏi thất bại"));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="manage-questions-page">
      <div className="page-title-row">
        <div>
          <h1>Ngân hàng câu hỏi</h1>
          <p>Quản lý câu hỏi phỏng vấn IT theo công nghệ, loại và độ khó.</p>
        </div>
        <button type="button" className="add-question-btn" onClick={() => openForm()}>+ Thêm câu hỏi</button>
      </div>

      <div className="stats-row">
        <div className="stats-card"><span>Tổng câu hỏi</span><strong>{pagination?.totalQuestions ?? 0}</strong></div>
        <div className="stats-card"><span>Trang hiện tại</span><strong>{pagination?.currentPage ?? 1}</strong></div>
        <div className="stats-card"><span>Số trang</span><strong>{pagination?.totalPages ?? 0}</strong></div>
      </div>

      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      {notice && <div className="admin-alert admin-alert--success" role="status">{notice}</div>}

      {showForm && (
        <QuestionForm editingQuestion={editingQuestion} loading={formLoading} onSubmit={submitForm} onCancel={closeForm} />
      )}

      <QuestionFilter filters={filters} onChange={setFilters} onReset={() => setFilters(INITIAL_FILTERS)} />

      {loading ? (
        <div className="admin-loading">Đang tải dữ liệu...</div>
      ) : (
        <QuestionTable questions={questions} onEdit={openForm} onDelete={setDeleteTarget} />
      )}

      {pagination?.totalPages > 1 && (
        <nav className="pagination-bar" aria-label="Phân trang câu hỏi">
          <button type="button" disabled={filters.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>Trang trước</button>
          <span>Trang {pagination.currentPage}/{pagination.totalPages}</span>
          <button type="button" disabled={filters.page >= pagination.totalPages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>Trang sau</button>
        </nav>
      )}

      {deleteTarget && (
        <div className="delete-modal-backdrop" role="presentation" onMouseDown={() => !deleteLoading && setDeleteTarget(null)}>
          <section className="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={(event) => event.stopPropagation()}>
            <h3 id="delete-title">Xác nhận xóa câu hỏi</h3>
            <p>Bạn có chắc muốn xóa câu hỏi:<br /><strong>{deleteTarget.content}</strong></p>
            <div className="delete-modal-actions">
              <button type="button" className="cancel-delete-btn" disabled={deleteLoading} onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button type="button" className="confirm-delete-btn" disabled={deleteLoading} onClick={confirmDelete}>{deleteLoading ? "Đang xóa..." : "Xóa câu hỏi"}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ManageQuestionsPage;
