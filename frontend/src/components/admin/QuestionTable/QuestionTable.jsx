import "./QuestionTable.scss";

const TYPE_LABELS = {
  multiple_choice: "Trắc nghiệm",
  short_answer: "Tự luận",
};

const QuestionTable = ({ questions, onEdit, onDelete }) => {
  if (questions.length === 0) {
    return (
      <div className="empty-questions">
        <h3>Không tìm thấy câu hỏi</h3>
        <p>Thử thay đổi bộ lọc hoặc thêm câu hỏi mới.</p>
      </div>
    );
  }

  return (
    <div className="question-table-card">
      <div className="question-table-scroll">
        <table className="question-table">
          <thead>
            <tr>
              <th>Câu hỏi</th>
              <th>Loại</th>
              <th>Độ khó</th>
              <th>Tags</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question._id}>
                <td className="question-content-cell">
                  <strong>{question.content}</strong>
                  {question.type === "multiple_choice" && (
                    <ul>
                      {question.options?.slice(0, 4).map((option) => (
                        <li key={option}>{option}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td><span className={`type-badge ${question.type}`}>{TYPE_LABELS[question.type]}</span></td>
                <td><span className={`difficulty-badge ${question.difficulty}`}>{question.difficulty}</span></td>
                <td>
                  <div className="tag-list">
                    {question.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </td>
                <td><span className={`status-badge ${question.status || "published"}`}>{question.status || "published"}</span></td>
                <td>
                  <div className="table-actions">
                    <button type="button" className="edit-btn" onClick={() => onEdit(question)}>Sửa</button>
                    <button type="button" className="delete-btn" onClick={() => onDelete(question)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;
