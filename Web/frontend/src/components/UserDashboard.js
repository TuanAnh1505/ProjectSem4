import React from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>Trang Dành Cho Người Dùng (USER)</h1>
      <p>Chào mừng bạn đến với dashboard dành cho người dùng!</p>
      <button onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
    </div>
  );
};

export default UserDashboard;