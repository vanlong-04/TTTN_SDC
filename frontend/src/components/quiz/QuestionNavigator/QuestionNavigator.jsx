import "./QuestionNavigator.scss";

const hasAnswer = (answer) => answer !== undefined && String(answer).trim() !== "";

const QuestionNavigator = ({ questions, currentIndex, answers, onJump, disabled = false }) => {
  const answeredCount = questions.filter((question) => hasAnswer(answers[question._id])).length;

  return (
    <section className="question-navigator">
      <div className="navigator-header">
        <h3>Danh sách câu hỏi</h3>
        <p>Đã trả lời {answeredCount}/{questions.length}</p>
      </div>
      <div className="navigator-grid">
        {questions.map((question, index) => (
          <button
            type="button"
            key={question._id}
            className={`nav-question-btn${index === currentIndex ? " current" : ""}${hasAnswer(answers[question._id]) ? " answered" : ""}`}
            onClick={() => onJump(index)}
            disabled={disabled}
            aria-current={index === currentIndex ? "step" : undefined}
            aria-label={`Câu ${index + 1}${hasAnswer(answers[question._id]) ? ", đã trả lời" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="navigator-legend">
        <div><span className="dot current" />Câu hiện tại</div>
        <div><span className="dot answered" />Đã trả lời</div>
        <div><span className="dot normal" />Chưa trả lời</div>
      </div>
    </section>
  );
};

export default QuestionNavigator;
