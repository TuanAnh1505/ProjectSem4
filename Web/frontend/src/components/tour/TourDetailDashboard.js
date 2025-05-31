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

  // Gallery images (nếu có nhiều ảnh, ở đây demo chỉ lấy 1 ảnh chính)
  const galleryImages = tour.images || (tour.imageUrl ? [tour.imageUrl] : []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', background: '#e3f2fd', borderRadius: 16, boxShadow: '0 4px 24px 0 #e3e8f0', padding: '0 0 32px 0', paddingTop: 80 }}>
      {/* Top section: Title, Info, Banner */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', padding: '32px 32px 0 32px', background: '#e3f2fd', borderRadius: 16, boxShadow: '0 2px 12px #e3e8f0', marginBottom: 24 }}>
        {/* Info left */}
        <div style={{
          flex: 1,
          minWidth: 380,
          background: '#fff',
          borderRadius: 24,
          padding: '38px 38px 32px 38px',
          boxShadow: '0 4px 24px #e3e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 0 0 0',
        }}>
          <div style={{
            color: '#1976d2',
            fontWeight: 800,
            fontSize: 38,
            marginBottom: 18,
            textAlign: 'center',
            width: '100%',
            letterSpacing: 1
          }}>{tour.name}</div>
          <div style={{
            color: '#333',
            fontSize: 20,
            marginBottom: 28,
            textAlign: 'center',
            lineHeight: 1.5,
            fontWeight: 400
          }}>{tour.description}</div>
          <div style={{
            display: 'flex',
            gap: 48,
            marginBottom: 0,
            justifyContent: 'center',
            width: '100%'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 20, marginBottom: 4 }}>Thời gian</span>
              <span style={{ color: '#333', fontSize: 18 }}>{tour.duration} ngày</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 20, marginBottom: 4 }}>Số lượng</span>
              <span style={{ color: '#333', fontSize: 18 }}>{tour.maxParticipants} khách</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 20, marginBottom: 4 }}>Giá</span>
              <span style={{ color: '#388e3c', fontSize: 20, fontWeight: 700 }}>{tour.price?.toLocaleString()}đ</span>
            </div>
          </div>
        </div>
        {/* Banner right */}
        <div style={{ flex: 1, minWidth: 320, display: 'flex', justifyContent: 'center' }}>
          {tour.imageUrl && (
            <img
              src={`http://localhost:8080${tour.imageUrl}`}
              alt={tour.name}
              style={{ width: '100%', maxWidth: 420, maxHeight: 320, objectFit: 'cover', borderRadius: 18, border: '6px solid #1976d2', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            />
          )}
        </div>
      </div>

      {/* Tabs section: Lịch trình, Giới thiệu, Chuẩn bị */}
      <div style={{ margin: '32px 0 0 0', padding: '0 32px' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ background: '#1976d2', color: '#fff', padding: '12px 32px', borderTopLeftRadius: 12, borderTopRightRadius: 12, fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>LỊCH TRÌNH</div>
          {/* Có thể thêm tab Giới thiệu, Chuẩn bị nếu muốn */}
        </div>
        <div style={{ background: '#fff', borderRadius: '0 0 12px 12px', padding: 24, border: '1.5px solid #e3e8f0', borderTop: 'none', boxShadow: '0 2px 8px #e3e8f0' }}>
          {itineraries.length > 0 ? (
            itineraries.map((schedule, idx) => (
              <div key={schedule.scheduleId} style={{ 
                marginBottom: 24, 
                background: schedule.status === 'full' ? '#fff1f0' : '#e3f2fd', 
                borderRadius: 10, 
                boxShadow: '0 2px 8px #e3e8f0', 
                border: `1.5px solid ${schedule.status === 'full' ? '#ff4d4f' : '#e3e8f0'}`, 
                padding: 18 
              }}>
                <div style={{ 
                  fontWeight: 600, 
                  color: schedule.status === 'full' ? '#ff4d4f' : '#1976d2', 
                  fontSize: 16, 
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Lịch trình {idx + 1}: {schedule.startDate} - {schedule.endDate}</span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: schedule.status === 'full' ? '#ff4d4f' : '#1976d2',
                    color: '#fff',
                    fontSize: 14
                  }}>
                    {schedule.status === 'full' ? 'Đã đủ người' : 'Còn chỗ'} 
                    ({schedule.currentParticipants || 0}/{tour.maxParticipants})
                  </span>
                </div>
                {schedule.itineraries && schedule.itineraries.length > 0 ? (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {schedule.itineraries.map((itinerary, i) => (
                      <li key={itinerary.itineraryId} style={{ marginBottom: 10, padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e3e8f0' }}>
                        <div style={{ fontWeight: 600, color: '#1976d2' }}>Ngày {i + 1}: {itinerary.title}</div>
                        {itinerary.startTime && <div><b>Giờ bắt đầu:</b> {formatTime(itinerary.startTime)}</div>}
                        {itinerary.endTime && <div><b>Giờ kết thúc:</b> {formatTime(itinerary.endTime)}</div>}
                        {itinerary.description && <div><b>Mô tả:</b> {itinerary.description}</div>}
                        {itinerary.type && <div><b>Loại:</b> {itinerary.type}</div>}
                      </li>
                    ))}
                  </ul>
                ) : <div style={{ color: '#888' }}>Không có lịch trình nào cho schedule này.</div>}
              </div>
            ))
          ) : <div style={{ color: '#888' }}>Chưa có lịch trình cho tour này</div>}
        </div>
      </div>

      {/* Gallery section */}
      {galleryImages.length > 0 && (
        <div style={{ margin: '32px 0', padding: '0 32px' }}>
          <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 20, marginBottom: 16 }}>Hình ảnh tour</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #e3e8f0' }}>
            {galleryImages.map((img, idx) => (
              <img key={idx} src={`http://localhost:8080${img}`} alt={`gallery-${idx}`} style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 10, border: '2px solid #e3e8f0' }} />
            ))}
          </div>
        </div>
      )}

      {/* Booking form + Điểm nổi bật + FAQ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, margin: '32px 0', padding: '0 32px' }}>
        {/* Booking form */}
        <div style={{ flex: 1, minWidth: 320, background: '#e3f2fd', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e3e8f0', border: '1.5px solid #e3e8f0' }}>
          <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 18, marginBottom: 16 }}>Đặt tour</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 600 }}>Mã giảm giá (nếu có):</label>
            <input
              type="text"
              placeholder="VD: NEWUSER10"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 6, marginBottom: 12 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 600 }}>Chọn lịch trình:</label>
            <select
              value={selectedScheduleId || ''}
              onChange={e => setSelectedScheduleId(Number(e.target.value))}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #1976d2', marginTop: 6 }}
            >
              <option value="">-- Chọn lịch trình --</option>
              {itineraries.map(sch => (
                <option 
                  key={sch.scheduleId} 
                  value={sch.scheduleId}
                  disabled={sch.status === 'full'}
                  style={{ 
                    color: sch.status === 'full' ? '#ff4d4f' : 'inherit',
                    backgroundColor: sch.status === 'full' ? '#fff1f0' : 'inherit'
                  }}
                >
                  {sch.startDate} - {sch.endDate} 
                  {sch.status === 'full' ? ' (Đã đủ người)' : ' (Còn chỗ)'} 
                  - {sch.currentParticipants || 0}/{tour.maxParticipants} người
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleBooking}
            disabled={bookingLoading || !selectedScheduleId || 
              (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full')}
            style={{ 
              width: '100%', 
              padding: 12, 
              background: (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full') 
                ? '#ff4d4f' 
                : '#1976d2', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              fontWeight: 700, 
              fontSize: 16, 
              cursor: (bookingLoading || !selectedScheduleId || 
                (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full')) 
                ? 'not-allowed' 
                : 'pointer', 
              marginTop: 8,
              opacity: (bookingLoading || !selectedScheduleId || 
                (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full')) 
                ? 0.7 
                : 1
            }}
          >
            {bookingLoading ? 'Đang xử lý...' : 
              (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full') 
                ? 'Đã đủ người' 
                : 'Đặt ngay'}
          </button>

          {/* Thông báo khi lịch trình đã đủ người */}
          {selectedScheduleId && itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full' && (
            <div style={{ 
              marginTop: 12, 
              padding: 12, 
              background: '#fff1f0', 
              border: '1px solid #ff4d4f', 
              borderRadius: 8,
              color: '#ff4d4f',
              fontSize: 14
            }}>
              ⚠️ Lịch trình này đã đủ số lượng người tham gia. Vui lòng chọn lịch trình khác.
            </div>
          )}
        </div>
        {/* Điểm nổi bật (demo) */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e3e8f0', border: '1.5px solid #e3e8f0' }}>
          <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 18, marginBottom: 16 }}>Điểm nổi bật</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'disc inside', color: '#333', fontSize: 15 }}>
            <li>Tour an toàn, uy tín, trải nghiệm thiên nhiên tuyệt vời</li>
            <li>Hướng dẫn viên chuyên nghiệp, hỗ trợ tận tình</li>
            <li>Lịch trình linh hoạt, phù hợp nhiều đối tượng</li>
            <li>Giá cả hợp lý, nhiều ưu đãi hấp dẫn</li>
          </ul>
        </div>
      </div>

      {/* FAQ (demo) */}
      <div style={{ margin: '32px 0', padding: '0 32px', background: '#e3f2fd', borderRadius: 12, boxShadow: '0 2px 8px #e3e8f0' }}>
        <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 18, marginBottom: 16 }}>FAQ về tour</div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#333', fontSize: 15 }}>
          <li style={{ marginBottom: 8 }}><b>Đi một mình ổn không?</b> Hoàn toàn ổn, tour có nhiều khách đi lẻ.</li>
          <li style={{ marginBottom: 8 }}><b>Cung đường trekking dài bao nhiêu?</b> Tùy tour, thường 10-20km/ngày.</li>
          <li style={{ marginBottom: 8 }}><b>Không có kinh nghiệm trekking có tham gia được không?</b> Được, HDV sẽ hỗ trợ tận tình.</li>
        </ul>
      </div>

      {/* Related tours */}
      <div style={{ margin: '32px 0', padding: '0 32px' }}>
        <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 20, marginBottom: 16 }}>Các tour liên quan</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          {relatedTours.map(tour => (
            <div key={tour.tourId} style={{ background: '#e3f2fd', borderRadius: 12, boxShadow: '0 2px 8px #e3e8f0', border: '1.5px solid #e3e8f0', width: 260, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={`http://localhost:8080${tour.imageUrl}`} alt={tour.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
              <div style={{ fontWeight: 600, color: '#1976d2', fontSize: 16, marginBottom: 4 }}>{tour.name}</div>
              <div style={{ color: '#388e3c', fontSize: 15, marginBottom: 8 }}>Giá từ {tour.price.toLocaleString()}đ</div>
              <button onClick={() => navigate(`/tour-dashboard/detail/${tour.tourId}`)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>Xem chi tiết</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
