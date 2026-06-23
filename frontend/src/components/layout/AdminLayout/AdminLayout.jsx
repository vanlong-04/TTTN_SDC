import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./AdminLayout.scss";
import "./AdminTheme.scss";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-logo">IT Mock Admin</Link>
        <nav className="admin-menu" aria-label="Menu quản trị">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/questions">Ngân hàng câu hỏi</NavLink>
          <NavLink to="/admin/quizzes">Đề thi</NavLink>
          <NavLink to="/admin/submissions">Chấm bài tự luận</NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h2>Trang quản trị</h2>
            <p>Quản lý hệ thống luyện phỏng vấn IT</p>
          </div>
          <div className="admin-user">
            <span>{user?.username}</span>
            <button type="button" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </header>
        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
