import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.png';
import PersonIcon from '@mui/icons-material/Person';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangOpen(false);
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
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.flexRow}>
          {/* Logo bên trái */}
          <div className={styles.logoWrap}>
            <Link to="/">
              <img src={logo} alt="Vietnam Tourism Logo" className={styles.logoImg} />
            </Link>
          </div>
          {/* Menu giữa */}
          <nav className={styles.mainNav}>
            <ul>
              <li>
                <Link to="/live-fully">Live fully in Vietnam</Link>
              </li>
              <li>
                <Link to="/places-to-go">Places to go</Link>
              </li>
              <li>
                <Link to="/tour-dashboard">Tour booking</Link>
              </li>
              {isAuthenticated && userRole === 'ADMIN' && (
                <li>
                  <Link to="/admin/about">Admin Dashboard</Link>
                </li>
              )}
            </ul>
          </nav>
          {/* Phần bên phải: ngôn ngữ + user */}
          <div className={styles.rightSection}>
            {/* Dropdown ngôn ngữ */}
            <div className={styles.langDropdown} ref={langMenuRef}>
              <button
                className={styles.langBtn}
                onClick={() => setLangOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={langOpen}
              >
                EN <span className={styles.arrow}></span>
              </button>
              {langOpen && (
                <div className={styles.langMenu}>
                  <button className={styles.langItem}>English</button>
                  <button className={styles.langItem}>Vietnamese</button>
                  <button className={styles.langItem}>Chinese</button>
                </div>
              )}
            </div>
            {/* User icon/login */}
            {isAuthenticated ? (
              <div className={styles.userMenuWrap} ref={userMenuRef}>
                <button
                  className={styles.userBtn}
                  onClick={() => setUserMenuOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <PersonIcon style={{ fontSize: '2rem' }} />
                </button>
                {userMenuOpen && (
                  <div className={styles.userMenu}>
                    <button
                      className={styles.userMenuItem}
                      onClick={() => {
                        const publicId = localStorage.getItem('publicId');
                        setUserMenuOpen(false);
                        if (publicId) {
                          navigate(`/account/${publicId}`);
                        } else {
                          navigate('/login');
                        }
                      }}
                    >
                      <PersonIcon style={{ fontSize: '1.3em', marginRight: 8 }} /> Thông tin tài khoản
                    </button>
                    <button
                      className={styles.userMenuItem}
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      style={{ color: '#d32f2f' }}
                    >
                      <span style={{ fontSize: '1.3em', marginRight: 8 }}>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={styles.loginButton}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 