import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import adminService from "../../../services/adminService";
import "./ReviewSubmissionsPage.scss";

const ReviewSubmissionsPage = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [status, setStatus] = useState("pending_review");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await adminService.getSubmissions({
        status,
        page,
        limit: 10,
      });

      setSubmissions(result.submissions || []);
      setPagination(result.pagination || null);
    } catch (error) {
      setError(error.response?.data?.message || "Không thể tải bài nộp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [status, page]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusLabel = (value) => {
    if (value === "auto_graded") return "Đã chấm tự động";
    if (value === "pending_review") return "Chờ chấm tự luận";
    if (value === "reviewed") return "Đã chấm xong";
    return value;
  };

  return (
    <div className="review-submissions-page">
      <div className="review-heading">
        <div>
          <h1>Chấm bài tự luận</h1>
          <p>Quản lý và đánh giá các bài làm có câu hỏi tự luận.</p>
        </div>
      </div>

      <div className="review-filter-card">
        <label>Trạng thái bài nộp</label>

        <select value={status} onChange={handleStatusChange}>
          <option value="pending_review">Chờ chấm tự luận</option>
          <option value="reviewed">Đã chấm xong</option>
          <option value="auto_graded">Đã chấm tự động</option>
          <option value="">Tất cả</option>
        </select>
      </div>

      {error && <div className="review-error">{error}</div>}

      {loading ? (
        <div className="review-loading">Đang tải bài nộp...</div>
      ) : submissions.length === 0 ? (
        <div className="review-empty">
          <h2>Không có bài nộp phù hợp</h2>
          <p>Hiện chưa có bài nào trong trạng thái này.</p>
        </div>
      ) : (
        <div className="submission-admin-table-card">
          <table className="submission-admin-table">
            <thead>
              <tr>
                <th>Ứng viên</th>
                <th>Đề thi</th>
                <th>Điểm</th>
                <th>Trạng thái</th>
                <th>Ngày nộp</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>
                    <strong>{submission.user?.username}</strong>
                    <span>{submission.user?.email}</span>
                  </td>

                  <td>
                    <strong>{submission.quiz?.title}</strong>
                    <span>{submission.quiz?.tags?.join(", ")}</span>
                  </td>

                  <td>
                    <strong>
                      {submission.totalScore}/{submission.maxScore}
                    </strong>
                  </td>

                  <td>
                    <span className={`status-badge ${submission.status}`}>
                      {getStatusLabel(submission.status)}
                    </span>
                  </td>

                  <td>{formatDate(submission.submittedAt)}</td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(`/admin/submissions/${submission._id}`)
                      }
                    >
                      Xem & chấm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination && (
            <nav className="admin-pagination" aria-label="Phân trang bài nộp">
              <button
                type="button"
                className="pagination-button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                ← Trước
              </button>

              <span>
                Trang {pagination.currentPage} / {pagination.totalPages || 1}
                {" · "}Tổng {pagination.totalSubmissions} bài
              </span>

              <button
                type="button"
                className="pagination-button"
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Sau →
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissionsPage;
