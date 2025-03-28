import React from "react";
import "../../css/auth/Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <button className="close-button">×</button>
        <h2>Đăng nhập</h2>
        <p>Hoặc đăng nhập bằng số điện thoại, email</p>
        <input type="text" placeholder="Nhập số điện thoại hoặc email" />
        <div className="password-container">
          <input type="password" placeholder="Mật khẩu" />
          <button className="eye-button">👁</button>
        </div>
        <button className="login-button">Đăng nhập</button>
        <a href="/" className="forgot-password">Khôi phục mật khẩu</a>
        <p className="signup-text">
          Chưa có tài khoản? <a href="/" className="signup-link">Đăng ký tài khoản</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
