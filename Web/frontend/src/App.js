import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/auth/Login";
// import Register from "./components/auth/Register";
// import UserDashboard from "./components/UserDashboard";
// import VietnamTourism from "./components/VietnamTourism/VietnamTourism";
import "./App.css";
import Whynotvietnam from "./components/Whynotvietnam";

const App = () => {
  // const isAuthenticated = !!localStorage.getItem("token");

  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Navigate to="/login" />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/register" element={<Register />} />
    //     <Route
    //       path="/dashboard"
    //       element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />}
    //     />

    //     <Route
    //       path="/tourism"
    //       element={isAuthenticated ? <VietnamTourism /> : <Navigate to="/login" />}
    //     />
    //   </Routes>
    // </Router>
    <Whynotvietnam />
  );
};

export default App;