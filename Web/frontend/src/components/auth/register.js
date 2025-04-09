import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        fullName,
        email,
        password,
        phone,
        address,
      });
      setSuccess("Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Đăng ký</h2>
          <button onClick={() => navigate("/")} className="close-button">
            ✕
          </button>
        </div>
        <p className="modal-subtitle">
          Hoặc đăng ký bằng số điện thoại, email
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* <div className="form-group password-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="password-toggle">👁️</span>
          </div> */}
                     <div className="form-group password-group">
                <input
                    type={showPassword ? "text" : "password"} // Thay đổi kiểu input
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)} // Toggle hiển thị mật khẩu
style={{ cursor: "pointer" }} // Để người dùng biết có thể click
                >
                    {showPassword ? "👁️" : "🙈"} {/* Thay đổi icon */}
                </span>
            </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="submit-button">
            Đăng ký
          </button>
        </form>
        <div className="modal-footer">
          <p>
            Đã có tài khoản?{" "}
            <button
              onClick={() => navigate("/login")}
              className="link-button"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;