import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/VietnamTourism/index';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PlacesToGo from './components/PlaceToGo/PlaceToGo';
import ThingsToDo from './components/ThingToDo/ThingsToDo';
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
import MomoPaymentPage from './components/payment/MomoPaymentPage';
import Payment from './pages/Payment';
import UpdateInfoUser from './components/auth/UpdateInfoUser';
import './App.css';
import BookingConfirmation from './components/booking/BookingConfirmation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
              <Home />
            </Layout>
          } />
          <Route path="/green-travel" element={
            <Layout>
              <Home />
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
          <Route path="/momo-payment" element={
            <Layout>
              <ProtectedRoute element={<MomoPaymentPage />} />
            </Layout>
          } />
          <Route path="/payment/:bookingId" element={
            <Layout>
              <ProtectedRoute element={<Payment />} />
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
          <Route
            path="/momo-payment"
            element={<ProtectedRoute element={<MomoPaymentPage />} />}
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
              path="/admin/tour/:tourId"
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;