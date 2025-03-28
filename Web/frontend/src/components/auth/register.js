import React, { useState } from "react";
import "../../css/auth/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    alert("Đăng ký thành công!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button type="submit" className="w-full bg-red-500 text-white p-2 rounded">Đăng ký</button>
        </form>
        <p className="login-text">
          Đã có tài khoản?{" "}
          <button onClick={switchToLogin} className="login-link">
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
