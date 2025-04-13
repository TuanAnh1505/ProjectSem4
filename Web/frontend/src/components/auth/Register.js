// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/Register.css";

// const Register = () => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       await axios.post("http://localhost:8080/api/auth/register", {
//         fullName,
//         email,
//         password,
//         phone,
//         address,
//       });
//       setSuccess("Đăng ký thành công!");
//       setTimeout(() => navigate("/login"), 1000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Có lỗi xảy ra!");
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Đăng ký</h2>
//           <button onClick={() => navigate("/")} className="close-button">
//             ✕
//           </button>
//         </div>
//         <p className="modal-subtitle">
//           Hoặc đăng ký bằng số điện thoại, email
//         </p>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="text"
//               placeholder="Họ và tên"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="email"
//               placeholder="Nhập email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           {/* <div className="form-group password-group">
//             <input
//               type="password"
//               placeholder="Mật khẩu"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <span className="password-toggle">👁️</span>
//           </div> */}
//                      <div className="form-group password-group">
//                 <input
//                     type={showPassword ? "text" : "password"} // Thay đổi kiểu input
//                     placeholder="Mật khẩu"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <span
//                     className="password-toggle"
//                     onClick={() => setShowPassword(!showPassword)} // Toggle hiển thị mật khẩu
//                     style={{ cursor: "pointer" }} // Để người dùng biết có thể click
//                 >
//                     {showPassword ? "👁️" : "🙈"} {/* Thay đổi icon */}
//                 </span>
//             </div>
//           <div className="form-group">
//             <input
//               type="text"
//               placeholder="Số điện thoại"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="text"
//               placeholder="Địa chỉ"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//             />
//           </div>
//           {error && <p className="error-message">{error}</p>}
//           {success && <p className="success-message">{success}</p>}
//           <button type="submit" className="submit-button">
//             Đăng ký
//           </button>
//         </form>
//         <div className="modal-footer">
//           <p>
//             Đã có tài khoản?{" "}
//             <button
//               onClick={() => navigate("/login")}
//               className="link-button"
//             >
//               Đăng nhập
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const API_REGISTER_URL = "http://localhost:8080/api/auth/register";
const API_ACTIVATE_URL = "http://localhost:8080/api/auth/activate";
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
  const [userId, setUserId] = useState(null);
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
      const response = await axios.post(API_REGISTER_URL, {
        fullName,
        email,
        password,
        phone,
        address,
      });
      setSuccess(SUCCESS_MESSAGE);
      setUserId(response.data.userId); // Assuming the API returns the userId
    } catch (err) {
      setError(err.response?.data?.message || ERROR_MESSAGE);
    }
  };

  const handleActivation = async () => {
    try {
      await axios.get(API_ACTIVATE_URL, {
        params: { userId }
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || ERROR_MESSAGE);
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
              onChange={handleInputChange(setFullName)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={handleInputChange(setEmail)}
              required
            />
          </div>
          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? "👁️" : "🙈"}
            </span>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phone}
              onChange={handleInputChange(setPhone)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Địa chỉ"
              value={address}
              onChange={handleInputChange(setAddress)}
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
            <button onClick={() => navigate("/login")} className="link-button">
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;