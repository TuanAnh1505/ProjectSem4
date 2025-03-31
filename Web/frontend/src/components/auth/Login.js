import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Login successful!');
                console.log('Token:', data); // Handle token storage
                if (data.role === 'USER') {
                    navigate('/user-dashboard');
                } else {
                    alert('Access denied: Role not supported');
                }
            } else {
                console.error('API Error:', data);
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('An error occurred');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <button className="close-button">×</button>
                <h2>Đăng nhập</h2>
                <p>Hoặc đăng nhập bằng số điện thoại, email</p>
                
                <div className="email-container">
                    <input
                        type="text"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="password-container">
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="eye-button">👁</button>
                </div>
                <button className="login-button" onClick={handleSubmit}>
                    Đăng nhập
                </button>
                <a href="/" className="forgot-password">Khôi phục mật khẩu</a>
                <p className="signup-text">
                    Chưa có tài khoản? <a href="/" className="signup-link">Đăng ký tài khoản</a>
                </p>
            </div>
        </div>
    );
}

export default Login;