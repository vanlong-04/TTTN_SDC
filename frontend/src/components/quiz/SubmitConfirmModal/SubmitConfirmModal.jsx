import { useEffect, useRef } from "react";
import "./SubmitConfirmModal.scss";

const SubmitConfirmModal = ({ totalQuestions, answeredCount, onCancel, onConfirm, loading }) => {
  const confirmButtonRef = useRef(null);
  const unansweredCount = totalQuestions - answeredCount;

  useEffect(() => {
    confirmButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, onCancel]);

  return (
    <div className="submit-modal-backdrop" role="presentation" onMouseDown={() => !loading && onCancel()}>
      <section
        className="submit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-icon" aria-hidden="true">?</div>
        <h2 id="submit-modal-title">Xác nhận nộp bài</h2>
        <p>Bạn đã trả lời <strong>{answeredCount}</strong>/{totalQuestions} câu.</p>
        {unansweredCount > 0 && (
          <div className="warning-box">
            Bạn vẫn còn {unansweredCount} câu chưa trả lời. Bạn có chắc muốn nộp bài không?
          </div>
        )}
        <div className="submit-modal-actions">
          <button type="button" className="modal-cancel-btn" onClick={onCancel} disabled={loading}>Kiểm tra lại</button>
          <button ref={confirmButtonRef} type="button" className="modal-confirm-btn" onClick={onConfirm} disabled={loading}>
            {loading ? "Đang nộp..." : "Nộp bài"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default SubmitConfirmModal;
