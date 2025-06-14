import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaUsers, FaUser, FaMoneyBillWave, FaArrowLeft, FaClipboardList, FaRegSadTear } from 'react-icons/fa';
import '../../styles/tour/TourScheduleBookings.css';

const TourScheduleBookings = () => {
  const { tourId, scheduleId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm kiểm tra schedule có booking Confirmed không
  const hasConfirmedBooking = async (scheduleId, config) => {
    const bookingsRes = await axios.get('http://localhost:8080/api/bookings/admin-bookings', config);
    return bookingsRes.data.some(
      booking => Number(booking.scheduleId) === Number(scheduleId) && booking.statusName === 'Confirmed'
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const tourRes = await axios.get(`http://localhost:8080/api/tours/${tourId}`, config);
        setTour(tourRes.data);
        const schedulesRes = await axios.get(`http://localhost:8080/api/schedules/tour/${tourId}`, config);
        // Lọc chỉ những schedule có booking Confirmed
        const filteredSchedules = [];
        for (const schedule of schedulesRes.data) {
          if (await hasConfirmedBooking(schedule.scheduleId, config)) {
            filteredSchedules.push(schedule);
          }
        }
        setSchedules(filteredSchedules);
      } catch (err) {
        setError('Không thể tải dữ liệu: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tourId]);

  if (loading) return <div className="tour-loading">Đang tải...</div>;
  if (error) return <div className="tour-error">{error}</div>;
  if (!tour) return <div className="tour-error">Không tìm thấy tour</div>;

  // Trang danh sách lịch trình
  if (!scheduleId) {
    return (
      <div className="tour-schedule-list-wrapper">
        <div className="tour-header-modern">
          <h1>{tour.name}</h1>
          <p>{tour.description}</p>
        </div>
        <div className="tour-schedule-list">
          {schedules.length === 0 ? (
            <div className="tour-empty-block">
              <FaRegSadTear size={60} style={{ color: 'red' }}   />
              <p style={{ fontSize: '1.2rem',color: 'red' }}>Chưa có booking nào cho tour này.</p>
            </div>
          ) : (
            schedules.map(schedule => (
              <div className="tour-schedule-card" key={schedule.scheduleId}>
                <div className="tour-schedule-card-header">
                  <FaCalendarAlt className="tour-schedule-icon" />
                  <span className={`tour-schedule-status ${schedule.status.toLowerCase()}`}>{schedule.status}</span>
                </div>
                <div className="tour-schedule-card-body">
                  <div><strong>Bắt đầu:</strong> {new Date(schedule.startDate).toLocaleDateString()}</div>
                  <div><strong>Kết thúc:</strong> {new Date(schedule.endDate).toLocaleDateString()}</div>
                  <div><strong>Tham gia:</strong> {schedule.currentParticipants} / {tour.maxParticipants}</div>
                </div>
                <button className="tour-schedule-detail-btn" onClick={() => navigate(`/admin/tour/schedules/${tourId}/${schedule.scheduleId}`)}>
                  <FaClipboardList /> Xem chi tiết
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Trang chi tiết lịch trình
  return <ScheduleDetail tour={tour} scheduleId={scheduleId} />;
};

const ScheduleDetail = ({ tour, scheduleId }) => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [passengers, setPassengers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const schedulesRes = await axios.get(`http://localhost:8080/api/schedules/tour/${tourId}`, config);
        const found = schedulesRes.data.find(s => String(s.scheduleId) === String(scheduleId));
        setSchedule(found);
        const bookingsRes = await axios.get('http://localhost:8080/api/bookings/admin-bookings', config);
        const scheduleBookings = bookingsRes.data.filter(
          booking => Number(booking.scheduleId) === Number(scheduleId) && booking.statusName === 'Confirmed'
        );
        setBookings(scheduleBookings);
        const passengersData = {};
        for (const booking of scheduleBookings) {
          const passengersRes = await axios.get(`http://localhost:8080/api/booking-passengers/booking/${booking.bookingId}`, config);
          passengersData[booking.bookingId] = passengersRes.data;
        }
        setPassengers(passengersData);
      } catch (err) {
        setError('Không thể tải chi tiết: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [tourId, scheduleId]);

  if (loading) return <div className="tour-loading">Đang tải...</div>;
  if (error) return <div className="tour-error">{error}</div>;
  if (!schedule) return <div className="tour-error">Không tìm thấy lịch trình</div>;

  // Hàm dịch passengerType sang tiếng Việt
  const getPassengerTypeVN = (type) => {
    switch (type) {
      case 'adult': return 'Người lớn';
      case 'child': return 'Trẻ em';
      case 'infant': return 'Em bé';
      default: return type;
    }
  };

  return (
    <div className="tour-schedule-detail-wrapper">
      <button className="tour-back-btn" onClick={() => navigate(-1)}><FaArrowLeft /> Quay lại</button>
      <div className="tour-schedule-detail">
        <div className="tour-schedule-detail-header">
          <h2><FaCalendarAlt /> Lịch trình #{schedule.scheduleId}</h2>
          <span className={`tour-schedule-status ${schedule.status.toLowerCase()}`}>{schedule.status}</span>
        </div>
        <div className="tour-schedule-detail-info">
          <div><strong>Bắt đầu:</strong> {new Date(schedule.startDate).toLocaleDateString()}</div>
          <div><strong>Kết thúc:</strong> {new Date(schedule.endDate).toLocaleDateString()}</div>
          <div><strong>Tham gia:</strong> {schedule.currentParticipants} / {tour.maxParticipants}</div>
        </div>
      </div>
      <div className="tour-booking-list">
        <h3><FaUsers /> Danh sách booking ({bookings.length})</h3>
        {bookings.length === 0 ? (
          <div className="tour-empty-block">
            <FaRegSadTear size={40} />
            <p>Chưa có booking nào cho lịch trình này.</p>
          </div>
        ) : (
          bookings.map(booking => (
            <div className="tour-booking-card" key={booking.bookingId}>
              <div className="tour-booking-card-header">
                <span className="tour-booking-code">#{booking.bookingCode}</span>
                <span className={`tour-booking-status ${booking.statusName.toLowerCase()}`}>{booking.statusName}</span>
              </div>
              <div className="tour-booking-card-info">
                <div><FaUser /> {booking.userName}</div>
                <div><FaMoneyBillWave /> {booking.totalPrice.toLocaleString('vi-VN')}đ</div>
                <div><FaCalendarAlt /> {new Date(booking.bookingDate).toLocaleDateString()}</div>
              </div>
              {passengers[booking.bookingId]?.length > 0 && (
                <div className="tour-passenger-table-wrapper">
                  <h4>Hành khách ({passengers[booking.bookingId].length})</h4>
                  <table className="tour-passenger-table">
                    <thead>
                      <tr className="tour-passenger-header">
                        <th className="tour-passenger-cell">#</th>
                        <th className="tour-passenger-cell">Tên</th>
                        <th className="tour-passenger-cell">Địa chỉ</th>
                        <th className="tour-passenger-cell">SĐT</th>
                        <th className="tour-passenger-cell">Email</th>
                        <th className="tour-passenger-cell">Loại khách</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passengers[booking.bookingId].map((passenger, idx) => (
                        <tr className="tour-passenger-row" key={idx}>
                          <td className="tour-passenger-cell">{idx + 1}</td>
                          <td className="tour-passenger-cell">{passenger.fullName}</td>
                          <td className="tour-passenger-cell">{passenger.address}</td>
                          <td className="tour-passenger-cell">{passenger.phone}</td>
                          <td className="tour-passenger-cell">{passenger.email}</td>
                          <td className="tour-passenger-cell">{getPassengerTypeVN(passenger.passengerType)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TourScheduleBookings; 