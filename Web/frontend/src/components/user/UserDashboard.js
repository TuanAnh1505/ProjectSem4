import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user/UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Retrieve the email from localStorage
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("roles");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  
  return (
    <div className="dashboard">
      <div className="button-container">
        <div className="user-icon" onClick={toggleDropdown}>
          👤 {/* Replace with an actual icon if needed */}
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
      <h1>Trang Dành Cho Người Dùng (USER)</h1>
      <p>Chào mừng bạn đến với dashboard dành cho người dùng!</p>
    </div>
  );
};

export default UserDashboard;
