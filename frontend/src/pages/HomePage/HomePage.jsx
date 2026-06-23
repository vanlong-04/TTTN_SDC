import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./HomePage.scss";

const features = [
  { icon: "Q", title: "Ngân hàng câu hỏi", text: "Ôn tập câu hỏi theo công nghệ, loại câu hỏi và độ khó với lời giải rõ ràng." },
  { icon: "T", title: "Mock Test có thời gian", text: "Làm bài trong phòng thi đếm ngược và tự động nộp khi hết thời gian." },
  { icon: "S", title: "Chấm điểm tức thì", text: "Câu trắc nghiệm được chấm tự động, kết quả được lưu vào lịch sử cá nhân." },
  { icon: "A", title: "Nhận xét chuyên sâu", text: "Câu trả lời ngắn được admin đánh giá và phản hồi để bạn tiến bộ hơn." },
];

const technologies = ["JavaScript", "ReactJS", "NodeJS", "MongoDB", "ExpressJS", "OOP"];

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="hero-badge">Mock Test & Question Bank</span>
          <h1>Luyện phỏng vấn IT hiệu quả hơn với trải nghiệm thi thử thực tế</h1>
          <p>
            Ôn JavaScript, ReactJS, NodeJS và kiến thức nền tảng qua ngân hàng
            câu hỏi, đề thi có thời gian, chấm điểm tự động và lịch sử tiến bộ.
          </p>
          <div className="hero-actions">
            <Link to={isAuthenticated ? "/quizzes" : "/register"} className="primary-action">
              {isAuthenticated ? "Chọn đề thi" : "Tạo tài khoản miễn phí"}
            </Link>
            <Link to="/questions" className="secondary-action">Xem ngân hàng câu hỏi</Link>
          </div>
        </div>

        <div className="home-hero__panel" aria-label="Minh họa các đề thi">
          <article className="mock-card top">
            <span>ReactJS</span><strong>Hooks & Components</strong><small>10 câu · 30 phút</small>
          </article>
          <article className="mock-card middle">
            <span>NodeJS</span><strong>Express & JWT</strong><small>Trắc nghiệm + trả lời ngắn</small>
          </article>
          <article className="mock-card bottom">
            <span>Kết quả</span><strong>8/10 điểm</strong><small>Phân tích lịch sử làm bài</small>
          </article>
        </div>
      </section>

      <section className="feature-section">
        <div className="section-heading center">
          <span>Tính năng chính</span>
          <h2>Một hệ thống luyện phỏng vấn IT hoàn chỉnh</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3><p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tech-section">
        <div className="section-heading">
          <span>Chủ đề luyện tập</span>
          <h2>Công nghệ phổ biến trong phỏng vấn IT</h2>
        </div>
        <div className="tech-grid">
          {technologies.map((technology) => (
            <Link to={isAuthenticated ? "/quiz/setup" : "/login"} className="tech-card" key={technology}>
              {technology}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
