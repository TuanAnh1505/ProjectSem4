import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPlaneDeparture, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import axios from "axios";
import "../styles/user/Register.css";

// Cấu hình axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

const API_REGISTER_URL = "/api/auth/register";
const SUCCESS_MESSAGE = "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.";
const ERROR_MESSAGE = "Có lỗi xảy ra!";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSpaces: true
  });
  const [emailExists, setEmailExists] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [fullNameError, setFullNameError] = useState("");
  const navigate = useNavigate();

  // Validation mật khẩu real-time
  useEffect(() => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noSpaces: !/\s/.test(password)
    };
    setPasswordValidation(validation);
  }, [password]);

  // Kiểm tra email tồn tại
  useEffect(() => {
    const checkEmail = async () => {
      if (email && emailValid) {
        try {
          const response = await axios.get(`/api/auth/check-email?email=${email}`);
          setEmailExists(response.data.exists);
        } catch (error) {
          console.log('Email check error:', error);
        }
      }
    };

    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [email, emailValid]);

  // Validation email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email) || email === "");
  }, [email]);

  // Validation họ tên real-time
  useEffect(() => {
    if (fullName && (fullName.length < 2 || !/^([\p{L}\s]+)$/u.test(fullName))) {
      setFullNameError("Họ và tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái, khoảng trắng.");
    } else {
      setFullNameError("");
    }
  }, [fullName]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(""); // Clear error when user types
    if (setter === setEmail) {
      setEmailExists(false); // Reset emailExists khi thay đổi email
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(valid => valid);
  };

  const isFormValid = () => {
    return fullName.trim() && 
           !fullNameError &&
           emailValid && 
           !emailExists && 
           isPasswordValid() && 
           password === confirmPassword &&
           password.length > 0 &&
           confirmPassword.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isFormValid()) {
      setError("Vui lòng kiểm tra lại thông tin đăng ký.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(API_REGISTER_URL, 
        {
          fullName,
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setSuccess(SUCCESS_MESSAGE);
        // Redirect sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Ưu tiên lấy message chi tiết từ backend nếu có
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        ERROR_MESSAGE;
      setError(typeof errorMessage === 'string' ? errorMessage : ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  const getValidationIcon = (isValid) => {
    return isValid ? <FaCheck className="validation-icon valid" /> : <FaTimes className="validation-icon invalid" />;
  };

  const getPasswordStrength = () => {
    const validCount = Object.values(passwordValidation).filter(Boolean).length;
    if (validCount <= 2) return { text: "Yếu", color: "#e74c3c", width: "25%" };
    if (validCount <= 4) return { text: "Trung bình", color: "#f39c12", width: "50%" };
    if (validCount <= 5) return { text: "Khá", color: "#f1c40f", width: "75%" };
    return { text: "Mạnh", color: "#27ae60", width: "100%" };
  };

  const passwordStrength = getPasswordStrength();

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
                className={`register-input ${fullNameError ? 'error' : ''}`}
                placeholder="Họ và tên"
                value={fullName}
                onChange={handleInputChange(setFullName)}
                required
              />
              {fullNameError && (
                <div className="validation-message error">
                  {fullNameError}
                </div>
              )}
            </div>
            
            <div className="register-input-group">
              <input
                type="email"
                className={`register-input ${email && !emailValid ? 'error' : ''} ${emailExists ? 'error' : ''}`}
                placeholder="Nhập email"
                value={email}
                onChange={handleInputChange(setEmail)}
                required
              />
              {email && !emailValid && (
                <div className="validation-message error">
                  <FaExclamationTriangle /> Email không hợp lệ
                </div>
              )}
              {emailExists && (
                <div className="validation-message error">
                  <FaExclamationTriangle /> Email đã được sử dụng
                </div>
              )}
            </div>

            <div className="register-input-group register-password-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`register-input ${password && !isPasswordValid() ? 'error' : ''}`}
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

            {/* Password Requirements */}
            {password && (
              <div className="password-requirements">
                <h4>Yêu cầu mật khẩu:</h4>
                <div className="requirement-item">
                  {getValidationIcon(passwordValidation.length && passwordValidation.uppercase && passwordValidation.lowercase)}
                  <span>Ít nhất 8 ký tự ít nhất 1 ký tự hoa 1 ký tự thường</span>
                </div>
                <div className="requirement-item">
                  {getValidationIcon(passwordValidation.number)}
                  <span>Có số</span>
                </div>
                <div className="requirement-item">
                  {getValidationIcon(passwordValidation.special)}
                  <span>Có ký tự đặc biệt (!@#$%^&*)</span>
                </div>
                <div className="requirement-item">
                  {getValidationIcon(passwordValidation.noSpaces)}
                  <span>Không có khoảng trắng</span>
                </div>
              </div>
            )}

            <div className="register-input-group register-password-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`register-input ${confirmPassword && password !== confirmPassword ? 'error' : ''}`}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                required
              />
              <span
                className="register-password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {confirmPassword && password !== confirmPassword && (
              <div className="validation-message error">
                <FaExclamationTriangle /> Mật khẩu xác nhận không khớp
              </div>
            )}

            {error && <p className="register-error-message">{error}</p>}
            {success && <p className="register-success-message">{success}</p>}
            
            <button 
              type="submit" 
              className={`register-btn ${!isFormValid() || isLoading ? 'disabled' : ''}`}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-inline"></span>
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
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