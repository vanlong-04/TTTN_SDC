import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__grid">
          {/* Logo & Intro */}
          <div className="footer-col footer-col--about">
            <Link to="/" className="footer-logo">
              <span className="logo-accent">IT</span> MockTest
            </Link>
            <p className="footer-desc">
              Hệ thống ôn luyện kiến thức phỏng vấn IT, hỗ trợ thi thử trắc nghiệm tự động chấm điểm và làm bài thi tự luận có Admin chấm chi tiết.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-title">Khám phá</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/questions">Ngân hàng câu hỏi</Link>
              </li>
              <li>
                <Link to="/quiz/setup">Phòng thi thử</Link>
              </li>
              <li>
                <Link to="/history">Lịch sử làm bài</Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="footer-col">
            <h4 className="footer-title">Công nghệ sử dụng</h4>
            <ul className="footer-links">
              <li>
                <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React.js & SCSS</a>
              </li>
              <li>
                <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js & Express</a>
              </li>
              <li>
                <a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer">MongoDB & Mongoose</a>
              </li>
              <li>
                <a href="https://vite.dev/" target="_blank" rel="noopener noreferrer">Vite Bundler</a>
              </li>
            </ul>
          </div>

          {/* Contact / Resource */}
          <div className="footer-col">
            <h4 className="footer-title">Sinh viên thực hiện</h4>
            <p className="footer-info-text">
              <strong>Đồ án tốt nghiệp CNTT</strong>
            </p>
            <p className="footer-info-text">
              Học viên: Rainscales Long
            </p>
            <p className="footer-info-text">
              Phiên bản: 1.2.0 (Sprint 8)
            </p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="copyright">
            &copy; {currentYear} IT MockTest. Tất cả quyền được bảo lưu. Thiết kế với sự tập trung vào trải nghiệm người dùng.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
