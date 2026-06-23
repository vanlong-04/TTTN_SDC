import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { submissionService } from "../../services/submissionService";
import "./HistoryPage.scss";

const HistoryPage = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await submissionService.getHistory();

      setSubmissions(data || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Không thể tải lịch sử làm bài"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getPercent = (submission) => {
    if (!submission.maxScore || submission.maxScore === 0) return 0;

    return Math.round((submission.totalScore / submission.maxScore) * 100);
  };

  const getStatusLabel = (status) => {
    if (status === "auto_graded") return "Đã chấm tự động";
    if (status === "pending_review") return "Chờ chấm tự luận";
    if (status === "reviewed") return "Đã chấm xong";
    return status;
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-container">
          <div className="history-loading">Đang tải lịch sử làm bài...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div>
            <span className="history-badge">Submission History</span>
            <h1>Lịch sử làm bài</h1>
            <p>
              Theo dõi các bài mock test bạn đã hoàn thành và xem lại kết quả.
            </p>
          </div>

          <button onClick={() => navigate("/quiz/setup")}>
            Làm bài mới
          </button>
        </div>

        {error && <div className="history-error">{error}</div>}

        {submissions.length === 0 ? (
          <div className="empty-history">
            <h2>Chưa có bài làm nào</h2>
            <p>Bạn hãy bắt đầu một bài mock test để xem kết quả tại đây.</p>
            <button onClick={() => navigate("/quiz/setup")}>
              Bắt đầu làm bài
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {submissions.map((submission) => {
              const percent = getPercent(submission);

              return (
                <div className="history-card" key={submission._id}>
                  <div className="history-card-top">
                    <div>
                      <h3>{submission.quiz?.title || "Không rõ đề thi"}</h3>
                      <p>{formatDate(submission.submittedAt)}</p>
                    </div>

                    <span className={`status ${submission.status}`}>
                      {getStatusLabel(submission.status)}
                    </span>
                  </div>

                  <div className="score-row">
                    <div className="score-box">
                      <strong>{percent}%</strong>
                      <span>Tỷ lệ đúng</span>
                    </div>

                    <div className="score-box">
                      <strong>
                        {submission.totalScore}/{submission.maxScore}
                      </strong>
                      <span>Điểm</span>
                    </div>

                    <div className="score-box">
                      <strong>{submission.quiz?.duration || "-"} phút</strong>
                      <span>Thời gian</span>
                    </div>
                  </div>

                  <div className="history-tags">
                    {submission.quiz?.tags?.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <button
                    className="detail-btn"
                    onClick={() => navigate(`/history/${submission._id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
