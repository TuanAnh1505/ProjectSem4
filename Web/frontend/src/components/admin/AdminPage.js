import React from "react";
import AdminDashboard from "./AdminDashboard";
import UserIndex from "./user/UserIndex";

const AdminPage = () => {
  return (
    <AdminDashboard>
      <UserIndex />
    </AdminDashboard>
  );
};


export default AdminPage;
