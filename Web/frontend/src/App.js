import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/VietnamTourism/index';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PlacesToGo from './components/PlaceToGo/PlaceToGo';
import ThingsToDo from './components/ThingToDo/ThingsToDo';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserDashboard from './components/user/UserDashboard';
import ActivateAccount from './components/auth/ActivateAccount';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ChangePassword from './components/auth/ChangePassword';
import AdminDashboard from './components/admin/AdminDashboard';
import UserIndex from './components/admin/user/UserIndex';
import DashboardPage from './components/admin/DashboardPage';
import AdminPage from './components/admin/AdminPage';
import TourDashboard from './components/tour/TourDashboard';
import TourDetailDashboard from './components/tour/TourDetailDashboard';
import BookingPassenger from './components/booking/BookingPassenger';
import MomoPaymentPage from './components/payment/MomoPaymentPage';
import BookingConfirmation from './components/booking/BookingConfirmation';
import './App.css';
import PlanYourTrip from './components/PlanYourTrip/PlanYourTrip';
import Tourbooking from './components/TourBooking/Tourbooking';
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

// ProtectedRoute component for authenticated routes
const ProtectedRoute = ({ element, requiredRole }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return element;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Tourism-related routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/live-fully" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/places-to-go" element={
          <Layout>
            <PlacesToGo />
          </Layout>
        } />
        <Route path="/things-to-do" element={
          <Layout>
            <ThingsToDo />
          </Layout>
        } />
        <Route path="/plan-your-trip" element={
          <Layout>
            <PlanYourTrip />
          </Layout>
        } />
        <Route path="/tour-booking" element={
          <Layout>
            <Tourbooking />
          </Layout>
        } />
        <Route path="/green-travel" element={
          <Layout>
            <Home />
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
          path="/dashboard"
          element={<ProtectedRoute element={<UserDashboard />} />}
        />
        <Route
          path="/tour-dashboard"
          element={<ProtectedRoute element={<TourDashboard />} />}
        />
        <Route
          path="/tour-dashboard/detail/:tourId"
          element={<ProtectedRoute element={<TourDetailDashboard />} />}
        />
        <Route
          path="/booking-passenger"
          element={<ProtectedRoute element={<BookingPassenger />} />}
        />
        <Route
          path="/booking-confirmation"
          element={<ProtectedRoute element={<BookingConfirmation />} />}
        />
        <Route
          path="/momo-payment"
          element={<ProtectedRoute element={<MomoPaymentPage />} />}
        />

        {/* Admin routes */}
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} requiredRole="ADMIN" />}
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

        {/* Destination admin routes */}
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

        {/* Event admin routes */}
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

        {/* Tour admin routes */}
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
          path="/admin/tour/:tourId"
          element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
        />

        {/* Itinerary admin routes */}
        <Route
          path="/admin/itinerary"
          element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
        />
        <Route
          path="/admin/itinerary/add"
          element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
        />
        <Route
          path="/admin/itinerary/detail/:itineraryId"
          element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
        />
        <Route
          path="/admin/itinerary/edit/:itineraryId"
          element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
        />
        <Route
          path="/admin/itinerary/:itineraryId"
          element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
        />

        {/* Booking admin routes */}
        <Route
          path="/admin/booking"
          element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
        />
        <Route
          path="/admin/booking/detail/:bookingId"
          element={<ProtectedRoute element={<AdminPage />} requiredRole="ADMIN" />}
        />
      </Routes>
    </Router>
  );
};

export default App;