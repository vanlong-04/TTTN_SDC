import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import submissionService from "../../services/submissionService";
import getApiError from "../../utils/getApiError";
import "./CandidateDashboard.scss";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setSubmissions((await submissionService.getHistory()) || []);
      } catch (requestError) {
        setError(getApiError(requestError, "Không thể tải dữ liệu dashboard"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="dashboard-loading"><div className="spinner" /><p>Đang tải dashboard...</p></div>;

  const percentages = submissions.map((item) => item.maxScore > 0 ? (item.totalScore / item.maxScore) * 100 : 0);
  const average = percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) : 0;
  const pending = submissions.filter((item) => item.status === "pending_review").length;
  const recent = submissions.slice(0, 4);

  return (
    <main className="candidate-dashboard">
      <section className="candidate-hero">
        <div>
          <span>Candidate Dashboard</span>
          <h1>Xin chào, {user?.username || "Thành viên"}</h1>
          <p>Theo dõi hành trình luyện phỏng vấn, làm mock test và cải thiện kỹ năng qua từng kết quả.</p>
        </div>
        <Link to="/quizzes">Chọn đề thi</Link>
      </section>

      {error && <div className="dashboard-error" role="alert">{error}</div>}

      <section className="candidate-stats" aria-label="Thống kê cá nhân">
        <article className="candidate-stat-card"><span>Bài thi đã làm</span><strong>{submissions.length}</strong></article>
        <article className="candidate-stat-card"><span>Tỷ lệ đúng trung bình</span><strong>{average}%</strong></article>
        <article className="candidate-stat-card"><span>Đang chờ chấm</span><strong>{pending}</strong></article>
      </section>

      <section className="candidate-content-grid">
        <article className="quick-actions-card">
          <h2>Bắt đầu luyện tập</h2>
          <div className="quick-actions">
            <Link to="/quizzes">Chọn đề thi có sẵn</Link>
            <Link to="/quiz/setup">Tạo đề ngẫu nhiên</Link>
            <Link to="/questions">Ôn ngân hàng câu hỏi</Link>
            <Link to="/history">Xem toàn bộ lịch sử</Link>
          </div>
        </article>

        <article className="recent-history-card">
          <div className="recent-heading"><h2>Bài làm gần đây</h2><Link to="/history">Xem tất cả →</Link></div>
          {recent.length === 0 ? <p className="muted-text">Bạn chưa thực hiện bài thi nào.</p> : (
            <div className="recent-dashboard-list">
              {recent.map((submission) => {
                const score = submission.maxScore > 0 ? Math.round((submission.totalScore / submission.maxScore) * 100) : 0;
                return (
                  <Link to={`/history/${submission._id}`} className="recent-dashboard-item" key={submission._id}>
                    <div><strong>{submission.quiz?.title || "Đề thi ngẫu nhiên"}</strong><span>{new Date(submission.submittedAt).toLocaleDateString("vi-VN")}</span></div>
                    <em>{score}% đúng</em>
                  </Link>
                );
              })}
            </div>
          )}
        </article>
      </section>
    </main>
  );
};

export default CandidateDashboard;
