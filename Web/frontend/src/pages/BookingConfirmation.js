import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (err) {
        setError('Không thể tải thông tin đặt phòng');
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handlePayment = () => {
    navigate(`/payment/${bookingId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return <div className="booking-confirmation-loading">Đang tải thông tin đặt phòng...</div>;
  }

  if (error) {
    return <div className="booking-confirmation-error">{error}</div>;
  }

  return (
    <div className="booking-confirmation">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <FaCheckCircle className="success-icon" />
          <h1>Đặt phòng thành công!</h1>
          <p className="confirmation-message">
            Cảm ơn bạn đã đặt phòng. Vui lòng thanh toán để hoàn tất quá trình đặt phòng.
          </p>
        </div>

        <div className="confirmation-details">
          <div className="detail-section">
            <h2>Thông tin đặt phòng</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Mã đặt phòng:</span>
                <span className="value">{booking.bookingId}</span>
              </div>
              <div className="detail-item">
                <span className="label">Ngày đặt:</span>
                <span className="value">
                  {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Ngày nhận phòng:</span>
                <span className="value">
                  {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Ngày trả phòng:</span>
                <span className="value">
                  {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>Chi tiết thanh toán</h2>
            <div className="payment-details">
              <div className="payment-item">
                <span className="label">Tạm tính:</span>
                <span className="value">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <div className="payment-item">
                <span className="label">Thuế (10%):</span>
                <span className="value">{formatCurrency(booking.totalAmount * 0.1)}</span>
              </div>
              <div className="payment-item total">
                <span className="label">Tổng cộng:</span>
                <span className="value">{formatCurrency(booking.totalAmount * 1.1)}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button className="payment-button" onClick={handlePayment}>
              <FaCreditCard /> Thanh toán ngay
            </button>
            <button className="view-bookings-button" onClick={() => navigate('/bookings')}>
              Xem đặt phòng của tôi
            </button>
          </div>

          <div className="confirmation-note">
            <p>* Vui lòng thanh toán trong vòng 24 giờ để giữ chỗ</p>
            <p>* Sau 24 giờ, đặt phòng sẽ tự động hủy nếu chưa thanh toán</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 