import React, { useState } from "react";
import axios from "axios";
import "../styles/user/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", null, {
        params: { email },
      });
      setMessage(response.data || "Email đặt lại mật khẩu đã được gửi.");
    } catch (err) {
      setError(err.response?.data || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2 className="forgot-header">Quên mật khẩu</h2>
        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-input-group">
            <input
              type="email"
              className="forgot-input"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className="forgot-success">{message}</p>}
          {error && <p className="forgot-error">{error}</p>}
          <button type="submit" className="forgot-btn">
            Gửi email đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
