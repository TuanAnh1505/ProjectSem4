import React from "react";
import { FaMapMarkedAlt, FaUsers, FaChartBar, FaLock, FaSearch, FaSuitcaseRolling, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/admin/AboutAdmin.css";

const AboutAdmin = () => {
  return (
    <div className="about-admin-container">
      <div className="about-admin-card about-admin-glass">
        <div className="about-admin-header">
          <FaSuitcaseRolling className="about-admin-mainicon" />
          <h1 className="about-admin-title">Chào mừng đến với <span className="about-admin-highlight">Vietnam Tourism Admin</span></h1>
          <p className="about-admin-slogan">Nền tảng quản trị tour du lịch hiện đại, bảo mật và thân thiện!</p>
        </div>
        <div className="about-admin-content">
          <div className="about-admin-section">
            <h2 className="about-admin-section-title"><FaMapMarkedAlt /> Chức năng nổi bật</h2>
            <ul className="about-admin-list">
              <li><FaMapMarkedAlt className="about-admin-list-icon" /> Quản lý Tour, Điểm đến, Sự kiện, Lịch trình, Lịch tour</li>
              <li><FaUsers className="about-admin-list-icon" /> Quản lý khách hàng, tài khoản admin, phân quyền</li>
              <li><FaChartBar className="about-admin-list-icon" /> Thống kê doanh thu, số lượng tour, người dùng, đặt tour</li>
              <li><FaLock className="about-admin-list-icon" /> Bảo mật, đổi mật khẩu, phân quyền truy cập</li>
              <li><FaSearch className="about-admin-list-icon" /> Tìm kiếm thông minh, giao diện responsive</li>
            </ul>
          </div>
          <div className="about-admin-section">
            <h2 className="about-admin-section-title">🎯 Mục tiêu</h2>
            <ul className="about-admin-list">
              <li>Đơn giản hóa quy trình quản lý tour du lịch</li>
              <li>Tăng hiệu quả vận hành, tiết kiệm thời gian</li>
              <li>Đảm bảo an toàn dữ liệu, bảo mật thông tin khách hàng</li>
              <li>Hỗ trợ ra quyết định nhanh chóng với báo cáo trực quan</li>
            </ul>
          </div>
        </div>
        <div className="about-admin-contact">
          <h2 className="about-admin-section-title">Liên hệ</h2>
          <ul className="about-admin-list">
            <li><FaEnvelope className="about-admin-list-icon" /> Email: contact@vietnamtourism.com</li>
            <li><FaPhone className="about-admin-list-icon" /> Phone: +84 123 456 789</li>
            <li><FaMapMarkerAlt className="about-admin-list-icon" /> Address: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</li>
          </ul>
        </div>
        <div className="about-admin-footer">
          <span>🚀 Chúc bạn quản trị thành công và phát triển hệ thống du lịch ngày càng lớn mạnh!</span>
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin; 