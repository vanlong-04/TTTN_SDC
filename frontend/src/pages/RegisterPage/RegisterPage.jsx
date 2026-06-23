import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import getApiError from "../../utils/getApiError";
import "../LoginPage/LoginPage.scss";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError, "Đăng ký thất bại"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-background" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="orb orb-three" />
      </div>

      <div className="auth-shell reverse">
        <section className="auth-visual">
          <Link to="/" className="auth-brand" aria-label="Về trang chủ">
            <span className="brand-mark">IT</span>
            <div><h2>IT Interview</h2><p>Mock Test Platform</p></div>
          </Link>

          <div className="visual-content">
            <span className="visual-badge">START LEARNING</span>
            <h1>Tạo tài khoản và bắt đầu luyện phỏng vấn</h1>
            <p>Theo dõi điểm số, luyện tập theo công nghệ và chuẩn bị tốt hơn cho công việc IT.</p>
          </div>

          <div className="visual-checklist">
            <div><span>✓</span> Làm mock test có thời gian</div>
            <div><span>✓</span> Xem kết quả sau khi nộp bài</div>
            <div><span>✓</span> Lưu lịch sử và xem lại đáp án</div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <span>Create account</span>
            <h1>Đăng ký</h1>
            <p>Tạo tài khoản miễn phí để bắt đầu luyện phỏng vấn việc làm IT.</p>
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field" htmlFor="register-username">
              <span>Username</span>
              <div className="input-wrap">
                <input id="register-username" type="text" name="username"
                  placeholder="Nhập tên người dùng" autoComplete="username"
                  minLength={3} maxLength={50} value={formData.username}
                  onChange={handleChange} required />
              </div>
            </label>

            <label className="auth-field" htmlFor="register-email">
              <span>Email</span>
              <div className="input-wrap">
                <input id="register-email" type="email" name="email"
                  placeholder="example@gmail.com" autoComplete="email"
                  value={formData.email} onChange={handleChange} required />
              </div>
            </label>

            <label className="auth-field" htmlFor="register-password">
              <span>Mật khẩu</span>
              <div className="input-wrap">
                <input id="register-password" type="password" name="password"
                  placeholder="Tối thiểu 6 ký tự" autoComplete="new-password"
                  minLength={6} maxLength={128} value={formData.password}
                  onChange={handleChange} required />
              </div>
            </label>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          <div className="auth-switch">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
