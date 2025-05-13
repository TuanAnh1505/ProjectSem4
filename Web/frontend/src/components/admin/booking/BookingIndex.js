import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import './BookingIndex.css';

const BookingTable = ({ bookings }) => (
  <div className="booking-table-wrapper">
    <table className="booking-table">
      <thead>
        <tr>
          <th>Mã</th>
          <th>Người đặt</th>
          <th>Tour</th>
          <th>Ngày khởi hành</th>
          <th>Ngày đặt</th>
          <th>Trạng thái</th>
          <th>Tổng tiền</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b, index) => (
          <tr key={`booking-${b.bookingId}-${index}`}>
            <td>{b.bookingId}</td>
            <td>{b.userFullName || 'N/A'}</td>
            <td>{b.tourName || 'N/A'}</td>
            <td>{b.selectedDate ? new Date(b.selectedDate).toLocaleDateString() : 'N/A'}</td>
            <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : 'N/A'}</td>
            <td>
              <span className={`status-badge status-${(b.statusName || '').toLowerCase()}`}>{b.statusName || 'N/A'}</span>
            </td>
            <td>{b.totalPrice ? parseFloat(b.totalPrice).toLocaleString() + 'đ' : 'N/A'}</td>
            <td>
              <Link className="detail-link" to={`/admin/booking/detail/${b.bookingId}`} title="Xem chi tiết">
                <FaEye size={20} />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BookingIndex = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('/api/bookings/admin-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        let bookingsData = response.data;
        if (!Array.isArray(bookingsData)) {
          bookingsData = [bookingsData];
        }
        setBookings(bookingsData);
      } catch (err) {
        console.error('Lỗi khi tải booking:', err);
        setError(err.response?.data?.message || 'Failed to load bookings');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate]);

  return (
    <div className="booking-index-container">
      <h2 className="booking-title">Quản lý Đơn Đặt Tour</h2>
      {loading ? (
        <div className="booking-loading">Loading...</div>
      ) : error ? (
        <div className="booking-error">{error}</div>
      ) : bookings.length === 0 ? (
        <p className="booking-empty">No bookings found</p>
      ) : (
        <BookingTable bookings={bookings} />
      )}
    </div>
  );
};

export default BookingIndex;
