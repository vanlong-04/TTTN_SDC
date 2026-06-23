import { useEffect, useState } from "react";
import "./QuestionForm.scss";

const INITIAL_FORM = {
  content: "",
  type: "multiple_choice",
  optionsText: "",
  correctAnswer: "",
  difficulty: "Easy",
  tagsText: "",
  explanation: "",
  status: "published",
};

const QuestionForm = ({ editingQuestion, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setValidationError("");
    setFormData(
      editingQuestion
        ? {
            content: editingQuestion.content || "",
            type: editingQuestion.type || "multiple_choice",
            optionsText: editingQuestion.options?.join("\n") || "",
            correctAnswer: editingQuestion.correctAnswer || "",
            difficulty: editingQuestion.difficulty || "Easy",
            tagsText: editingQuestion.tags?.join(", ") || "",
            explanation: editingQuestion.explanation || "",
            status: editingQuestion.status || "published",
          }
        : INITIAL_FORM
    );
  }, [editingQuestion]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "type" && value === "short_answer" ? { optionsText: "" } : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const options = formData.type === "multiple_choice"
      ? formData.optionsText.split("\n").map((item) => item.trim()).filter(Boolean)
      : [];

    if (formData.type === "multiple_choice" && options.length < 2) {
      setValidationError("Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn.");
      return;
    }

    setValidationError("");
    onSubmit({
      content: formData.content.trim(),
      type: formData.type,
      options,
      correctAnswer: formData.correctAnswer.trim(),
      difficulty: formData.difficulty,
      tags: formData.tagsText.split(",").map((item) => item.trim()).filter(Boolean),
      explanation: formData.explanation.trim(),
      status: formData.status,
    });
  };

  return (
    <section className="question-form-card">
      <div className="form-heading">
        <h3>{editingQuestion ? "Cập nhật câu hỏi" : "Thêm câu hỏi mới"}</h3>
        <p>Tạo câu hỏi phỏng vấn IT dạng trắc nghiệm hoặc tự luận ngắn.</p>
      </div>
      <form className="question-form" onSubmit={handleSubmit}>
        <label className="admin-form-field admin-form-field--full">
          <span>Nội dung câu hỏi</span>
          <textarea name="content" placeholder="Nhập nội dung câu hỏi..." value={formData.content} onChange={handleChange} required />
        </label>

        <div className="admin-form-row">
          <label className="admin-form-field">
            <span>Loại câu hỏi</span>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="multiple_choice">Trắc nghiệm</option>
              <option value="short_answer">Tự luận ngắn</option>
            </select>
          </label>
          <label className="admin-form-field">
            <span>Độ khó</span>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
        </div>

        {formData.type === "multiple_choice" && (
          <label className="admin-form-field admin-form-field--full">
            <span>Các lựa chọn</span>
            <textarea name="optionsText" placeholder={"A. useState\nB. useEffect\nC. useMemo\nD. useRef"} value={formData.optionsText} onChange={handleChange} required />
            <small>Mỗi lựa chọn nhập trên một dòng.</small>
          </label>
        )}

        <div className="admin-form-row">
          <label className="admin-form-field">
            <span>Đáp án đúng</span>
            <input name="correctAnswer" placeholder="A hoặc câu trả lời mẫu" value={formData.correctAnswer} onChange={handleChange} required />
          </label>
          <label className="admin-form-field">
            <span>Tags công nghệ</span>
            <input name="tagsText" placeholder="ReactJS, JavaScript" value={formData.tagsText} onChange={handleChange} required />
          </label>
        </div>

        <div className="admin-form-row">
          <label className="admin-form-field">
            <span>Trạng thái</span>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <label className="admin-form-field admin-form-field--full">
          <span>Giải thích đáp án</span>
          <textarea name="explanation" placeholder="Nhập giải thích ngắn..." value={formData.explanation} onChange={handleChange} />
        </label>

        {validationError && <p className="question-form-error">{validationError}</p>}
        <div className="question-form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>Hủy</button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Đang lưu..." : editingQuestion ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default QuestionForm;
