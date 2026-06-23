import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import getApiError from "../../utils/getApiError";
import "./LoginPage.scss";

const LoginPage = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const user = await login(formData);
      const intendedPath = location.state?.from?.pathname;
      navigate(intendedPath || (user.role === "admin" ? "/admin" : "/dashboard"), {
        replace: true,
      });
    } catch (requestError) {
      setError(getApiError(requestError, "Đăng nhập thất bại"));
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

      <div className="auth-shell">
        <section className="auth-visual">
          <Link to="/" className="auth-brand" aria-label="Về trang chủ">
            <span className="brand-mark">IT</span>
            <div><h2>IT Interview</h2><p>Mock Test Platform</p></div>
          </Link>

          <div className="visual-content">
            <span className="visual-badge">INTERVIEW PRACTICE</span>
            <h1>Luyện phỏng vấn IT thông minh hơn mỗi ngày</h1>
            <p>Làm mock test, theo dõi tiến độ và cải thiện kỹ năng trước khi bước vào phòng phỏng vấn thật.</p>
          </div>

          <div className="visual-stats">
            <div><strong>30+</strong><span>Câu hỏi mẫu</span></div>
            <div><strong>3</strong><span>Công nghệ chính</span></div>
            <div><strong>JWT</strong><span>Bảo mật</span></div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <span>Welcome back</span>
            <h1>Đăng nhập</h1>
            <p>Nhập thông tin tài khoản để tiếp tục hành trình luyện phỏng vấn.</p>
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field" htmlFor="login-email">
              <span>Email</span>
              <div className="input-wrap">
                <input id="login-email" type="email" name="email"
                  placeholder="example@gmail.com" autoComplete="email"
                  value={formData.email} onChange={handleChange} required />
              </div>
            </label>

            <label className="auth-field" htmlFor="login-password">
              <span>Mật khẩu</span>
              <div className="input-wrap">
                <input id="login-password" type="password" name="password"
                  placeholder="Nhập mật khẩu" autoComplete="current-password"
                  value={formData.password} onChange={handleChange} required />
              </div>
            </label>

            <div className="auth-security-note">
              <span aria-hidden="true">✓</span> Phiên đăng nhập được bảo vệ bằng JWT
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="auth-switch">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
