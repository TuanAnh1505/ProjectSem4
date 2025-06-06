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
  const [message, setMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [relatedTours, setRelatedTours] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0); // Add new state for final price

  const [openScheduleId, setOpenScheduleId] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);

  // Thêm state cho trải nghiệm
  const [experiences, setExperiences] = useState([]);
  const [expContent, setExpContent] = useState('');
  const [expMedia, setExpMedia] = useState([]);
  const [expLoading, setExpLoading] = useState(false);
  const [expTitle, setExpTitle] = useState('');

  // Thêm state cho modal xem ảnh
  const [modalImage, setModalImage] = useState(null);

  // Thêm state cho modal gallery ảnh
  const [modalGallery, setModalGallery] = useState({ images: [], index: 0, open: false });

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

  // Đưa fetchItineraries ra ngoài để có thể gọi lại
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

  useEffect(() => {
    if (tourId) fetchItineraries();
  }, [tourId]);

  useEffect(() => {
    if (selectedScheduleId) {
      const selected = itineraries.find(sch => sch.scheduleId === selectedScheduleId);
      if (selected && selected.status === 'full') {
        setSelectedScheduleId(null);
      }
    }
  }, [itineraries, selectedScheduleId]);

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
      };
      console.log('Booking request:', bookingRequest);

      const res = await axios.post('http://localhost:8080/api/bookings', bookingRequest, config);
      if (res.data && res.data.bookingId) {
        toast.success(res.data.message || 'Đặt tour thành công!');
        await fetchItineraries();

        // Đảm bảo lấy finalPrice từ response
        const finalPrice = res.data.finalPrice;
        
        navigate('/booking-passenger', { 
          state: { 
            bookingId: res.data.bookingId,
            bookingCode: res.data.bookingCode,
            tourInfo: tour,
            selectedDate: selectedSchedule?.startDate,
            itineraries: selectedSchedule?.itineraries || [],
            finalPrice: finalPrice // Truyền finalPrice từ response
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

  // Hàm lấy danh sách trải nghiệm
  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`http://localhost:8080/api/experiences/tour/${tourId}`, config);
      console.log('API experiences:', res.data);
      setExperiences(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setExperiences([]);
    }
  };

  useEffect(() => {
    if (tourId) fetchExperiences();
  }, [tourId]);

  // Hàm gửi trải nghiệm mới
  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setExpLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // 1. Gửi trải nghiệm (nội dung)
      const expRes = await axios.post('http://localhost:8080/api/experiences', {
        userid: userId,
        tourId: tourId,
        content: expContent,
        title: expTitle
      }, config);
      // Thêm log để kiểm tra response
      console.log('expRes.data', expRes.data);
      // 2. Nếu có file, upload từng file
      const experienceId = expRes.data.experienceId;
      if (!experienceId) {
        alert('Không lấy được experienceId!');
        return;
      }
      for (const file of expMedia) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userid', userId);
        formData.append('experienceId', experienceId);
        formData.append('fileType', file.type.startsWith('image') ? 'image' : 'video');
        console.log('Upload media:', {
          userid: userId,
          experienceId: experienceId,
          fileType: file.type.startsWith('image') ? 'image' : 'video',
          file
        });
        await axios.post('http://localhost:8080/api/media', formData, {
          ...config,
          headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
        });
      }
      setExpContent('');
      setExpMedia([]);
      setExpTitle('');
      fetchExperiences();
    } catch (err) {
      alert('Gửi trải nghiệm thất bại!');
    }
    setExpLoading(false);
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
                    background: schedule.status === 'full' ? '#ff4d4f' : schedule.status === 'closed' ? '#b71c1c' : '#1976d2',
                    color: '#fff',
                    fontSize: 14
                  }}>
                    {schedule.status === 'full' ? 'Đã đủ người' : schedule.status === 'closed' ? 'Đã đóng' : 'Còn chỗ'}
                    ({schedule.currentParticipants || 0}/{tour.maxParticipants})
                  </span>
                  {schedule.status === 'full' && (
                    <span style={{ color: '#ff4d4f', fontWeight: 700, marginLeft: 16, fontSize: 15 }}>
                      ⚠️ Lịch trình này đã hết chỗ!
                    </span>
                  )}
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
                  disabled={sch.status === 'full' || sch.status === 'closed'}
                  style={{ 
                    color: sch.status === 'full' || sch.status === 'closed' ? '#ff4d4f' : 'inherit',
                    backgroundColor: sch.status === 'full' || sch.status === 'closed' ? '#fff1f0' : 'inherit'
                  }}
                >
                  {sch.startDate} - {sch.endDate} {sch.status === 'full' ? '(Đã đủ người)' : sch.status === 'closed' ? '(Đã đóng)' : '(Còn chỗ)'} - {sch.currentParticipants || 0}/{tour.maxParticipants} người
                </option>
              ))}
            </select>
            {/* Cảnh báo đỏ khi lịch trình đã hết chỗ hoặc đã đóng */}
            {selectedScheduleId && ['full', 'closed'].includes(itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status) && (
              <div style={{
                marginTop: 10,
                padding: 10,
                background: '#fff1f0',
                border: '1.5px solid #ff4d4f',
                borderRadius: 8,
                color: '#ff4d4f',
                fontWeight: 700,
                fontSize: 16
              }}>
                {itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full'
                  ? '⚠️ Lịch trình này đã hết chỗ! Bạn không thể đặt thêm.'
                  : '⚠️ Lịch trình này đã đóng! Bạn không thể đặt thêm.'}
              </div>
            )}
          </div>
          <button
            onClick={handleBooking}
            disabled={bookingLoading || !selectedScheduleId || 
              ['full', 'closed'].includes(itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status)}
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
                ['full', 'closed'].includes(itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status)) 
                ? 'not-allowed' 
                : 'pointer', 
              marginTop: 8,
              opacity: (bookingLoading || !selectedScheduleId || 
                ['full', 'closed'].includes(itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status)) 
                ? 0.7 
                : 1
            }}
          >
            {bookingLoading ? 'Đang xử lý...' : 
              (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full') 
                ? 'Đã đủ người' 
                : (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'closed')
                  ? 'Đã đóng' 
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

      {/* --- Chia sẻ trải nghiệm --- */}
      <div style={{
        margin: '40px 0',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px #e3e8f0',
          maxWidth: 540,
          width: '100%',
          padding: '36px 32px 28px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          <h2 style={{ color: '#1976d2', fontWeight: 900, fontSize: 28, marginBottom: 6, letterSpacing: 1 }}>Chia sẻ trải nghiệm của bạn</h2>
          <div style={{ color: '#555', fontSize: 16, marginBottom: 24, textAlign: 'center', maxWidth: 420 }}>
            Hãy chia sẻ cảm nhận, hình ảnh hoặc video về chuyến đi để truyền cảm hứng cho cộng đồng du lịch!
          </div>
          <form onSubmit={handleExpSubmit} style={{ width: '100%' }}>
            <input
              type="text"
              value={expTitle}
              onChange={e => setExpTitle(e.target.value)}
              placeholder="Tiêu đề trải nghiệm"
              required
              style={{
                width: '100%',
                borderRadius: 10,
                border: '2px solid #1976d2',
                padding: '14px 16px',
                fontWeight: 600,
                fontSize: 17,
                marginBottom: 16,
                outline: 'none',
                transition: 'border 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.border = '2px solid #1565c0'}
              onBlur={e => e.target.style.border = '2px solid #1976d2'}
            />
            <textarea
              value={expContent}
              onChange={e => setExpContent(e.target.value)}
              placeholder="Cảm nhận, kinh nghiệm, kỷ niệm đáng nhớ..."
              required
              style={{
                width: '100%',
                minHeight: 90,
                borderRadius: 10,
                border: '2px solid #1976d2',
                padding: '14px 16px',
                fontSize: 16,
                marginBottom: 18,
                outline: 'none',
                fontWeight: 500,
                transition: 'border 0.2s',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
              onFocus={e => e.target.style.border = '2px solid #1565c0'}
              onBlur={e => e.target.style.border = '2px solid #1976d2'}
            />
            <label htmlFor="expMediaInput" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#e3f2fd',
              color: '#1976d2',
              borderRadius: 10,
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              marginBottom: 16,
              border: '2px dashed #1976d2',
              width: '92%',
              transition: 'background 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.background = '#bbdefb'}
              onMouseOut={e => e.currentTarget.style.background = '#e3f2fd'}
            >
              <span style={{ fontSize: 22, display: 'flex', alignItems: 'center' }}>📷</span>
              <span>Chọn ảnh/video (tối đa 10 file)</span>
              <input
                id="expMediaInput"
                type="file"
                accept="image/*,video/*"
                multiple
                style={{ display: 'none' }}
                onChange={e => setExpMedia([...e.target.files])}
              />
            </label>
            {expMedia && expMedia.length > 0 && (
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 18, width: '100%' }}>
                {expMedia.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={idx} style={{ position: 'relative', display: 'inline-block', boxShadow: '0 2px 8px #e3e8f0', borderRadius: 8 }}>
                      <button
                        type="button"
                        onClick={() => setExpMedia(expMedia.filter((_, i) => i !== idx))}
                        style={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          background: '#ff4d4f',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          cursor: 'pointer',
                          fontWeight: 700,
                          zIndex: 2,
                          boxShadow: '0 1px 4px #8888',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          fontSize: 18,
                          transition: 'background 0.18s',
                        }}
                        title="Xóa ảnh/video này"
                        onMouseOver={e => e.currentTarget.style.background = '#d32f2f'}
                        onMouseOut={e => e.currentTarget.style.background = '#ff4d4f'}
                      >×</button>
                      {file.type.startsWith('image') ? (
                        <img src={url} alt="preview" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8, border: '2px solid #1976d2', background: '#fafafa' }} />
                      ) : (
                        <video src={url} controls style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8, border: '2px solid #1976d2', background: '#fafafa' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <button
              type="submit"
              disabled={expLoading}
              style={{
                width: '100%',
                padding: '14px 0',
                background: expLoading ? '#90caf9' : '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontWeight: 900,
                fontSize: 18,
                marginTop: 6,
                boxShadow: '0 2px 8px #e3e8f0',
                cursor: expLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                letterSpacing: 1,
              }}
              onMouseOver={e => { if (!expLoading) e.currentTarget.style.background = '#1565c0'; }}
              onMouseOut={e => { if (!expLoading) e.currentTarget.style.background = '#1976d2'; }}
            >
              {expLoading ? 'Đang gửi...' : 'Gửi trải nghiệm'}
            </button>
          </form>
        </div>
      </div>

      {/* Hiển thị danh sách trải nghiệm đã chia sẻ */}
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        marginTop: 32,
        marginBottom: 48,
        padding: '0 8px',
      }}>
        <h3 style={{ color: '#1976d2', fontWeight: 800, fontSize: 24, marginBottom: 18, letterSpacing: 1 }}>
          Các trải nghiệm đã chia sẻ
        </h3>
        {(!Array.isArray(experiences) || experiences.length === 0) ? (
          <div style={{ color: '#888', fontSize: 17, textAlign: 'center', padding: 32, background: '#f6f7fb', borderRadius: 12, boxShadow: '0 2px 8px #e3e8f0' }}>
            Chưa có trải nghiệm nào cho tour này.
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'flex-start' }}>
            {(Array.isArray(experiences) ? experiences : [])
              .filter(exp => (exp.status || '').toLowerCase() === 'approved')
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 6)
              .map(exp => (
                <div key={exp.experienceId} style={{
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 12px #e3e8f0',
                  padding: '24px 22px 18px 22px',
                  minWidth: 320,
                  maxWidth: 420,
                  flex: '1 1 340px',
                  marginBottom: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}>
                  <div style={{ fontWeight: 800, color: '#1976d2', fontSize: 20, marginBottom: 4 }}>{exp.title || 'Trải nghiệm'}</div>
                  <div style={{ color: '#1976d2', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                    {exp.userFullName || 'Ẩn danh'}
                  </div>
                  <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>
                    {exp.createdAt && (new Date(exp.createdAt).toLocaleString())}
                  </div>
                  <div style={{ color: '#333', fontSize: 16, marginBottom: 8, whiteSpace: 'pre-line' }}>{exp.content}</div>
                  {(() => {
                    const images = exp.media.filter(m => m.fileType === 'image');
                    const videos = exp.media.filter(m => m.fileType === 'video');
                    return images.length > 0 || videos.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
                        {images.slice(0, 3).map((m, idx) => {
                          const url = m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}`;
                          // Nếu là ảnh thứ 4 và còn nhiều hơn 4 ảnh
                          if (idx === 2 && images.length > 3) {
                            return (
                              <div
                                key={m.mediaId}
                                style={{
                                  position: 'relative',
                                  width: 90,
                                  height: 90,
                                  borderRadius: 8,
                                  overflow: 'hidden',
                                  border: '1.5px solid #1976d2',
                                  background: '#fafafa',
                                  cursor: 'pointer'
                                }}
                                onClick={() => setModalGallery({ images: images.map(img => img.fileUrl.startsWith('/uploads/media/') ? img.fileUrl : `/uploads/media/${img.fileUrl}`), index: idx, open: true })}
                              >
                                <img
                                  src={url}
                                  alt="media"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 900,
                                    fontSize: 28,
                                    background: 'rgba(0,0,0,0.35)'
                                  }}
                                >
                                  +{images.length - 3}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <img
                              key={m.mediaId}
                              src={url}
                              alt="media"
                              style={{
                                width: 90,
                                height: 90,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '1.5px solid #1976d2',
                                background: '#fafafa',
                                cursor: 'pointer'
                              }}
                              onClick={() => setModalGallery({ images: images.map(img => img.fileUrl.startsWith('/uploads/media/') ? img.fileUrl : `/uploads/media/${img.fileUrl}`), index: idx, open: true })}
                            />
                          );
                        })}
                        {/* Video vẫn hiển thị như cũ */}
                        {videos.map(m => {
                          const url = m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}`;
                          return (
                            <video
                              key={m.mediaId}
                              src={url}
                              controls
                              style={{
                                width: 90,
                                height: 90,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '1.5px solid #1976d2',
                                background: '#fafafa'
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : null;
                  })()}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Thêm modal gallery ảnh lớn với <, > */}
      {modalGallery.open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn .2s',
          }}
          onClick={() => setModalGallery(g => ({ ...g, open: false }))}
        >
          <div
            style={{
              position: 'relative',
              background: 'transparent',
              borderRadius: 12,
              boxShadow: '0 4px 32px #0008',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalGallery(g => ({ ...g, open: false }))}
              style={{
                position: 'absolute',
                top: -18,
                right: -18,
                background: '#fff',
                color: '#1976d2',
                border: 'none',
                borderRadius: '50%',
                width: 38,
                height: 38,
                fontSize: 26,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #0004',
                zIndex: 2,
              }}
              title="Đóng"
            >×</button>
            {modalGallery.index > 0 && (
              <button
                onClick={() => setModalGallery(g => ({ ...g, index: g.index - 1 }))}
                style={{
                  position: 'absolute',
                  left: -48,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  color: '#1976d2',
                  border: 'none',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  fontSize: 28,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #0004',
                  zIndex: 2,
                }}
                title="Ảnh trước"
              >&lt;</button>
            )}
            <img
              src={modalGallery.images[modalGallery.index]}
              alt="preview-large"
              style={{
                maxWidth: '80vw',
                maxHeight: '80vh',
                borderRadius: 12,
                boxShadow: '0 2px 16px #0006',
                background: '#fff',
              }}
            />
            {modalGallery.index < modalGallery.images.length - 1 && (
              <button
                onClick={() => setModalGallery(g => ({ ...g, index: g.index + 1 }))}
                style={{
                  position: 'absolute',
                  right: -48,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  color: '#1976d2',
                  border: 'none',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  fontSize: 28,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #0004',
                  zIndex: 2,
                }}
                title="Ảnh tiếp theo"
              >&gt;</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}