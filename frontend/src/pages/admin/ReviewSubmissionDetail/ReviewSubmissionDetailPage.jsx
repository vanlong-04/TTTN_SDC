import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import adminService from "../../../services/adminService";
import "./ReviewSubmissionDetailPage.scss";

const ReviewSubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminService.getSubmissionById(id);

      setSubmission(data);

      const initialReviews = {};

      data.answers.forEach((answer) => {
        if (answer.question?.type === "short_answer") {
          initialReviews[answer.question._id] = {
            manualScore: answer.manualScore || answer.score || 0,
            reviewerComment: answer.reviewerComment || "",
          };
        }
      });

      setReviews(initialReviews);
    } catch (error) {
      setError(
        error.response?.data?.message || "Không thể tải chi tiết bài nộp"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const handleReviewChange = (questionId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const handleSaveReview = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        reviews: Object.entries(reviews).map(([questionId, review]) => ({
          question_id: questionId,
          manualScore: Number(review.manualScore),
          reviewerComment: review.reviewerComment,
        })),
      };

      await adminService.reviewSubmission(id, payload);

      alert("Chấm bài tự luận thành công");
      navigate("/admin/submissions");
    } catch (error) {
      setError(error.response?.data?.message || "Lưu chấm điểm thất bại");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (loading) {
    return <div className="review-detail-loading">Đang tải bài nộp...</div>;
  }

  if (error && !submission) {
    return (
      <div className="review-detail-error">
        <h2>Không thể tải bài nộp</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/admin/submissions")}>
          Quay lại
        </button>
      </div>
    );
  }

  const shortAnswerCount = submission.answers.filter(
    (answer) => answer.question?.type === "short_answer"
  ).length;

  return (
    <div className="review-detail-page">
      <button
        className="review-back-btn"
        onClick={() => navigate("/admin/submissions")}
      >
        ← Quay lại danh sách
      </button>

      <div className="review-detail-header">
        <div>
          <span className="review-detail-badge">Manual Review</span>
          <h1>{submission.quiz?.title}</h1>
          <p>
            Ứng viên: <strong>{submission.user?.username}</strong> · Nộp lúc:{" "}
            {formatDate(submission.submittedAt)}
          </p>
        </div>

        <div className="review-score-box">
          <span>Điểm hiện tại</span>
          <strong>
            {submission.totalScore}/{submission.maxScore}
          </strong>
        </div>
      </div>

      {error && <div className="review-detail-alert">{error}</div>}

      {shortAnswerCount === 0 && (
        <div className="no-essay-alert">
          Bài này không có câu tự luận, không cần chấm thủ công.
        </div>
      )}

      <div className="review-answer-list">
        {submission.answers.map((answer, index) => {
          const question = answer.question;
          const isShortAnswer = question?.type === "short_answer";

          return (
            <div className="review-answer-card" key={question?._id || index}>
              <div className="review-answer-header">
                <div>
                  <span className="question-index">Câu {index + 1}</span>
                  <span className={`question-kind ${question?.type}`}>
                    {isShortAnswer ? "Tự luận" : "Trắc nghiệm"}
                  </span>
                </div>

                {!isShortAnswer && (
                  <span
                    className={`auto-result ${
                      answer.isCorrect ? "correct" : "wrong"
                    }`}
                  >
                    {answer.isCorrect ? "Đúng" : "Sai"}
                  </span>
                )}
              </div>

              <h3>{question?.content}</h3>

              {!isShortAnswer ? (
                <div className="auto-review-box">
                  <p>
                    <strong>Đáp án user:</strong>{" "}
                    {answer.userAnswer || "Chưa trả lời"}
                  </p>
                  <p>
                    <strong>Đáp án đúng:</strong> {question?.correctAnswer}
                  </p>
                  <p>
                    <strong>Điểm:</strong> {answer.score}
                  </p>
                </div>
              ) : (
                <div className="manual-review-box">
                  <div className="essay-block">
                    <label>Câu trả lời của ứng viên</label>
                    <p>{answer.userAnswer || "Ứng viên chưa trả lời câu này."}</p>
                  </div>

                  <div className="essay-block">
                    <label>Đáp án mẫu</label>
                    <p>{question?.correctAnswer}</p>
                  </div>

                  <div className="manual-form-grid">
                    <div className="manual-field">
                      <label>Điểm tự luận</label>
                      <select
                        value={reviews[question._id]?.manualScore || 0}
                        onChange={(e) =>
                          handleReviewChange(
                            question._id,
                            "manualScore",
                            e.target.value
                          )
                        }
                      >
                        <option value={0}>0 điểm</option>
                        <option value={0.5}>0.5 điểm</option>
                        <option value={1}>1 điểm</option>
                      </select>
                    </div>

                    <div className="manual-field full">
                      <label>Nhận xét</label>
                      <textarea
                        placeholder="Nhập nhận xét cho câu trả lời..."
                        value={reviews[question._id]?.reviewerComment || ""}
                        onChange={(e) =>
                          handleReviewChange(
                            question._id,
                            "reviewerComment",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {shortAnswerCount > 0 && (
        <div className="save-review-bar">
          <button onClick={handleSaveReview} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu chấm điểm tự luận"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissionDetailPage;
