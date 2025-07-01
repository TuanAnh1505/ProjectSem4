import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/VietnamTourism/index';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PlacesToGo from './components/PlaceToGo/PlaceToGo';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ActivateAccount from './components/auth/ActivateAccount';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ChangePassword from './components/auth/ChangePassword';
import UserIndex from './components/admin/user/UserIndex';
import DashboardPage from './components/admin/DashboardPage';
import AdminPage from './components/admin/AdminPage';
import TourDashboard from './components/tour/TourDashboard';
import TourDetailDashboard from './components/tour/TourDetailDashboard';
import BookingPassenger from './components/booking/BookingPassenger';

import Payment from './pages/Payment';
import UpdateInfoUser from './components/auth/UpdateInfoUser';
import GuidePage from './components/guide/GuidePage';
import GuideDemo from './components/guide/GuideDemo';
import GuideAccessDenied from './components/guide/GuideAccessDenied';
import AutoRedirect from './components/auth/AutoRedirect';
import './App.css';
import BookingConfirmation from './components/booking/BookingConfirmation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Feedback from './components/feedback/Feedback';
// import ScheduleChangeRequests from './components/admin/schedule/ScheduleChangeRequests';
// import các component khác nếu có
// Layout component that wraps tourism pages with Header and Footer
const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

// Component to redirect users based on their role
const RoleBasedRedirect = () => {
  const userRole = localStorage.getItem('role');
  
  // Guide và Admin đều có thể truy cập trang chính, không redirect ngay lập tức
  // if (userRole === 'GUIDE') {
  //   return <Navigate to="/guide" />;
  // }
  
  // Admin có thể truy cập trang chính, không redirect ngay lập tức
  // if (userRole === 'ADMIN') {
  //   return <Navigate to="/admin/dashboard" />;
  // }
  
  // For all users (including guide and admin), show the home page
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

// ProtectedRoute component for authenticated routes
const ProtectedRoute = ({ element, requiredRole }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Nếu user là GUIDE nhưng đang cố truy cập trang admin, hiển thị trang access denied
    if (userRole === 'GUIDE' && requiredRole === 'ADMIN') {
      return <GuideAccessDenied />;
    }
    // Nếu user là ADMIN nhưng đang cố truy cập trang admin mà không có quyền, redirect về admin dashboard
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" />;
    }
    // Các trường hợp khác redirect về trang chính
    return <Navigate to="/" />;
  }

  // Nếu không có requiredRole hoặc user có đúng role, cho phép truy cập
  // Admin và Guide có thể truy cập tất cả các trang (cả trang du lịch và trang admin/guide)
  return element;
};

const App = () => {
  return (
    <Router>
      <div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <Routes>
          {/* Tourism-related routes */}
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="/live-fully" element={
            <Layout>
              <ProtectedRoute element={<Home />} />
            </Layout>
          } />
          <Route path="/places-to-go" element={
            <Layout>
              <ProtectedRoute element={<PlacesToGo />} />
            </Layout>
          } />
          <Route path="/tour-dashboard" element={
            <Layout>
              <TourDashboard />
            </Layout>
          } />
          <Route path="/tour-dashboard/detail/:tourId" element={
            <Layout>
              <TourDetailDashboard />
            </Layout>
          } />
          <Route path="/offers" element={
            <Layout>
              <ProtectedRoute element={<Home />} />
            </Layout>
          } />
          <Route path="/green-travel" element={
            <Layout>
              <ProtectedRoute element={<Home />} />
            </Layout>
          } />

          {/* Protected routes that require authentication */}
          <Route path="/booking-passenger" element={
            <Layout>
              <ProtectedRoute element={<BookingPassenger />} />
            </Layout>
          } />
          <Route path="/booking-confirmation" element={
            <Layout>
              <ProtectedRoute element={<BookingConfirmation />} />
            </Layout>
          } />
         
         
          <Route path="/payment/:bookingId" element={
            <Layout>
              <ProtectedRoute element={<Payment />} />
            </Layout>
          } />
          <Route path="/feedback" element={
            <Layout>
              <ProtectedRoute element={<Feedback />} />
            </Layout>
          } />
          <Route path="/change-password" element={
            <Layout>
              <ProtectedRoute element={<ChangePassword />} />
            </Layout>
          } />

          {/* Authentication and user routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate" element={<ActivateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route 
            path="/account/:publicId" 
            element={
              <Layout>
                <ProtectedRoute element={<UpdateInfoUser />} />
              </Layout>
            } 
          />
          <Route
            path="/tour-dashboard/detail/:tourId"
            element={<ProtectedRoute element={<TourDetailDashboard />} />}
          />
          <Route
            path="/booking-passenger"
            element={<ProtectedRoute element={<BookingPassenger />} />}
          />

            {/* Admin routes */}
            <Route
              path="/admin/about"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/user"
              element={<ProtectedRoute element={<UserIndex />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute element={<DashboardPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/user"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            {/* <Route
            path="/admin/user/register"
            element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
          /> */}

            {/* Destination */}
            <Route
              path="/admin/destination"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/destination/add"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/destination/detail/:destinationId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/destination/edit/:destinationId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/destination/:destinationId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />

            {/* Event */}
            <Route
              path="/admin/event"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/event/add"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/event/detail/:eventId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/event/edit/:eventId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/event/:eventId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />

            {/* Tour */}
            <Route
              path="/admin/tour"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/tour/add"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/tour/detail/:tourId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/tour/edit/:tourId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/tour/schedules/:tourId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/tour/:tourId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/tour/schedules/:tourId/:scheduleId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />

            {/* Itinerary */}
            <Route
              path="/admin/itineraries"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/itineraries/add"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/itineraries/detail/:itineraryId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/itineraries/edit/:itineraryId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/itineraries/:itineraryId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />

            {/* Schedule */}
            <Route
              path="/admin/schedules"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/schedules/add"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/schedules/detail/:scheduleId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/schedules/edit/:scheduleId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/schedules/:scheduleId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />

            {/* Booking */}
            <Route
              path="/admin/booking"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/booking/detail/:bookingId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />

            {/* Tour Guide */}
            <Route
              path="/admin/tour-guide"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/tour-guide/add"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />
            <Route
              path="/admin/tour-guide/edit/:guideId"
              element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
            />

          {/* Payment routes */}
          <Route
            path="/payment/:bookingId"
            element={
              <Layout>
                <Payment />
              </Layout>
            }
          />
          <Route
            path="/admin/payments"
            element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
          />
          {/* Experience */}
          <Route
            path="/admin/experience"
            element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
          />

          <Route
            path="/admin/feedback"
            element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
          />

          <Route path="/feedback" element={<Feedback />} />

          {/* Notification Detail Route */}


          <Route
            path="/admin/assignment"
            element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
          />

          {/* Schedule Change Requests */}
          <Route
            path="/admin/schedule-change-request"
            element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
          />

          {/* Guide routes */}
          <Route
            path="/guide"
            element={<ProtectedRoute element={<GuidePage />} requiredRole="GUIDE" />}
          />
          <Route
            path="/guide/*"
            element={<ProtectedRoute element={<GuidePage />} requiredRole="GUIDE" />}
          />

          {/* Guide Demo route */}
          <Route
            path="/guide-demo"
            element={<GuideDemo />}
          />

          {/* Auto redirect route */}
          <Route
            path="/redirect"
            element={<AutoRedirect />}
          />

        

        
        </Routes>
      </div>
    </Router>
  );
};

export default App;