import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <span>404</span>
        <h1>Không tìm thấy trang</h1>
        <p>Trang bạn đang truy cập không tồn tại hoặc đã được di chuyển.</p>
        <div className="not-found-actions">
          <Link to="/">Về trang chủ</Link>
          {isAuthenticated && <Link to="/quizzes" className="secondary">Chọn đề thi</Link>}
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
