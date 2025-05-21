import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/admin/AdminDashboard.css";

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAsideCollapsed, setIsAsideCollapsed] = useState(false);


  useEffect(() => {
    const selectContainer = document.querySelector('.custom-select');
    selectContainer.classList.remove('flag-vi', 'flag-en');
    selectContainer.classList.add(`flag-${i18n.language}`);
  }, [i18n.language]);

  const changeLanguage = (value) => {
    i18n.changeLanguage(value); // Update language/currency via i18n
    // Optional: Update price or other UI elements
    console.log('Currency/Language selected:', value);
  };

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

  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  //   localStorage.setItem("language", lng);
  // };

  return (
    <div className="admin-dashboard">
      <aside className={`aside-nav ${isAsideCollapsed ? "collapsed" : ""}`}>
        {!isAsideCollapsed && (
          <div className="aside-header">
            <div className="logo-container">
              <h1 style={{ color: '#a61a19', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                Vietnam Tourism
              </h1>
            </div>
            <button className="toggle-button" onClick={toggleAside}>
              ✕
            </button>
          </div>
        )}
        {!isAsideCollapsed && (
          <ul className="aside-menu">
            <li className="menu-section">{t("main_pages")}</li>
            <li onClick={() => navigate("/admin/dashboard")}>
              <span className="menu-icon">📊</span>
              <span className="menu-text">{t("dashboard")}</span>
            </li>
            <li onClick={() => navigate("/admin/destination")}>
              <span className="menu-icon">🌍</span>
              <span className="menu-text">{t("destination")}</span>
            </li>
            <li onClick={() => navigate("/admin/event")}>
              <span className="menu-icon">📅</span>
              <span className="menu-text">{t("event")}</span>
            </li>
            <li onClick={() => navigate("/admin/tour")}>
              <span className="menu-icon">🗺️</span>
              <span className="menu-text">{t("tour")}</span>
            </li>
            <li onClick={() => navigate("/admin/itineraries")}>
              <span className="menu-icon">🗺️</span>
              <span className="menu-text">{t("itinerary")}</span>
            </li>
            <li onClick={() => navigate("/admin/tour-guide")}>
              <span className="menu-icon">🧑‍💼</span>
              <span className="menu-text">Tour Guide</span>
            </li>
            <li onClick={() => navigate("/admin/schedules")}>
              <span className="menu-icon">📅</span>
              <span className="menu-text">{t("schedule")}</span>
            </li>
            <li onClick={() => navigate("/admin/booking")}>
              <span className="menu-icon">📖</span>
              <span className="menu-text">{t("booking")}</span>
            </li>
            <div className="account-section">
              <li className="menu-section">{t("account_pages")}</li>
              <li onClick={() => navigate("/admin/user")}>
                <span className="menu-icon">👤</span>
                <span className="menu-text">{t("user")}</span>
              </li>
              <li onClick={handleLogout}>
                <span className="menu-icon">🚪</span>
                <span className="menu-text">{t("logout")}</span>
              </li>
            </div>
          </ul>
        )}
      </aside>
      <main
        className={`main-content ${isAsideCollapsed ? "collapsed" : ""}`}
        style={{
          width: isAsideCollapsed ? "calc(100% - 50px)" : "calc(100% - 250px)",
          display: "flex",
          flexDirection: "column",
          minHeight: "90vh",
        }}
      >
        {isAsideCollapsed && (
          <button className="toggle-button-main" onClick={toggleAside}>
            ☰
          </button>
        )}
        <div className="button-container">
          <div className="custom-select flag-vi">
            <label htmlFor="currency-select" className="visually-hidden">
              Select currency
            </label>
            <select
              id="currency-select"
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
            >
              <option value="vi">Viet Nam</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="user-icon" onClick={toggleDropdown}>
            👤
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <p className="dropdown-item">
                {t("account")}: <strong>{email}</strong>
              </p>
              <button
                onClick={() => navigate("/change-password")}
                className="dropdown-item"
              >
                {t("change_password")}
              </button>
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>{children}</div>
        <footer
          style={{
            textAlign: "center",
            marginTop: "auto",
            color: "#333",
            fontSize: "14px",
          }}
        >
          <p>{t("footer")}</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;