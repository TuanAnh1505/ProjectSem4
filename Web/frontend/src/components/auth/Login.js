import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      setSuccess("Đăng nhập thành công!");
      localStorage.setItem("token", response.data.token);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Đăng nhập</h2>
          <button onClick={() => navigate("/")} className="close-button">
            ✕
          </button>
        </div>
        <p className="modal-subtitle">
          Hoặc đăng nhập bằng số điện thoại, email
        </p>
        <form onSubmit={handleSubmit}>
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
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="submit-button">
Đăng nhập
          </button>
        </form>
        <div className="modal-footer">
          <p>
            Chưa có tài khoản?{" "}
            <button
              onClick={() => navigate("/register")}
              className="link-button"
            >
              Đăng ký tài khoản
            </button>
          </p>
          <button className="link-button">Khôi phục mật khẩu</button>
        </div>
      </div>
    </div>
  );
};

export default Login;