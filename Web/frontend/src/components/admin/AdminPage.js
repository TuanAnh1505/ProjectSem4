import React from "react";
import { useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserIndex from "./user/UserIndex";
import DestinationIndex from "./destination/DestinationIndex";
import AddDestination from "./destination/AddDestination";
import UpdateDestination from "./destination/UpdateDestination";
import EventIndex from "./event/EventIndex";
import AddEvent from "./event/AddEvent";
import UpdateEvent from "./event/UpdateEvent";

const AdminPage = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Xác định component dựa trên path
  const getComponent = () => {
    // Kiểm tra cả 2 trường hợp destination và destinations
    if (pathSegments.includes('destination') || pathSegments.includes('destinations')) {
      if (pathSegments.includes('add')) {
        return <AddDestination />;
      }
      if (pathSegments.includes('edit')) {
        return <UpdateDestination />;
      }
      return <DestinationIndex />;
    }

    if (pathSegments.includes('event') || pathSegments.includes('events')) {
      if (pathSegments.includes('add')) {
        return <AddEvent />;
      }
      if (pathSegments.includes('edit')) {
        return <UpdateEvent />;
      }
      return <EventIndex />;
    }
    // Mặc định hiển thị UserIndex nếu không match với destinations
    return <UserIndex />;
  };

  return (
    <AdminDashboard>
      {getComponent()}
    </AdminDashboard>
  );
};

export default AdminPage;