import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <h1 className={styles.logo} style={{ margin: 0, padding: '18px 0 8px 0', textAlign: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <img 
                src={logo}
                alt="Vietnam Tourism Logo" 
                style={{ 
                  height: '40px',
                  width: 'auto'
                }}
              />
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
                <li ref={userMenuRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen((open) => !open)}
                    style={{ marginLeft: 16, fontWeight: 600, color: '#1976d2', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <span role="img" aria-label="user" style={{ fontSize: '2rem' }}>👤</span>
                  </button>
                  {userMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '110%',
                      transform: 'translateX(-50%)',
                      background: '#fff',
                      boxShadow: '0 8px 32px rgba(60,60,60,0.18)',
                      borderRadius: 14,
                      minWidth: 210,
                      zIndex: 1000,
                      overflow: 'hidden',
                      border: '1px solid #ececec',
                      animation: 'fadeInMenu 0.25s',
                    }}>
                      <style>{`
                        @keyframes fadeInMenu {
                          from { opacity: 0; transform: translateY(-10px) translateX(-50%); }
                          to { opacity: 1; transform: translateY(0) translateX(-50%); }
                        }
                      `}</style>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
                        <li>
                          <button
                            onClick={() => {
                              const publicId = localStorage.getItem('publicId');
                              setUserMenuOpen(false);
                              if (publicId) {
                                navigate(`/account/${publicId}`);
                              } else {
                                navigate('/login');
                              }
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              transition: 'background 0.18s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              gap: 6,
                              minHeight: 36,
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#f0f4ff'}
                            onMouseOut={e => e.currentTarget.style.background = 'none'}
                          >
                            <span role="img" aria-label="user" style={{fontSize: '1.3em', color: '#673ab7', minWidth: 24}}>👤</span>
                            <span style={{whiteSpace: 'nowrap'}}>Thông tin tài khoản</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate('/payment');
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              transition: 'background 0.18s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              gap: 6,
                              minHeight: 36,
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#f0f4ff'}
                            onMouseOut={e => e.currentTarget.style.background = 'none'}
                          >
                            <span role="img" aria-label="payment" style={{fontSize: '1.3em', color: '#1976d2', minWidth: 24}}>💳</span>
                            <span style={{whiteSpace: 'nowrap'}}>Thanh toán</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              handleLogout();
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              color: '#d32f2f',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '1rem',
                              transition: 'background 0.18s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              gap: 6,
                              minHeight: 36,
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#ffeaea'}
                            onMouseOut={e => e.currentTarget.style.background = 'none'}
                          >
                            <span role="img" aria-label="logout" style={{fontSize: '1.3em', color: '#d32f2f', minWidth: 24}}>🚪</span>
                            <span style={{whiteSpace: 'nowrap'}}>Logout</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
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