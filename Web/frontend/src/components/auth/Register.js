import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPlaneDeparture } from 'react-icons/fa';
import axios from "axios";
import "../styles/user/Register.css";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

const API_REGISTER_URL = "/api/auth/register";
const SUCCESS_MESSAGE = "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.";
const ERROR_MESSAGE = "Có lỗi xảy ra!";

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

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(API_REGISTER_URL, 
        {
          fullName,
          email,
          password,
          phone,
          address,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (response.data) {
        setSuccess(SUCCESS_MESSAGE);

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
 
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        ERROR_MESSAGE;
      setError(typeof errorMessage === 'string' ? errorMessage : ERROR_MESSAGE);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-image-section"></div>
        <div className="register-form-section">
          <div className="register-header">
            <div className="register-brand">
              <img
                src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
                alt="Travel Tour Logo"
                className="register-logo"
              />
              <h1 className="register-title">
                TravelTour
                <span className="travel-icon"><FaPlaneDeparture /></span>
              </h1>
            </div>
            <button onClick={() => navigate("/")} className="register-close">✕</button>
          </div>
          <h2 className="register-welcome">Chào mừng bạn!</h2>
          <p className="register-subtitle">
            Đăng ký để bắt đầu hành trình khám phá những điểm đến tuyệt vời
          </p>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-input-group">
              <input
                type="text"
                className="register-input"
                placeholder="Họ và tên"
                value={fullName}
                onChange={handleInputChange(setFullName)}
                required
              />
            </div>
            <div className="register-input-group">
              <input
                type="email"
                className="register-input"
                placeholder="Nhập email"
                value={email}
                onChange={handleInputChange(setEmail)}
                required
              />
            </div>
            <div className="register-input-group register-password-group">
              <input
                type={showPassword ? "text" : "password"}
                className="register-input"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={handleInputChange(setPassword)}
                required
              />
              <span
                className="register-password-toggle"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="register-input-group">
              <input
                type="text"
                className="register-input"
                placeholder="Số điện thoại"
                value={phone}
                onChange={handleInputChange(setPhone)}
              />
            </div>
            <div className="register-input-group">
              <input
                type="text"
                className="register-input"
                placeholder="Địa chỉ"
                value={address}
                onChange={handleInputChange(setAddress)}
              />
            </div>
            {error && <p className="register-error-message">{error}</p>}
            {success && <p className="register-success-message">{success}</p>}
            <button type="submit" className="register-btn">
              Đăng ký
            </button>
          </form>
          <div className="register-footer">
            <span>Đã có tài khoản?</span>
            <button onClick={() => navigate("/login")} className="register-link">
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;