import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.png';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import PasswordIcon from '@mui/icons-material/Password';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close menu when clicking outside
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
    localStorage.removeItem('user');
    localStorage.removeItem('publicId');
    localStorage.removeItem('name');
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.flexRow}>
          {/* Logo - made larger */}
          <div className={styles.logoWrap}>
            <Link to="/">
              <img 
                src={logo} 
                alt="Vietnam Tourism Logo" 
                className={styles.logoImg}
              />
            </Link>
          </div>
          
          {/* Navigation menu */}
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
              {isAuthenticated && userRole === 'GUIDE' && (
                <li>
                  <Link to="/guide">Guide Dashboard</Link>
                </li>
              )}
              {isAuthenticated && userRole === 'ADMIN' && (
                <li>
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                </li>
              )}
            </ul>
          </nav>
          
          {/* User section - redesigned */}
          <div className={styles.rightSection}>
            {isAuthenticated ? (
              <div className={styles.userMenuWrap} ref={userMenuRef}>
                <button
                  className={styles.userBtn}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <div className={styles.userAvatar}>
                    <PersonIcon style={{ fontSize: '1.8rem' }} />
                  </div>
                </button>
                
                {/* Redesigned user dropdown */}
                {userMenuOpen && (
                  <div className={styles.userMenu}>
                    <div className={styles.userMenuHeader}>
                      <div className={styles.userAvatar}>
                        <PersonIcon style={{ fontSize: '2.2rem' }} />
                      </div>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>
                          {localStorage.getItem('name') || 'Tài khoản'}
                        </span>
                        <span className={styles.userRole}>
                          {userRole === 'ADMIN' ? 'Administrator' : 
                           userRole === 'GUIDE' ? 'Tour Guide' : 'User'}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.menuDivider}></div>
                    
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
                      <PersonIcon className={styles.menuIcon} />
                      <span>Thông tin khách hàng</span>
                    </button>

                    <button
                      className={styles.userMenuItem}
                      onClick={() => {
                        navigate('/change-password');
                      }}
                    >
                      <PasswordIcon className={styles.menuIcon} />
                      <span>Đổi mật khẩu</span>
                    </button>
                    
                    <button
                      className={`${styles.userMenuItem} ${styles.logoutItem}`}
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogoutIcon className={styles.menuIcon} />
                      <span>Đăng xuất</span>
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