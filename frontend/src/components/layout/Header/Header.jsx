import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./Header.scss";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="site-header">
      <div className="site-header__container">
        <Link to="/" className="site-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="logo-accent">IT</span> MockTest
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Navigation Menu */}
        <nav className={`site-nav ${isMobileMenuOpen ? "site-nav--open" : ""}`}>
          <div className="nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
              end
            >
              Trang chủ
            </NavLink>
            
            <NavLink 
              to="/questions" 
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ngân hàng câu hỏi
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/quizzes"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đề thi
                </NavLink>
                <NavLink 
                  to="/quiz/setup" 
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tạo đề ngẫu nhiên
                </NavLink>
                <NavLink 
                  to="/history" 
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Lịch sử làm bài
                </NavLink>
              </>
            )}
          </div>

          <div className="nav-auth">
            {isAuthenticated ? (
              <div className="user-profile">
                <div className="user-info">
                  <svg className="user-avatar" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                  <span className="username" title={user.email}>{user.username}</span>
                  {user.role === "admin" && <span className="admin-badge">Admin</span>}
                </div>
                
                <div className="action-buttons">
                  {user.role === "admin" && (
                    <Link 
                      to="/admin" 
                      className="btn-admin-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button className="btn-logout" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-register" onClick={() => setIsMobileMenuOpen(false)}>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
