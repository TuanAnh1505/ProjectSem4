import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailBooking.css';

const DetailBooking = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        setLoading(true);
        console.log('Fetching booking details for ID:', bookingId);
        console.log('Using token:', token.substring(0, 20) + '...');
        
        const response = await axios.get(`http://localhost:8080/api/bookings/admin-bookings/${bookingId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response received:', response.data);

        if (!response.data.booking) {
          throw new Error('Không tìm thấy thông tin đặt tour');
        }

        const cleanBooking = {
          ...response.data.booking,
          user: response.data.booking.user ? {
            userid: response.data.booking.user.userid,
            fullName: response.data.booking.user.fullName,
            email: response.data.booking.user.email,
            phone: response.data.booking.user.phone,
            address: response.data.booking.user.address
          } : null
        };

        console.log('Cleaned booking data:', cleanBooking);
        setBooking(cleanBooking);
        setPassengers(response.data.passengers || []);
        setError(null);
      } catch (err) {
        console.error('Complete error object:', err);
        
        console.error('Error details:', {
          message: err.message,
          response: {
            data: err.response?.data,
            status: err.response?.status,
            statusText: err.response?.statusText,
            headers: err.response?.headers
          },
          request: {
            url: err.config?.url,
            method: err.config?.method,
            headers: err.config?.headers
          }
        });

        if (err.response?.data) {
          console.error('Server response data:', JSON.stringify(err.response.data, null, 2));
        }

        let errorMessage = 'Có lỗi xảy ra khi tải thông tin đặt tour';
        
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response?.status === 500) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
          console.error('Server error details:', err.response?.data);
        } else if (err.response?.status === 401) {
          navigate('/login');
          return;
        } else if (err.response?.status === 404) {
          errorMessage = 'Không tìm thấy thông tin đặt tour';
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [bookingId, navigate]);

  if (loading) {
    return (
      <div className="booking-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-container">
        <div className="error-message">
          <i className="fas fa-info-circle"></i>
          <p>Không tìm thấy thông tin đặt tour</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h2>Chi tiết đặt tour #{booking.bookingId}</h2>
        <span className={`status-badge status-${booking.status?.statusName?.toLowerCase()}`}>
          {booking.status?.statusName}
        </span>
      </div>

      <div className="booking-grid">
        <div className="booking-section">
          <h3>Thông tin người đặt</h3>
          <div className="info-card">
            <div className="info-item">
              <label>Họ tên:</label>
              <span>{booking.user?.fullName || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{booking.user?.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Số điện thoại:</label>
              <span>{booking.user?.phone || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Địa chỉ:</label>
              <span>{booking.user?.address || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="booking-section">
          <h3>Thông tin tour</h3>
          <div className="info-card">
            <div className="info-item">
              <label>Tên tour:</label>
              <span>{booking.tour?.name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Giá tour:</label>
              <span>{parseFloat(booking.tour?.price).toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        <div className="booking-section">
          <h3>Thông tin đặt chỗ</h3>
          <div className="info-card">
            <div className="info-item">
              <label>Ngày đặt:</label>
              <span>{new Date(booking.bookingDate).toLocaleString('vi-VN')}</span>
            </div>
            <div className="info-item">
              <label>Tổng tiền:</label>
              <span className="price">{parseFloat(booking.totalPrice).toLocaleString()}đ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-section passengers-section">
        <h3>Danh sách hành khách</h3>
        <div className="table-responsive">
          <table className="passengers-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Loại</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              {passengers.length > 0 ? (
                passengers.map(passenger => (
                  <tr key={passenger.passengerId}>
                    <td>{passenger.fullName}</td>
                    <td>{passenger.passengerType}</td>
                    <td>{passenger.gender}</td>
                    <td>{new Date(passenger.birthDate).toLocaleDateString('vi-VN')}</td>
                    <td>{passenger.email}</td>
                    <td>{passenger.phone}</td>
                    <td>{passenger.address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">Chưa có thông tin hành khách</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailBooking;
