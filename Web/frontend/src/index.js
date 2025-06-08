import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401)) {
      const token = localStorage.getItem("token");
      const currentPath = window.location.pathname;
      
      // Danh sách các route cần bảo vệ (yêu cầu đăng nhập)
      const protectedRoutes = [
        '/booking-passenger',
        '/booking-confirmation',
        '/momo-payment',
        '/payment',
        '/account',
        '/admin'
      ];

      // Kiểm tra xem route hiện tại có phải là protected route không
      const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));

      if (isProtectedRoute && currentPath !== "/login") {
        console.log("(401) Protected route, redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      } else {
        console.log("(401) Public route, no redirect needed");
      }
    }
    return Promise.reject(error);
  }
);

axios.interceptors.request.use((config) => {
  // Endpoint public không thêm Authorization
  const publicEndpoints = [
    '/api/tours',
    '/api/itineraries',
    '/api/tour-status',
    '/api/tours/random',
  ];
  // Nếu là endpoint public thì không thêm Authorization
  if (publicEndpoints.some(endpoint => config.url.startsWith(endpoint) || config.url.includes(endpoint + '/'))) {
    return config;
  }
  // Endpoint cần bảo vệ
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

reportWebVitals();