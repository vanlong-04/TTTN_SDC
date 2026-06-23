import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { submissionService } from "../../services/submissionService";
import "./SubmissionDetailPage.scss";

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissionDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await submissionService.getSubmissionById(id);

      setSubmission(data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Không thể tải chi tiết bài nộp"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionDetail();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const hasShortAnswer = submission.answers.some(
    (answer) => answer.question?.type === "short_answer"
  );

  const getScoreLabel = () => {
    if (!hasShortAnswer) return "Tổng điểm";
    if (submission.status === "reviewed") return "Tổng điểm (Đã chấm tự luận)";
    return "Điểm trắc nghiệm (Chờ chấm tự luận)";
  };

  const getStatusLabel = (status) => {
    if (status === "auto_graded") return "Đã chấm tự động";
    if (status === "pending_review") return "Chờ chấm tự luận";
    if (status === "reviewed") return "Đã chấm xong";
    return status;
  };

  if (loading) {
    return (
      <div className="submission-detail-page">
        <div className="submission-detail-container">
          <div className="detail-loading">Đang tải chi tiết bài làm...</div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="submission-detail-page">
        <div className="submission-detail-container">
          <div className="detail-error">
            <h2>Không thể tải bài nộp</h2>
            <p>{error}</p>
            <button onClick={() => navigate("/history")}>
              Quay lại lịch sử
            </button>
          </div>
        </div>
      </div>
    );
  }

  const percent = getPercent();

  return (
    <div className="submission-detail-page">
      <div className="submission-detail-container">
        <button className="back-btn" onClick={() => navigate("/history")}>
          ← Quay lại lịch sử
        </button>

        <div className="detail-header-card">
          <div>
            <span className="detail-badge">Submission Detail</span>
            <h1>{submission.quiz?.title}</h1>
            <p>Nộp lúc: {formatDate(submission.submittedAt)}</p>
          </div>

          <div className="detail-score-circle">
            <strong>{percent}%</strong>
            <span>
              {submission.totalScore}/{submission.maxScore} điểm
            </span>
          </div>
        </div>

        <div className="detail-summary-grid">
          <div className="summary-box">
            <span>Tổng câu</span>
            <strong>{submission.answers.length}</strong>
          </div>

          <div className="summary-box">
            <span>{getScoreLabel()}</span>
            <strong>
              {submission.totalScore}/{submission.maxScore}
            </strong>
          </div>

          <div className="summary-box">
            <span>Trạng thái</span>
            <strong className={`status-badge status-${submission.status}`}>
              {getStatusLabel(submission.status)}
            </strong>
          </div>

          <div className="summary-box">
            <span>Thời gian đề</span>
            <strong>{submission.quiz?.duration} phút</strong>
          </div>
        </div>

        <div className="answers-section">
          <div className="answers-heading">
            <h2>Chi tiết câu trả lời</h2>
            <p>Xem lại đáp án bạn đã chọn và kết quả chấm điểm.</p>
          </div>

          <div className="answers-list">
            {submission.answers.map((answer, index) => {
              const question = answer.question;

              return (
                <div className="answer-card" key={question?._id || index}>
                  <div className="answer-card-header">
                    <div>
                      <span className="question-number">Câu {index + 1}</span>
                      <span className={`question-type ${question?.type}`}>
                        {getQuestionTypeLabel(question?.type)}
                      </span>
                    </div>

                    {question?.type === "multiple_choice" ? (
                      <span
                        className={`result-label ${
                          answer.isCorrect ? "correct" : "wrong"
                        }`}
                      >
                        {answer.isCorrect ? "Đúng" : "Sai"}
                      </span>
                    ) : submission.status === "reviewed" ? (
                      <span className="result-label correct">
                        Đã chấm ({answer.score}đ)
                      </span>
                    ) : (
                      <span className="result-label pending">
                        Chờ chấm
                      </span>
                    )}
                  </div>

                  <h3>{question?.content}</h3>

                  {question?.type === "multiple_choice" && (
                    <div className="options-review">
                      {question.options?.map((option, optionIndex) => {
                        const optionLetter =
                          option.match(/^([A-D])\./i)?.[1]?.toUpperCase() ||
                          option;

                        const isUserAnswer = answer.userAnswer === optionLetter;
                        const isCorrectAnswer =
                          question.correctAnswer === optionLetter;

                        return (
                          <div
                            key={optionIndex}
                            className={`
                              review-option
                              ${isUserAnswer ? "user-answer" : ""}
                              ${isCorrectAnswer ? "correct-answer" : ""}
                            `}
                          >
                            <span>{option}</span>

                            <div className="option-flags">
                              {isUserAnswer && <em>Bạn chọn</em>}
                              {isCorrectAnswer && <strong>Đáp án đúng</strong>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {question?.type === "short_answer" && (
                    <div className="essay-review">
                      <label>Câu trả lời của bạn</label>
                      <p>{answer.userAnswer || "Bạn chưa trả lời câu này."}</p>

                      <label>Đáp án mẫu</label>
                      <p>{question.correctAnswer}</p>

                      {answer.reviewerComment && (
                        <>
                          <label>Nhận xét của người chấm</label>
                          <p className="reviewer-comment">{answer.reviewerComment}</p>
                        </>
                      )}
                    </div>
                  )}

                  <div className="answer-footer">
                    <span>Điểm câu này: {answer.score}</span>
                    <span>Độ khó: {question?.difficulty}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;
