import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

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
    <header className={styles.header} style={{ boxShadow: '0 2px 12px #e3e8f0', background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className={styles.container} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className={styles.toplinks} />
        <div
          className={styles.row}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 48,
            width: '100%',
            flexWrap: 'wrap',
          }}
        >
          <h1 className={styles.logo} style={{ margin: 0, padding: '18px 0 8px 0', textAlign: 'center', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 }}>
            <Link to="/" style={{ color: '#a61a19', textDecoration: 'none' }}>
              Vietnam Tourism
            </Link>
          </h1>
          <nav className={styles.mainNav} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'auto', flex: 1 }}>
            <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 32, margin: 0, padding: 0, listStyle: 'none' }}>
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
              <li>
                <Link to="/tour-dashboard">Tour booking</Link>
              </li>
              {isAuthenticated && userRole === 'ADMIN' && (
                <li>
                  <Link to="/admin/about">Admin Dashboard</Link>
                </li>
              )}
              <li className={styles.hasFlyout}>
                <a href="#" className={styles.lang}>
                  EN <span className={styles.arrow}></span>
                </a>
                <div className={styles.flyout} />
              </li>
              {isAuthenticated ? (
                <li>
                  <button onClick={handleLogout} className={styles.loginButton} style={{ minWidth: 80 }}>
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <Link to="/login" className={styles.loginButton} style={{ minWidth: 80 }}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .${styles.row} {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .${styles.mainNav} ul {
            gap: 18px !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header; 