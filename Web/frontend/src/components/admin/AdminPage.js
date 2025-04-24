// import React from "react";
// import { useLocation } from "react-router-dom";
// import AdminDashboard from "./AdminDashboard";
// import UserIndex from "./user/UserIndex";
// import UserRegister from "./user/UserRegister";

// const AdminPage = () => {
//   const location = useLocation();
//   const isRegisterPage = location.pathname.includes('/register');

//   return (
//     <AdminDashboard>
//       {isRegisterPage ? <UserRegister /> : <UserIndex />}
//     </AdminDashboard>
//   );
// };

// export default AdminPage;






import React from "react";
import { useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserIndex from "./user/UserIndex";
// import UserRegister from "./user/UserRegister";
// Import thêm các component khác

const ROUTE_COMPONENTS = {
  // register: UserRegister,
  // edit: UserEdit,         // Ví dụ component
  // view: UserView,         // Ví dụ component
  // role: UserRole,         // Ví dụ component
  default: UserIndex
};

const AdminPage = () => {
  const location = useLocation();
  const path = location.pathname.split('/').pop();
  
  const Component = ROUTE_COMPONENTS[path] || ROUTE_COMPONENTS.default;

  return (
    <AdminDashboard>
      <Component />
    </AdminDashboard>
  );
};

export default AdminPage;