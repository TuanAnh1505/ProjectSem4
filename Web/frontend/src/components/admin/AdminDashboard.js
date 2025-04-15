import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import UserIndex from "./user/UserIndex";
import "../styles/AdminDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAsideCollapsed, setIsAsideCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard"); // State to track the active page
  const [chartData, setChartData] = useState({
    labels: ["Đã kích hoạt", "Chưa kích hoạt"],
    datasets: [
      {
        label: "Số lượng tài khoản",
        data: [0, 0],
        backgroundColor: ["#28a745", "#dc3545"],
        hoverBackgroundColor: ["#218838", "#c82333"],
      },
    ],
  });

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/admin/account-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setChartData({
          labels: ["Đã kích hoạt", "Chưa kích hoạt"],
          datasets: [
            {
              label: "Số lượng tài khoản",
              data: [data.activatedAccounts, data.nonActivatedAccounts],
              backgroundColor: ["#28a745", "#dc3545"],
              hoverBackgroundColor: ["#218838", "#c82333"],
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
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
            <li onClick={() => setActivePage("dashboard")}>
              <span className="menu-icon">📊</span>
              <span className="menu-text">Dashboard</span>
            </li>
            <div className="account-section">
              <li className="menu-section">ACCOUNT PAGES</li>
              <li onClick={() => setActivePage("user")}>
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
              <button onClick={handleLogout} className="dropdown-item">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
        {activePage === "dashboard" ? (
          <>
            <h1>Trang Dành Cho Quản Trị Viên (ADMIN)</h1>
            <p>Chào mừng bạn đến với dashboard dành cho quản trị viên!</p>
            <div className="chart-container">
              <h4>Biểu đồ số lượng tài khoản</h4>
              <Pie data={chartData} options={chartOptions} />
            </div>
          </>
        ) : (
          <UserIndex />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
