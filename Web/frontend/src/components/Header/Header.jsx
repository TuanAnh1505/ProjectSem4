import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logo from './logo.png'; // chỉnh path đúng thư mục chứa ảnh

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.toplinks}>
          <ul className={styles.headerActions}>
            {/* Đã xoá icon search */}
          </ul>
        </div>
        <div className={styles.row}>
          <h1 className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="Vietnam Tourism Logo" style={{width: '120px', height: 'auto'}}/>
            </Link>
          </h1>
          <nav className={styles.mainNav}>
            <ul>
              <li className={styles.hasFlyout}>
                <Link to="/live-fully" className={styles.lang}>
                  Live fully in Vietnam <span className={styles.arrow}></span>
                </Link>
              </li>
              <li className={styles.hasFlyout}>
                <Link to="/places-to-go">
                  Places to go <span className={styles.arrow}></span>
                </Link>
              </li>
              <li className={styles.hasFlyout}>
                <Link to="/things-to-do">
                  Things to do <span className={styles.arrow}></span>
                </Link>
              </li>
              <li className={styles.hasFlyout}>
                <Link to="/plan">
                  Plan your trip <span className={styles.arrow}></span>
                </Link>
              </li>
              <li>
                <Link to="/tour-dashboard">Tour booking</Link>
              </li>
              {isAuthenticated && userRole === 'ADMIN' && (
                <li>
                  <Link to="/admin-dashboard">Admin Dashboard</Link>
                </li>
              )}
              <li className={styles.hasFlyout}>
                <a href="#" className={styles.lang}>
                  EN <span className={styles.arrow}></span>
                </a>
                <div className={styles.flyout}>
                  {/* Language options */}
                </div>
              </li>
              {isAuthenticated ? (
                <li>
                  <button onClick={handleLogout} className={styles.loginButton}>
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <Link to="/login" className={styles.loginButton}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 