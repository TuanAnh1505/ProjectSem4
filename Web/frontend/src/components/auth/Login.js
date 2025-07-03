import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPlaneDeparture, FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/user/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get("message");
    if (message) {
      setSuccess(message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });
      setSuccess("Đăng nhập thành công!");
      const { token, role, userId, publicId, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem('userId', userId);
      localStorage.setItem("publicId", publicId);
      localStorage.setItem("role", role);
      localStorage.setItem('user', JSON.stringify(user));

     
      if (role === 'GUIDE') {
        
        navigate('/');
      } else {
        navigate("/");
      }

      toast.success('Đăng nhập thành công!');
    } catch (err) {
      let errorMsg = err.response?.data?.message || err.response?.data || "Có lỗi xảy ra!";
      
      if (typeof errorMsg === 'string' && (errorMsg.includes('User not found'))) {
        errorMsg = 'Tài khoản không tồn tại hoặc chưa được đăng ký.';
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form-section">
          <div className="login-header">
            <div className="login-brand">
              <img
                src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
                alt="Travel Tour Logo"
                className="login-logo"
              />
              <h1 className="login-title">
                TravelTour
                <span className="travel-icon"><FaPlaneDeparture /></span>
              </h1>
            </div>
            <button onClick={() => navigate("/")} className="login-close">✕</button>
          </div>

          <h2 className="login-welcome">Chào mừng trở lại!</h2>
          <p className="login-subtitle">
            Đăng nhập để khám phá những điểm đến tuyệt vời
          </p>

          {success && <p className="login-success">{success}</p>}
          {error && (
            <>
              <p className="login-error">{error}</p>
              {(error.includes("Tài khoản chưa được kích hoạt") || error.includes("Tài khoản không tồn tại")) && (
                <button
                  className="login-resend-activation"
                  style={{ marginTop: 8, color: '#1976d2', background: 'none', border: 'none', cursor: error.includes('không tồn tại') ? 'not-allowed' : 'pointer', textDecoration: 'underline' }}
                  onClick={async () => {
                    if (error.includes('không tồn tại')) return;
                    try {
                      await axios.post('http://localhost:8080/api/auth/resend-activation', { email, isApp: false });
                      toast.success('Đã gửi lại email kích hoạt. Vui lòng kiểm tra hộp thư.');
                    } catch (e) {
                      toast.error('Không thể gửi lại email kích hoạt.');
                    }
                  }}
                  type="button"
                  disabled={error.includes('không tồn tại')}
                >
                  Gửi lại email kích hoạt
                </button>
              )}
            </>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-input-group">
              <div className="login-input-wrapper">
                <FaEnvelope className="login-input-icon" />
                <input
                  type="email"
                  className="login-input"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-input-group">
              <div className="login-input-wrapper">
                <FaLock className="login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="login-password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Đăng nhập
            </button>
          </form>

          <div className="login-divider">
            <span>hoặc đăng nhập với</span>
          </div>

          <div className="login-social">
            <button className="login-social-btn google" onClick={handleGoogleLogin}>
              <FaGoogle />
              <span>Google</span>
            </button>
            <button className="login-social-btn facebook" onClick={handleFacebookLogin}>
              <FaFacebook />
              <span>Facebook</span>
            </button>
          </div>

          <div className="login-footer">
            <button onClick={() => navigate("/forgot-password")} className="login-link">
              Quên mật khẩu?
            </button>
            <div className="login-register">
              <span>Chưa có tài khoản?</span>
              <button onClick={() => navigate("/register")} className="login-link">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
        <div className="login-image-section"></div>
      </div>
    </div>
  );
};

export default Login;