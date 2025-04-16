import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAsideCollapsed, setIsAsideCollapsed] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const toggleAside = () => {
    setIsAsideCollapsed((prev) => !prev);
  };

  return (
    <div className="admin-dashboard">
      <aside className={`aside-nav ${isAsideCollapsed ? "collapsed" : ""}`}>
        {!isAsideCollapsed && (
          <div className="aside-header">
            <div className="logo-container">
              <img
                src=""
                alt=""
                className="logo"
              />
            </div>

            <button className="toggle-button" onClick={toggleAside}>
              x {/* Hamburger menu icon */}
            </button>
          </div>
        )}
        {!isAsideCollapsed && (
          <ul className="aside-menu">
            <li className="menu-section">MAIN PAGES</li>
            <li onClick={() => navigate("/admin/dashboard")}>
              <span className="menu-icon">📊</span>
              <span className="menu-text">Dashboard</span>
            </li>
            <div className="account-section">
              <li className="menu-section">ACCOUNT PAGES</li>
              <li onClick={() => navigate("/admin/user")}>
                <span className="menu-icon">👤</span>
                <span className="menu-text">User</span>
              </li>
              <li onClick={handleLogout}>
                <span className="menu-icon">🚪</span>
                <span className="menu-text">Logout</span>
              </li>
            </div>
          </ul>
        )}
      </aside>
      <main className={`main-content ${isAsideCollapsed ? "collapsed" : ""}`}>
        {isAsideCollapsed && (
          <button className="toggle-button-main" onClick={toggleAside}>
            ☰ {/* Hamburger menu icon */}
          </button>
        )}
        <div className="button-container">
          <div className="user-icon" onClick={toggleDropdown}>
            👤
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <p className="dropdown-item">Tài khoản: <strong>{email}</strong></p>
              <button
                onClick={() => navigate("/change-password")}
                className="dropdown-item"
              >
                Đổi Mật Khẩu
              </button>
            </div>
          )}
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminDashboard;
