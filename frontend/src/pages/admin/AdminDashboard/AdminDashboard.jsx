import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../../services/adminService";
import "./AdminDashboard.scss";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "-";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboard = async () => {
      try {
        setDashboard(await adminService.getDashboard({ signal: controller.signal }));
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          setError(requestError.response?.data?.message || "Không thể tải dashboard admin");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <div className="admin-dashboard-state">Đang tải dashboard...</div>;
  }

  if (error) {
    return <div className="admin-dashboard-state admin-dashboard-state--error">{error}</div>;
  }

  const overview = dashboard?.overview || {};
  const scoreStats = dashboard?.scoreStats || {};
  const recentSubmissions = dashboard?.recentSubmissions || [];
  const cards = [
    { label: "Người dùng", value: overview.totalUsers || 0, type: "users" },
    { label: "Câu hỏi", value: overview.totalQuestions || 0, type: "questions" },
    { label: "Đề thi", value: overview.totalQuizzes || 0, type: "quizzes" },
    { label: "Bài nộp", value: overview.totalSubmissions || 0, type: "submissions" },
    { label: "Chờ chấm tự luận", value: overview.pendingReviewSubmissions || 0, type: "pending" },
    { label: "Đã chấm xong", value: overview.reviewedSubmissions || 0, type: "reviewed" },
  ];

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Tổng quan hệ thống luyện phỏng vấn việc làm IT.</p>
        </div>
        <button type="button" onClick={() => navigate("/admin/submissions")}>
          Xem bài nộp
        </button>
      </div>

      <div className="dashboard-card-grid">
        {cards.map((card) => (
          <article className={`dashboard-stat-card ${card.type}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-section-grid">
        <section className="score-stat-panel">
          <h2>Thống kê điểm</h2>
          <div className="score-stat-list">
            <div><span>Điểm trung bình</span><strong>{Number(scoreStats.averageScore || 0).toFixed(2)}</strong></div>
            <div><span>Điểm cao nhất</span><strong>{scoreStats.highestScore || 0}</strong></div>
            <div><span>Điểm thấp nhất</span><strong>{scoreStats.lowestScore || 0}</strong></div>
          </div>
        </section>

        <section className="recent-submission-panel">
          <div className="panel-heading">
            <h2>Bài nộp gần đây</h2>
            <button type="button" onClick={() => navigate("/admin/submissions")}>Xem tất cả</button>
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="empty-recent">Chưa có bài nộp nào.</p>
          ) : (
            <div className="recent-list">
              {recentSubmissions.map((submission) => (
                <button
                  type="button"
                  className="recent-item"
                  key={submission._id}
                  onClick={() => navigate(`/admin/submissions/${submission._id}`)}
                >
                  <span>
                    <strong>{submission.user?.username || submission.user?.email || "Người dùng"}</strong>
                    <em>{submission.quiz?.title || "Đề thi đã bị xóa"}</em>
                  </span>
                  <span className="recent-right">
                    <strong>{submission.totalScore}/{submission.maxScore || 0}</strong>
                    <em>{formatDate(submission.submittedAt || submission.createdAt)}</em>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
