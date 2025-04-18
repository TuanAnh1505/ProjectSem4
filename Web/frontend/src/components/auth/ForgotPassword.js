import React, { useState } from "react";
import axios from "axios";
import "../styles/ForgotPassword.css";

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
    <div className="forgot-password-container">
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          Gửi email đặt lại mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
