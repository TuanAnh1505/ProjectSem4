import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/tour/TourDetailDashboard.css';
import '../styles/booking/BookingDashboard.css';
import { toast } from 'react-toastify';

export default function TourDetailDashboard() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [message, setMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [relatedTours, setRelatedTours] = useState([]);
  const [itineraries, setItineraries] = useState([]);

  const [openScheduleId, setOpenScheduleId] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axios.get(`http://localhost:8080/api/tours/${tourId}`, config);
        if (!res.data) throw new Error('Tour not found');
        setTour(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please login to view tour details');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load tour details.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (tourId) fetchTour();
    else {
      setError('Invalid tour ID');
      setLoading(false);
    }
  }, [tourId, navigate]);

  useEffect(() => {
    const fetchRelatedTours = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token 
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
          
        const res = await axios.get(
          `http://localhost:8080/api/tours/random?count=3&excludeTourId=${tourId}`,
          config
        );
        setRelatedTours(res.data);
      } catch (err) {
        console.error('Failed to fetch related tours:', err);
      }
    };

    if (tourId) fetchRelatedTours();
  }, [tourId]);

  function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  }

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token 
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        // 1. Lấy tất cả schedule của tour (chỉ của tour hiện tại)
        const schedulesRes = await axios.get(
          `http://localhost:8080/api/schedules/tour/${tourId}`,
          config
        );
        const schedules = schedulesRes.data;

        // 2. Lấy itinerary cho từng schedule
        const schedulesWithItineraries = [];
        for (const schedule of schedules) {
          const itinerariesRes = await axios.get(
            `http://localhost:8080/api/itineraries/schedule/${schedule.scheduleId}`,
            config
          );
          schedulesWithItineraries.push({
            ...schedule,
            itineraries: itinerariesRes.data
          });
        }
        setItineraries(schedulesWithItineraries);
      } catch (err) {
        console.error('Failed to fetch itineraries:', err);
      }
    };

    if (tourId) fetchItineraries();
  }, [tourId]);

  const handleItinerarySelect = (itineraryId) => {
    setSelectedItineraryId(itineraryId);
  };

  const handleBooking = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId) {
        toast.error('Bạn cần đăng nhập để đặt tour!');
        return navigate('/login');
      }
      if (!selectedScheduleId) {
        toast.error('Vui lòng chọn lịch trình muốn đặt!');
        return;
      }

      setBookingLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const selectedSchedule = itineraries.find(sch => sch.scheduleId === selectedScheduleId);
      const selectedItinerary = selectedSchedule?.itineraries?.[0] || null;

      const bookingRequest = {
        userId: parseInt(userId),
        tourId: parseInt(tourId),
        scheduleId: selectedScheduleId,
        discountCode: discountCode.trim() || null
      };
      console.log('Booking request:', bookingRequest);

      const res = await axios.post('http://localhost:8080/api/bookings', bookingRequest, config);
      if (res.data && res.data.bookingId) {
        toast.success(res.data.message || 'Đặt tour thành công!');
        navigate('/booking-passenger', { 
          state: { 
            bookingId: res.data.bookingId,
            tourInfo: tour,
            selectedDate: selectedSchedule?.startDate,
            itineraries: selectedSchedule?.itineraries || []
          }
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi đặt tour');
      console.error('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading tour details...</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!tour) return <div className="error-box">Tour not found</div>;

  return (
    <div className="tour-detail-client">
      <div className="tour-detail-top">
        {tour.imageUrl && (
          <img
            src={`http://localhost:8080${tour.imageUrl}`}
            alt={tour.name}
            className="tour-detail-banner"
          />
        )}
        <div className="tour-detail-info">
          <h2>{tour.name}</h2>
          <div className="info-row"><label>Price:</label><span>${tour.price}</span></div>
          <div className="info-row"><label>Duration:</label><span>{tour.duration} days</span></div>
          <div className="info-row"><label>Max Participants:</label><span>{tour.maxParticipants}</span></div>
        </div>
      </div>

      <div className="tour-detail-body">
        <div className="info-section">
          <div className="info-row">
            <label>Description:</label>
            <span>{tour.description || 'No description provided.'}</span>
          </div>
        </div>

        <div className="itinerary-section">
          <h2 className="itinerary-title">LỊCH TRÌNH TOUR</h2>
          {itineraries.length > 0 ? (
            <div>
              {itineraries.map((schedule, idx) => (
                <div key={schedule.scheduleId} className="schedule-card" style={{
                  border: '1.5px solid #1976d2',
                  borderRadius: 12,
                  marginBottom: 18,
                  background: selectedScheduleId === schedule.scheduleId ? '#e3f2fd' : '#f8f9fa',
                  boxShadow: '0 2px 8px #e3e8f0'
                }}>
                  <div
                    className="schedule-summary"
                    style={{
                      padding: '18px 24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => setOpenScheduleId(openScheduleId === schedule.scheduleId ? null : schedule.scheduleId)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input
                        type="radio"
                        name="selectedSchedule"
                        checked={selectedScheduleId === schedule.scheduleId}
                        onChange={() => setSelectedScheduleId(schedule.scheduleId)}
                        style={{ accentColor: '#1976d2', width: 18, height: 18 }}
                        onClick={e => { e.stopPropagation(); setSelectedScheduleId(schedule.scheduleId); }}
                      />
                      <span>
                        <strong>Schedule {idx + 1}:</strong> {schedule.startDate} - {schedule.endDate} ({schedule.status})
                      </span>
                    </div>
                    <span style={{fontSize: 22}}>
                      {openScheduleId === schedule.scheduleId ? '▲' : '▼'}
                    </span>
                  </div>
                  {openScheduleId === schedule.scheduleId && (
                    <div className="schedule-details" style={{padding: '16px 32px', background: '#fff'}}>
                      {schedule.itineraries && schedule.itineraries.length > 0 ? (
                        schedule.itineraries.map((itinerary) => (
                          <div key={itinerary.itineraryId} className="itinerary-card" style={{
                            border: '1px solid #e3e8f0',
                            borderRadius: 8,
                            marginBottom: 12,
                            padding: 14,
                            background: selectedItineraryId === itinerary.itineraryId ? '#e3f2fd' : '#f5faff',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleItinerarySelect(itinerary.itineraryId)}
                          >
                            <div><strong>Tiêu đề:</strong> {itinerary.title}</div>
                            {itinerary.startTime && (
                              <div><strong>Giờ bắt đầu:</strong> {formatTime(itinerary.startTime)}</div>
                            )}
                            {itinerary.endTime && (
                              <div><strong>Giờ kết thúc:</strong> {formatTime(itinerary.endTime)}</div>
                            )}
                            {itinerary.description && (
                              <div><strong>Mô tả:</strong> {itinerary.description}</div>
                            )}
                            {itinerary.type && (
                              <div><strong>Loại:</strong> {itinerary.type}</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div style={{color: '#888'}}>Không có lịch trình nào cho schedule này.</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Chưa có lịch trình cho tour này</p>
          )}
        </div>

        <div className="booking-form">
          <h3>🧾 Book This Tour</h3>
          <div className="form-group discount">
            <label>Mã giảm giá (nếu có):</label>
            <input
              type="text"
              placeholder="VD: NEWUSER10"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </div>

          <button
            className="btn submit-btn"
            onClick={handleBooking}
            disabled={bookingLoading || !selectedScheduleId}
          >
            {bookingLoading ? 'Đang xử lý...' : '✅ Đặt ngay'}
          </button>
        </div>

        <div className="related-tours-section">
          <h2>CÁC CHƯƠNG TRÌNH KHÁC</h2>
          <div className="related-tours-grid">
            {relatedTours.map(tour => (
              <div key={tour.tourId} className="tour-card">
                <div className="tour-image">
                  <img src={`http://localhost:8080${tour.imageUrl}`} alt={tour.name} />
                  <button 
                    className="favorite-btn"
                    onClick={() => navigate(`/tours/${tour.tourId}`)}
                  >
                    ♥
                  </button>
                </div>
                <div className="tour-info">
                  <h3>{tour.name}</h3>
                  <div className="price-section">
                    <span className="price">Giá từ {tour.price.toLocaleString()}đ</span>
                    <button 
                      className="btn-tour-detail-dashboard"
                      onClick={() => navigate(`/tour-dashboard/detail/${tour.tourId}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
