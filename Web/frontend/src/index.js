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
      console.log("(401) Unauthorized error, current path:", window.location.pathname, "token:", token ? "có" : "không");
      if (window.location.pathname !== "/login") {
         console.log("(401) Chuyển hướng về /login");
         localStorage.removeItem("token");
         localStorage.removeItem("userId");
         window.location.href = "/login";
      } else {
         console.log("(401) Đang ở trang login, không chuyển hướng (tránh vòng lặp)");
      }
    }
    return Promise.reject(error);
  }
);

reportWebVitals();