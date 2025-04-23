import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserDashboard from "./components/user/UserDashboard";
import ActivateAccount from "./components/auth/ActivateAccount";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ChangePassword from "./components/auth/ChangePassword";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserIndex from "./components/admin/user/UserIndex";
import DashboardPage from "./components/admin/DashboardPage";
import AdminPage from "./components/admin/AdminPage";

import "./App.css";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate" element={<ActivateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin-dashboard"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/user"
          element={isAuthenticated ? <UserIndex /> : <Navigate to="/login" />}
        />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/user" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;



