import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../styles/admin/AdminDashboard.css";
import {FaCamera,FaInfo, FaChartLine, FaGlobeAsia, FaCalendarAlt, FaMapMarkedAlt, FaListAlt, FaUser, FaSignOutAlt, FaBook, FaChevronUp, FaChevronDown, FaSearch, FaDollarSign } from "react-icons/fa";

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAsideCollapsed, setIsAsideCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tourMenuOpen, setTourMenuOpen] = useState(false);
  const submenuRef = useRef();
  const tourMenuRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);

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
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (["/admin/tour", "/admin/destination", "/admin/event", "/admin/itineraries", "/admin/schedules"].includes(location.pathname)) {
      setTourMenuOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!tourMenuOpen) return;
    function handleClickOutside(event) {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target) &&
        tourMenuRef.current &&
        !tourMenuRef.current.contains(event.target)
      ) {
        setTourMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tourMenuOpen]);

  const handleDashboardSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      if (term.includes("tour") || term.includes("chuyến đi")) {
        navigate(`/admin/tour?search=${encodeURIComponent(searchTerm)}`);
      } else if (term.includes("event") || term.includes("sự kiện")) {
        navigate(`/admin/event?search=${encodeURIComponent(searchTerm)}`);
      } else if (term.includes("destination") || term.includes("điểm đến")) {
        navigate(`/admin/destination?search=${encodeURIComponent(searchTerm)}`);
      } else if (term.includes("itineraries") || term.includes("lịch trình")) {
        navigate(`/admin/itineraries?search=${encodeURIComponent(searchTerm)}`);
      } else if (term.includes("schedules") || term.includes("lịch")) {
        navigate(`/admin/schedules?search=${encodeURIComponent(searchTerm)}`);
      } else if (term.includes("booking") || term.includes("đặt tour")) {
        navigate(`/admin/booking?search=${encodeURIComponent(searchTerm)}`);
      } else if (term.includes("user") || term.includes("tài khoản")) {
        navigate(`/admin/user?search=${encodeURIComponent(searchTerm)}`);
      } else {
        navigate(`/admin/dashboard?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className={`aside-nav-modern${isAsideCollapsed ? " collapsed" : ""}${sidebarOpen ? " open" : ""}`}>
        {!isAsideCollapsed && (
          <div className="aside-header-modern">
            <div className="logo-container-modern">
              {/* <span className="logo-circle">VT</span> */}
              <h1 className="logo-title">Hi VietNam</h1>
            </div>
            <button className="toggle-button-modern" onClick={toggleAside}>
              ✕
            </button>
          </div>  
        )}
        {!isAsideCollapsed && (
          <ul className="aside-menu-modern">
            <li className="menu-section-modern">Trang chính</li>
            <li onClick={() => navigate("/admin/about")}
                className={location.pathname === "/admin/about" ? "active" : ""}>
              <span className="menu-icon-circle"><FaInfo /></span>
              <span className="menu-text-modern">Giới thiệu</span>
            </li>
            <li onClick={() => navigate("/admin/dashboard")}
                className={location.pathname === "/admin/dashboard" ? "active" : ""}>
              <span className="menu-icon-circle"><FaChartLine /></span>
              <span className="menu-text-modern">Bảng điều khiển</span>
            </li>
            <li
              ref={tourMenuRef}
              className={[
                "/admin/tour",
                "/admin/destination",
                "/admin/event",
                "/admin/itineraries",
                "/admin/schedules",
                "/admin/experience"
              ].includes(location.pathname)
                ? "active has-submenu"
                : "has-submenu"}
              onClick={() => setTourMenuOpen((open) => !open)}
              style={{ position: "relative" }}
            >
              <span className="menu-icon-circle"><FaMapMarkedAlt /></span>
              <span className="menu-text-modern">Chuyến đi</span>
              <span className="submenu-arrow">
                {tourMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </li>
            <div
              ref={submenuRef}
              style={{
                maxHeight: tourMenuOpen ? 500 : 0,
                opacity: tourMenuOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s"
              }}
            >
              {tourMenuOpen && (
                <ul className="submenu-modern">
                  <li
                    onClick={e => { e.stopPropagation(); navigate("/admin/tour"); }}
                    className={location.pathname === "/admin/tour" ? "active" : ""}
                  >
                    <span className="menu-icon-circle"><FaMapMarkedAlt /></span>
                    <span className="menu-text-modern">Chuyến đi</span>
                  </li>
                   <li
                    onClick={e => { e.stopPropagation(); navigate("/admin/schedules"); }}
                    className={location.pathname === "/admin/schedules" ? "active" : ""}
                  >
                    <span className="menu-icon-circle"><FaCalendarAlt /></span>
                    <span className="menu-text-modern">Lịch trình</span>
                  </li>
                  <li
                    onClick={e => { e.stopPropagation(); navigate("/admin/itineraries"); }}
                    className={location.pathname === "/admin/itineraries" ? "active" : ""}
                  >
                    <span className="menu-icon-circle"><FaListAlt /></span>
                    <span className="menu-text-modern">Chi tiết lịch trình</span>
                  </li>
                  <li
                    onClick={e => { e.stopPropagation(); navigate("/admin/destination"); }}
                    className={location.pathname === "/admin/destination" ? "active" : ""}
                  >
                    <span className="menu-icon-circle"><FaGlobeAsia /></span>
                    <span className="menu-text-modern">Điểm đến</span>
                  </li>
                  <li
                    onClick={e => { e.stopPropagation(); navigate("/admin/event"); }}
                    className={location.pathname === "/admin/event" ? "active" : ""}
                  >
                    <span className="menu-icon-circle"><FaCalendarAlt /></span>
                    <span className="menu-text-modern">Sự kiện</span>
                  </li>
                  <li
                    onClick={e => { e.stopPropagation(); navigate("/admin/experience"); }}
                    className={location.pathname === "/admin/experience" ? "active" : ""}
                  >
                    <span className="menu-icon-circle"><FaCamera /></span>
                    <span className="menu-text-modern">Trải nghiệm</span>
                  </li>
                </ul>
              )}
            </div>
            <li onClick={() => navigate("/admin/booking")}
                className={location.pathname === "/admin/booking" ? "active" : ""}>
              <span className="menu-icon-circle"><FaBook /></span>
              <span className="menu-text-modern">Chuyến đi đã đặt</span>
            </li>
            <li onClick={() => navigate("/admin/payments")}
                className={location.pathname === "/admin/payments" ? "active" : ""}>
              <span className="menu-icon-circle"><FaDollarSign /></span>
              <span className="menu-text-modern">Quản lý thanh toán</span>
            </li>
            <div className="account-section-modern">
              <li className="menu-section-modern">Trang tài khoản</li>
              <li
                className={["/admin/user", "/admin/logout"].includes(location.pathname) ? "active has-submenu" : "has-submenu"}
                onClick={() => setShowAccountMenu((prev) => !prev)}
                style={{ position: "relative" }}
              >
                <span className="menu-icon-circle"><FaUser /></span>
                <span className="menu-text-modern">Tài khoản</span>
                <span className="submenu-arrow">{showAccountMenu ? <FaChevronUp /> : <FaChevronDown />}</span>
              </li>
              {showAccountMenu && (
                <ul className="submenu-modern">
                  <li
                    onClick={e => { e.stopPropagation(); navigate("/admin/user"); setShowAccountMenu(false); }}
                    className={location.pathname === "/admin/user" ? "active" : ""}
                  >
                    <span className="menu-icon-circle"><FaUser /></span>
                    <span className="menu-text-modern">Tài khoản</span>
                  </li>
                  <li
                    onClick={e => { e.stopPropagation(); handleLogout(); setShowAccountMenu(false); }}
                  >
                    <span className="menu-icon-circle"><FaSignOutAlt /></span>
                    <span className="menu-text-modern">Đăng xuất</span>
                  </li>
                </ul>
              )}
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
        <div className="dashboard-topbar">
          <form className="dashboard-search-bar" onSubmit={handleDashboardSearch}>
            <input
              type="text"
              className="dashboard-search-input"
              placeholder="Tìm kiếm điểm đến, tour, sự kiện..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button className="dashboard-search-btn" type="submit">
              <FaSearch />
            </button>
          </form>
          <FaUser className="user-icon" onClick={toggleDropdown} />
        </div>
        {isAsideCollapsed && (
          <button className="toggle-button-main" onClick={toggleAside}>
            ☰
          </button>
        )}
        <div className="button-container">
          {showDropdown && (
            <div className="account-dropdown">
              <div className="account-dropdown-label">Tài khoản:</div>
              <div className="account-dropdown-email">{email}</div>
              <button
                onClick={() => navigate("/change-password")}
                className="account-dropdown-btn"
              >
                Đổi mật khẩu
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
          <p>Copyright © 2025 Vietnam Tourism. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;