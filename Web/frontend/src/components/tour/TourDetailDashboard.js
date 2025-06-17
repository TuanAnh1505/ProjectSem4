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
  const [finalPrice, setFinalPrice] = useState(0);
  const [openScheduleId, setOpenScheduleId] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [expContent, setExpContent] = useState('');
  const [expMedia, setExpMedia] = useState([]);
  const [expLoading, setExpLoading] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const [modalGallery, setModalGallery] = useState({ images: [], index: 0, open: false });
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

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

  const fetchItineraries = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token 
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const schedulesRes = await axios.get(
        `http://localhost:8080/api/schedules/tour/${tourId}`,
        config
      );
      const schedules = schedulesRes.data;

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
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      toast.info(
        <div>
          Bạn cần đăng nhập (hoặc đăng ký) để đặt tour.<br />
          <button
            style={{ marginTop: 8, padding: "4px 12px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
            onClick={() => navigate("/login", { state: { tourId } })}
          >
            Đăng nhập ngay
          </button>
        </div>,
        { autoClose: false, position: "top-center" }
      );
      return;
    }
    if (!userId) {
      toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }
    if (!selectedScheduleId) {
      toast.error("Vui lòng chọn một lịch trình trước khi đặt tour.");
      return;
    }
    setBookingLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/bookings",
        { userId: parseInt(userId), tourId, scheduleId: selectedScheduleId, discountCode },
        { headers: { Authorization: "Bearer " + token } }
      );
      if (res.data && res.data.bookingId) {
        await fetchItineraries();
        const finalPrice = res.data.finalPrice;
        const selectedSchedule = itineraries.find(sch => sch.scheduleId === selectedScheduleId);
        navigate("/booking-passenger", { state: { bookingId: res.data.bookingId, bookingCode: res.data.bookingCode, tourInfo: tour, selectedDate: selectedSchedule?.startDate, itineraries: selectedSchedule?.itineraries || [], finalPrice } });
      } else {
        toast.error("Invalid response from server");
        return;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi đặt tour");
      console.error("Booking error:", err);
    } finally {
      setBookingLoading(false);
    }
  }

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const res = await axios.get(`http://localhost:8080/api/experiences/tour/${tourId}`, config);
      setExperiences(res.data || []);
    } catch (err) {
      console.error('Failed to fetch experiences:', err);
      setExperiences([]);
    }
  };

  useEffect(() => {
    if (tourId) fetchExperiences();
  }, [tourId]);

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      toast.error('Vui lòng đăng nhập để chia sẻ trải nghiệm');
      return;
    }

    setExpLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', expTitle);
      formData.append('content', expContent);
      formData.append('tourId', tourId);
      formData.append('userId', userId);

      if (expMedia && expMedia.length > 0) {
        expMedia.forEach(file => {
          formData.append('files', file);
        });
      }

      const res = await axios.post(
        'http://localhost:8080/api/experiences',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data) {
        toast.success('Trải nghiệm đã được gửi thành công!');
        setExpTitle('');
        setExpContent('');
        setExpMedia([]);
        fetchExperiences();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi trải nghiệm');
    } finally {
      setExpLoading(false);
    }
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axios.get(`http://localhost:8080/api/feedbacks/tour/${tourId}`, config);
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
        setFeedbacks([]);
      } finally {
        setFeedbackLoading(false);
      }
    };

    if (tourId) fetchFeedbacks();
  }, [tourId]);

  if (loading) return <div className="loading">Loading tour details...</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!tour) return <div className="error-box">Tour not found</div>;

  const galleryImages = tour.imageUrls || [];

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
          {galleryImages.length > 0 ? (
            <img
              src={`http://localhost:8080${galleryImages[0]}`}
              alt={tour.name}
              style={{ width: '100%', maxWidth: 420, maxHeight: 320, objectFit: 'cover', borderRadius: 18, border: '6px solid #1976d2', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            />
          ): (
            <div style={{ 
              width: '100%', 
              maxWidth: 420, 
              maxHeight: 320, 
              backgroundColor: '#e3f2fd', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#1976d2', 
              fontWeight: 700,
              borderRadius: 18,
              border: '6px solid #1976d2'
            }}>
              No Image Available
            </div>
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
                        {itinerary.description && (
                          <div>
                            <b>Mô tả:</b>
                            <span
                              style={{ whiteSpace: 'pre-line' }}
                              dangerouslySetInnerHTML={{
                                __html: itinerary.description.replace(/(\(?\d{2}:\d{2}\s*[–-]\s*\d{2}:\d{2}\)?)/g, match => `<b>${match}</b>`)
                              }}
                            />
                          </div>
                        )}
                        {/* {itinerary.type && <div><b>Loại:</b> {itinerary.type}</div>} */}
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
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 16,
            background: '#fff', 
            borderRadius: 12, 
            padding: 24, 
            boxShadow: '0 2px 8px #e3e8f0' 
          }}>
            {/* Main image */}
            <div style={{ 
              width: '100%', 
              height: 400, 
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden'
            }}>
              <img
                src={`http://localhost:8080${galleryImages[modalGallery.index || 0]}`}
                alt={tour.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 12,
                }}
              />
            </div>
            
            {/* Thumbnails */}
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              overflowX: 'auto',
              padding: '8px 0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}>
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setModalGallery({
                    images: galleryImages.map(url => `http://localhost:8080${url}`),
                    index: idx,
                    open: true
                  })}
                  style={{
                    flex: '0 0 auto',
                    width: 100,
                    height: 70,
                    cursor: 'pointer',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: `2px solid ${(modalGallery.index || 0) === idx ? '#1976d2' : '#e3e8f0'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={`http://localhost:8080${img}`}
                    alt={`thumbnail-${idx}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal gallery */}
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
          }}
          onClick={() => setModalGallery(g => ({ ...g, open: false }))}
        >
          <div
            style={{
              position: 'relative',
              background: 'transparent',
              borderRadius: 12,
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