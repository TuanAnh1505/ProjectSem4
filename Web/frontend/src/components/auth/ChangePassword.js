import React, { useState } from "react";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "../styles/user/ChangePassword.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        setError("Không tìm thấy email người dùng.");
        return;
      }
      const response = await axios.post("http://localhost:8080/api/auth/change-password", {
        email,
        currentPassword,
        newPassword,
      });
      setMessage(response.data || "Mật khẩu đã được thay đổi thành công.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="change-password-modern-card">
      <div className="modern-header">
        <div className="modern-lock-icon"><FaLock /></div>
        <div className="modern-title">Đổi mật khẩu</div>
      </div>
      <form onSubmit={handleSubmit} className="modern-form">
        <div className="modern-form-group">
          <label>Mật khẩu hiện tại</label>
          <div className="modern-input-wrap">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Mật khẩu hiện tại"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowCurrent((s) => !s)} className="modern-eye-icon">
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="modern-form-group">
          <label>Mật khẩu mới</label>
          <div className="modern-input-wrap">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowNew((s) => !s)} className="modern-eye-icon">
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="modern-form-group">
          <label>Xác nhận mật khẩu mới</label>
          <div className="modern-input-wrap">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowConfirm((s) => !s)} className="modern-eye-icon">
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        {message && (
          <div className="modern-alert modern-success">
            <FaCheckCircle className="modern-alert-icon" /> {message}
          </div>
        )}
        {error && (
          <div className="modern-alert modern-error">
            <FaExclamationCircle className="modern-alert-icon" /> {error}
          </div>
        )}
        <button type="submit" className="modern-submit-btn">
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;