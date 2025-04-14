import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserDashboard from "./components/user/UserDashboard";
import ActivateAccount from "./components/auth/ActivateAccount";
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
        <Route
          path="/dashboard"
          element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;



