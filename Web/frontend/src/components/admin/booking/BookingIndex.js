import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import './BookingIndex.css';

const BOOKINGS_PER_PAGE = 10;

const BookingTable = ({ bookings }) => (
  <div className="booking-table-wrapper">
    <table className="booking-table">
      <thead>
        <tr>
          <th>Mã</th>
          <th>Người đặt</th>
          <th>Tour</th>
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 0 0', gap: 8 }}>
    <button
      className="submit-btn"
      style={{ width: 'auto', padding: '6px 18px', fontSize: '1rem' }}
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        className={`submit-btn${currentPage === i + 1 ? ' active' : ''}`}
        style={{
          width: 'auto',
          padding: '6px 14px',
          fontWeight: currentPage === i + 1 ? 700 : 500,
          background: currentPage === i + 1 ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : '#e0e7ff',
          color: currentPage === i + 1 ? '#fff' : '#3730a3',
          border: currentPage === i + 1 ? 'none' : '1.5px solid #c7d2fe',
          margin: '0 2px'
        }}
        onClick={() => onPageChange(i + 1)}
      >
        {i + 1}
      </button>
    ))}
    <button
      className="submit-btn"
      style={{ width: 'auto', padding: '6px 18px', fontSize: '1rem' }}
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
);

const BookingIndex = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
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
        // Sort by bookingDate DESC (newest first)
        bookingsData.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
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

  // Filter bookings by status
  const bookingsFiltered = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => (b.statusName || '').toLowerCase() === filterStatus);

  // Pagination logic
  const totalPages = Math.ceil(bookingsFiltered.length / BOOKINGS_PER_PAGE);
  const paginatedBookings = bookingsFiltered.slice(
    (currentPage - 1) * BOOKINGS_PER_PAGE,
    currentPage * BOOKINGS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
        <>
          {/* Filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <label htmlFor="filter-status" style={{ fontWeight: 500, color: '#6366f1' }}>Lọc trạng thái:</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1.5px solid #c7d2fe',
                fontSize: '1rem',
                color: '#3730a3',
                background: '#f7f8fa',
                outline: 'none'
              }}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <BookingTable bookings={paginatedBookings} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default BookingIndex;
