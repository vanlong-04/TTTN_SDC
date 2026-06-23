import "./QuestionFilter.scss";

const QuestionFilter = ({ filters, onChange, onReset }) => {
  const handleChange = (event) => {
    onChange({ ...filters, [event.target.name]: event.target.value, page: 1 });
  };

  return (
    <section className="question-filter" aria-label="Bộ lọc câu hỏi">
      <label className="filter-group">
        <span>Tag công nghệ</span>
        <input name="tag" placeholder="ReactJS, NodeJS..." value={filters.tag} onChange={handleChange} />
      </label>
      <label className="filter-group">
        <span>Độ khó</span>
        <select name="difficulty" value={filters.difficulty} onChange={handleChange}>
          <option value="">Tất cả</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </label>
      <label className="filter-group">
        <span>Loại câu hỏi</span>
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">Tất cả</option>
          <option value="multiple_choice">Trắc nghiệm</option>
          <option value="short_answer">Tự luận</option>
        </select>
      </label>
      <label className="filter-group">
        <span>Trạng thái</span>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">Tất cả</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <button type="button" className="reset-filter-btn" onClick={onReset}>Xóa lọc</button>
    </section>
  );
};

export default QuestionFilter;
