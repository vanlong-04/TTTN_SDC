import "./QuestionCard.scss";

const getOptionValue = (option) => {
  const match = option.match(/^([A-D])\./i);
  return match ? match[1].toUpperCase() : option;
};

const QuestionCard = ({ question, answer, onAnswerChange, disabled = false }) => {
  if (!question) return null;

  return (
    <article className="exam-question-card">
      <div className="exam-question-meta">
        <span className="meta-item type">
          {question.type === "multiple_choice" ? "Trắc nghiệm" : "Tự luận ngắn"}
        </span>
        <span className={`meta-item difficulty ${question.difficulty}`}>{question.difficulty}</span>
        {question.tags?.map((tag) => <span key={tag} className="meta-item tag">{tag}</span>)}
      </div>

      <h2>{question.content}</h2>

      {question.type === "multiple_choice" && (
        <div className="exam-option-list">
          {question.options?.map((option) => {
            const value = getOptionValue(option);
            return (
              <label key={option} className={`exam-option-item${answer === value ? " selected" : ""}`}>
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={value}
                  checked={answer === value}
                  disabled={disabled}
                  onChange={(event) => onAnswerChange(question._id, event.target.value)}
                />
                <span className="custom-radio" aria-hidden="true" />
                <span className="option-text">{option}</span>
              </label>
            );
          })}
        </div>
      )}

      {question.type === "short_answer" && (
        <textarea
          className="essay-answer"
          placeholder="Nhập câu trả lời của bạn tại đây..."
          value={answer || ""}
          disabled={disabled}
          onChange={(event) => onAnswerChange(question._id, event.target.value)}
        />
      )}
    </article>
  );
};

export default QuestionCard;
