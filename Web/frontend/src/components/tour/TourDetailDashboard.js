import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/tour/TourDetailDashboard.module.css';
import { toast } from 'react-toastify';

export default function TourDetailDashboard() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [itineraries, setItineraries] = useState([]);
  const [openScheduleId, setOpenScheduleId] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  // Trải nghiệm
  const [experiences, setExperiences] = useState([]);
  const [expContent, setExpContent] = useState('');
  const [expMedia, setExpMedia] = useState([]);
  const [expLoading, setExpLoading] = useState(false);
  const [expTitle, setExpTitle] = useState('');

  // Modal gallery
  const [modalGallery, setModalGallery] = useState({ images: [], index: 0, open: false });

  // Feedback
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // Gallery images (nếu có nhiều ảnh, ở đây demo chỉ lấy 1 ảnh chính)
  const galleryImages = tour?.images || (tour?.imageUrl ? [tour.imageUrl] : []);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const maxThumbs = 4;
  const showThumbs = galleryImages.slice(0, maxThumbs);
  const extraCount = galleryImages.length - maxThumbs;

  // Overlay media modal state
  const [mediaOverlay, setMediaOverlay] = useState({ open: false, type: '', url: '' });

  // State để điều khiển hiển thị form chia sẻ trải nghiệm
  const [showExpForm, setShowExpForm] = useState(false);

  // Các tour khác
  const [otherTours, setOtherTours] = useState([]);
  const [otherToursLoading, setOtherToursLoading] = useState(true);
  const [otherToursError, setOtherToursError] = useState('');

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
        fetchRelatedTours(res.data);
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
        { userId: parseInt(userId), tourId, scheduleId: selectedScheduleId },
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

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setFeedbackLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/feedbacks?tourId=${tourId}`);
        setFeedbacks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setFeedbacks([]);
      }
      setFeedbackLoading(false);
    };
    if (tourId) fetchFeedbacks();
  }, [tourId]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/tours?limit=6');
        const sixTours = Array.isArray(res.data) ? res.data.slice(0, 6) : [];
        setOtherTours(sixTours);
        setOtherToursError('');
      } catch (err) {
        setOtherToursError('Không thể tải các tour khác.');
      } finally {
        setOtherToursLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) return <div className="loading">Loading tour details...</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!tour) return <div className="error-box">Tour not found</div>;

  return (
    <div className={styles['tdd-container']}>
      {/* Top section: Title centered */}
      <div className={styles['tdd-titleSection']}>
        <h1 className={styles['tdd-mainTitle']}>{tour.name}</h1>
        <p className={styles['tdd-subtitle']}>{tour.description}</p>
      </div>

      {/* Main content wrapper */}
      <div className={styles['tdd-mainContent']}>
        {/* Left content area */}
        <div className={styles['tdd-leftContent']}>
          {/* Main image always above the gallery section title */}
          {galleryImages.length > 0 && (
            <div className={styles['tdd-mainImgWrap']} style={{marginBottom: 24}}>
              <img
                src={`http://localhost:8080${galleryImages[mainImgIdx]}`}
                alt="main-img"
                className={styles['tdd-mainImg']}
                onClick={() => setModalGallery({ images: galleryImages.map(i => `http://localhost:8080${i}`), index: mainImgIdx, open: true })}
                style={{ cursor: 'pointer', maxWidth: '900px', width: '100%' }}
              />
            </div>
          )}
          {/* Gallery thumbnails/gallery below, no section title */}
          {galleryImages.length === 0 && (
            <div style={{width:'100%',height:'220px',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5fafd',borderRadius:12,border:'1.5px dashed #b0bec5',color:'#90a4ae',fontSize:22,fontWeight:600,marginBottom:24}}>
              Chưa có ảnh cho tour này
            </div>
          )}
          {galleryImages.length > 1 && (
            <div className={styles['tdd-galleryFlex']} style={{marginBottom:24}}>
              {/* Thumbnails left */}
              <div className={styles['tdd-galleryThumbs']}>
                {showThumbs.map((img, idx) => (
                  <div
                    key={idx}
                    className={styles['tdd-thumbItem'] + (mainImgIdx === idx ? ' active' : '')}
                    onClick={() => setMainImgIdx(idx)}
                  >
                    <img
                      src={`http://localhost:8080${img}`}
                      alt={`thumb-${idx}`}
                      className={styles['tdd-thumbImg']}
                    />
                    {idx === maxThumbs - 1 && extraCount > 0 && (
                      <div className={styles['tdd-thumbOverlay']}>+{extraCount}</div>
                    )}
                  </div>
                ))}
              </div>
              {/* Main image right */}
              <div className={styles['tdd-mainImgWrap']}>
                <img
                  src={`http://localhost:8080${galleryImages[mainImgIdx]}`}
                  alt="main-img"
                  className={styles['tdd-mainImg']}
                  onClick={() => setModalGallery({ images: galleryImages.map(i => `http://localhost:8080${i}`), index: mainImgIdx, open: true })}
                  style={{ cursor: 'pointer', maxWidth: '900px', width: '100%' }}
                />
              </div>
            </div>
          )}
        </div>
        {/* Right sidebar - Booking section */}
        <div className={styles['tdd-rightSidebar']}>
          <div className={styles['tdd-bookingCard']} style={{ background: '#fff', borderRadius: 18, padding: 0, boxShadow: '0 4px 18px rgba(25, 118, 210, 0.10)', border: '1.5px solid #e0e0e0', marginBottom: 28 }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'transparent',
              borderRadius: 18,
              margin: 0,
              boxShadow: 'none',
              overflow: 'visible',
              border: 'none',
              gap: 0,
              padding: '18px 0',
              fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
            }}>
              {/* Giá */}
              <div style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#fffde7"/><path d="M12 7v7m0 0c-1.5 0-2.5 1-2.5 2s1 2 2.5 2 2.5-1 2.5-2-1-2-2.5-2z" stroke="#b8860b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="1" fill="#b8860b"/></svg>
                <div style={{ fontWeight: 700, fontSize: 15, margin: '6px 0 2px 0', color: '#222', fontFamily: 'inherit' }}>Giá</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#222', letterSpacing: 0.5, fontFamily: 'inherit' }}>{tour.price?.toLocaleString()}<span style={{ color: '#00b4d8', fontWeight: 800, marginLeft: 2 }}>đ</span></div>
              </div>
              {/* Thời gian */}
              <div style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#e3f7fe"/><path d="M12 7v5l3 2" stroke="#1976d2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="7" stroke="#1976d2" strokeWidth="1.2"/></svg>
                <div style={{ fontWeight: 700, fontSize: 15, margin: '6px 0 2px 0', color: '#222', fontFamily: 'inherit' }}>Thời gian</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#222', letterSpacing: 0.5, fontFamily: 'inherit' }}>{tour.duration} ngày</div>
              </div>
              {/* Số lượng */}
              <div style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#f3eafe"/><path d="M8.5 15c-1.38 0-2.5-1.12-2.5-2.5S7.12 10 8.5 10s2.5 1.12 2.5 2.5S9.88 15 8.5 15zm7 0c-1.38 0-2.5-1.12-2.5-2.5S14.12 10 15.5 10s2.5 1.12 2.5 2.5S16.88 15 15.5 15z" stroke="#7c4dff" strokeWidth="1.2"/></svg>
                <div style={{ fontWeight: 700, fontSize: 15, margin: '6px 0 2px 0', color: '#222', fontFamily: 'inherit' }}>Số lượng</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#222', letterSpacing: 0.5, fontFamily: 'inherit' }}>{tour.maxParticipants} khách</div>
              </div>
            </div>
            <div className={styles['tdd-bookingForm']} style={{ padding: 20, paddingTop: 0, fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
              <label className={styles['tdd-bookingLabel']} style={{ fontWeight: 700, color: '#222', fontSize: 17, marginBottom: 6, fontFamily: 'inherit' }}>Chọn lịch trình:</label>
              <select
                value={selectedScheduleId || ''}
                onChange={e => setSelectedScheduleId(Number(e.target.value))}
                className={styles['tdd-bookingSelect']}
                style={{ padding: '12px 16px', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: 16, background: '#f8fbfd', marginBottom: 4, fontFamily: 'inherit' }}
              >
                <option value="">-- Chọn lịch trình --</option>
                {itineraries.map(sch => (
                  <option
                    key={sch.scheduleId}
                    value={sch.scheduleId}
                    disabled={sch.status === 'full' || sch.status === 'closed'}
                  >
                    {sch.startDate} - {sch.endDate}
                    {sch.status === 'full' ? ' (Đã đủ người)' : sch.status === 'closed' ? ' (Đã đóng)' : ' (Còn chỗ)'} -
                    {sch.currentParticipants || 0}/{tour.maxParticipants} người
                  </option>
                ))}
              </select>
              {selectedScheduleId && ['full', 'closed'].includes(
                itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status
              ) && (
                <div className={styles['tdd-bookingWarning']} style={{ color: '#d32f2f', fontWeight: 700, margin: '8px 0', fontFamily: 'inherit' }}>
                  {itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full'
                    ? '⚠️ Lịch trình này đã hết chỗ! Bạn không thể đặt thêm.'
                    : '⚠️ Lịch trình này đã đóng! Bạn không thể đặt thêm.'}
                </div>
              )}
              <button
                onClick={handleBooking}
                disabled={bookingLoading || !selectedScheduleId ||
                  ['full', 'closed'].includes(
                    itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status
                  )}
                className={`${styles['tdd-bookingBtn']} 
                  ${itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full'
                    ? styles['tdd-bookingBtnFull'] : ''} 
                  ${(bookingLoading || !selectedScheduleId ||
                    ['full', 'closed'].includes(
                      itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status
                    )) ? styles['tdd-bookingBtnDisabled'] : ''}`}
                style={{ marginTop: 24, borderRadius: 18, fontWeight: 800, fontSize: 22, letterSpacing: 1, background: '#b0bec5', color: '#fff', opacity: (bookingLoading || !selectedScheduleId || ['full', 'closed'].includes(itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status)) ? 0.7 : 1, boxShadow: '0 2px 12px #e3e8f0', padding: '18px 0', fontFamily: 'inherit' }}
              >
                {bookingLoading ? 'Đang xử lý...' :
                  itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full'
                    ? 'Đã đủ người'
                    : itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'closed'
                      ? 'Đã đóng'
                      : 'Đặt ngay'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule section moved outside mainContent for full width */}
      <div className={styles['tdd-scheduleSection']}>
        <div className={styles['tdd-sectionTitle']}>LỊCH TRÌNH</div>
        <div className={styles['tdd-scheduleWrapper']}>
          <div className={styles['tdd-scheduleContent']}>
            {itineraries.length > 0 ? (
              itineraries.map((schedule, idx) => (
                <div
                  key={schedule.scheduleId}
                  className={
                    styles['tdd-scheduleItem'] +
                    (schedule.status === 'full'
                      ? ' ' + styles['tdd-scheduleItemFull']
                      : schedule.status === 'closed'
                      ? ' ' + styles['tdd-scheduleItemClosed']
                      : '')
                  }
                >
                  <div
                    className={
                      styles['tdd-scheduleHeader'] +
                      (schedule.status === 'full'
                        ? ' ' + styles['tdd-scheduleHeaderFull']
                        : schedule.status === 'closed'
                        ? ' ' + styles['tdd-scheduleHeaderClosed']
                        : ' ' + styles['tdd-scheduleHeaderDefault'])
                    }
                    onClick={() => setOpenScheduleId(openScheduleId === schedule.scheduleId ? null : schedule.scheduleId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles['tdd-scheduleInfo']}>
                      <div className={styles['tdd-scheduleDate']}>
                        Lịch trình {idx + 1}: {schedule.startDate} - {schedule.endDate}
                        <span className={styles['tdd-scheduleTime']}>
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        className={
                          styles['tdd-scheduleStatus'] +
                          (schedule.status === 'full'
                            ? ' ' + styles['tdd-scheduleStatusFull']
                            : schedule.status === 'closed'
                            ? ' ' + styles['tdd-scheduleStatusClosed']
                            : '')
                        }
                      >
                        {schedule.status === 'full' ? 'Đã đủ người' : schedule.status === 'closed' ? 'Đã đóng' : 'Còn chỗ'}
                        ({schedule.currentParticipants || 0}/{tour.maxParticipants})
                      </span>
                      <span className={styles['tdd-scheduleArrow'] + (openScheduleId === schedule.scheduleId ? ' ' + styles['tdd-scheduleArrowOpen'] : '')}>
                        ▼
                      </span>
                    </div>
                  </div>
                  {openScheduleId === schedule.scheduleId && schedule.itineraries && schedule.itineraries.length > 0 ? (
                    <ul className={styles['tdd-itineraryList']}>
                      {schedule.itineraries.map((itinerary, i) => (
                        <li key={itinerary.itineraryId} className={styles['tdd-itineraryItem']}>
                          <div className={styles['tdd-itineraryTitle']}>Ngày {i + 1}: {itinerary.title}</div>
                          <div className={styles['tdd-itineraryTime']}>
                            {itinerary.startTime && <span><b>Bắt đầu:</b> {formatTime(itinerary.startTime)}</span>}
                            {itinerary.endTime && <span><b>Kết thúc:</b> {formatTime(itinerary.endTime)}</span>}
                          </div>
                          {itinerary.description && (
                            <div className={styles['tdd-itineraryDesc']}>
                              <b>Chi tiết:</b>
                              <p>{itinerary.description}</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : <div className={styles['tdd-noSchedule']}>Không có lịch trình cho ngày này.</div>}
                </div>
              ))
            ) : <div className={styles['tdd-noSchedule']}>Chưa có lịch trình cho tour này</div>}
          </div>
        </div>
      </div>

      {/* Other sections */}
      {/* --- Chia sẻ trải nghiệm --- */}
      <div className={styles['tdd-expSection']}>
        <div className={styles['tdd-expFormWrapper']} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #e3e8f0', padding: 28, marginBottom: 32 }}>
          <h2 className={styles['tdd-expTitle']} style={{ color: '#1976d2', fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Chia sẻ trải nghiệm của bạn</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 18px 0' }}>
            <input
              type="checkbox"
              id="showExpForm"
              checked={showExpForm}
              onChange={e => setShowExpForm(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: '#1976d2', cursor: 'pointer' }}
            />
            <label htmlFor="showExpForm" style={{ fontWeight: 600, color: '#1976d2', fontSize: 17, cursor: 'pointer', userSelect: 'none' }}>
              Tôi muốn chia sẻ trải nghiệm
            </label>
          </div>
          {showExpForm && (
            <>
              <div className={styles['tdd-expDesc']} style={{ color: '#444', fontSize: 15, marginBottom: 10 }}>
                Hãy chia sẻ cảm nhận, hình ảnh hoặc video về chuyến đi để truyền cảm hứng cho cộng đồng du lịch!
              </div>
              <form onSubmit={handleExpSubmit} style={{ width: '100%' }}>
                <input
                  type="text"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  placeholder="Ví dụ: Chuyến đi Nha Trang tuyệt vời!"
                  required
                  className={styles['tdd-expInput']}
                  style={{ marginBottom: 12, fontSize: 16, borderRadius: 8, border: '1.5px solid #b0bec5', padding: '12px 14px' }}
                />
                <textarea
                  value={expContent}
                  onChange={e => setExpContent(e.target.value)}
                  placeholder="Chia sẻ cảm nhận, kinh nghiệm, kỷ niệm đáng nhớ... Ví dụ: Mình đã có trải nghiệm tuyệt vời khi tham quan Vinpearl, biển rất đẹp, đồ ăn ngon, hướng dẫn viên nhiệt tình..."
                  required
                  className={styles['tdd-expTextarea']}
                  style={{ marginBottom: 12, fontSize: 16, borderRadius: 8, border: '1.5px solid #b0bec5', padding: '12px 14px', minHeight: 90 }}
                />
                <label htmlFor="expMediaInput" className={styles['tdd-expMediaLabel']} style={{ color: '#1976d2', fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>📷</span>
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
                  <div className={styles['tdd-expMediaList']} style={{ marginBottom: 12 }}>
                    {expMedia.map((file, idx) => {
                      const url = URL.createObjectURL(file);
                      return (
                        <div key={idx} style={{ position: 'relative', display: 'inline-block', boxShadow: '0 2px 8px #e3e8f0', borderRadius: 8, marginRight: 8 }}>
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
                  className={styles['tdd-expBtn'] + (expLoading ? ' ' + styles['tdd-expBtnDisabled'] : '')}
                  style={{ marginTop: 10, borderRadius: 10, fontWeight: 800, fontSize: 18, background: '#1976d2', color: '#fff', padding: '14px 0', width: 180, boxShadow: '0 2px 8px #e3e8f0', border: 'none', letterSpacing: 1 }}
                >
                  {expLoading ? 'Đang gửi...' : 'Gửi trải nghiệm'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Hiển thị danh sách trải nghiệm đã chia sẻ */}
      <div className={styles['tdd-sharedExpSection']} style={{ marginTop: 56 }}>
        <h3 style={{
          fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          fontWeight: 900,
          color: '#222',
          fontSize: 26,
          textAlign: 'center',
          marginBottom: 8,
          letterSpacing: 1.1,
        }}>Các trải nghiệm đã chia sẻ</h3>
        <div style={{
          width: 54,
          height: 3,
          background: 'linear-gradient(90deg, #1976d2 60%, #00b4d8 100%)',
          borderRadius: 2,
          margin: '0 auto 32px auto',
        }} />
        {(!Array.isArray(experiences) || experiences.length === 0) ? (
          <div style={{ textAlign: 'center', color: '#b0bec5', fontWeight: 600, fontSize: 20, padding: '36px 0' }}>
            <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>😔</span>
            Chưa có trải nghiệm nào cho tour này.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            width: '100%',
            maxWidth: 1100,
            margin: '0 auto',
          }}>
            {(Array.isArray(experiences) ? experiences : [])
              .filter(exp => (exp.status || '').toLowerCase() === 'approved')
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4)
              .map(exp => {
                const images = (exp.mediaList || []).filter(m => m.fileType === 'image');
                const videos = (exp.mediaList || []).filter(m => m.fileType === 'video');
                return (
                  <div key={exp.experienceId} style={{
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: 22,
                    boxShadow: '0 4px 24px #e3e8f0',
                    padding: 28,
                    fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    minHeight: 220,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                      <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#e3f2fd', border: '3px solid #1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#1976d2' }}>
                        {exp.userFullName ? exp.userFullName[0].toUpperCase() : 'A'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 18, color: '#1976d2', marginBottom: 2 }}>{exp.userFullName || 'Ẩn danh'}</div>
                        <div style={{ fontSize: 14, color: '#90a4ae', fontWeight: 600 }}>{exp.createdAt && (new Date(exp.createdAt).toLocaleString())}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 19, color: '#222', marginBottom: 8, fontFamily: 'inherit' }}>{exp.title || 'Trải nghiệm'}</div>
                    <div style={{ color: '#444', fontSize: 16, marginBottom: 12, fontFamily: 'inherit', lineHeight: 1.6 }}>{exp.content}</div>
                    {(images.length > 0 || videos.length > 0) && (
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                        {images.slice(0, 3).map((m, idx) => (
                          <img
                            key={m.mediaId}
                            src={m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}`}
                            alt="exp-img"
                            style={{ cursor: 'pointer', width: 92, height: 92, objectFit: 'cover', borderRadius: 12, border: '2px solid #e0e0e0', background: '#fafafa', transition: 'transform 0.18s', boxShadow: '0 2px 8px #e3e8f0' }}
                            onClick={() => setMediaOverlay({ open: true, type: 'image', url: m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}` })}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'none'}
                          />
                        ))}
                        {videos.map(m => {
                          const url = m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}`;
                          return (
                            <video
                              key={m.mediaId}
                              src={url}
                              controls
                              style={{ cursor: 'pointer', width: 92, height: 92, objectFit: 'cover', borderRadius: 12, border: '2px solid #e0e0e0', background: '#fafafa', transition: 'transform 0.18s', boxShadow: '0 2px 8px #e3e8f0' }}
                              onClick={e => { e.preventDefault(); setMediaOverlay({ open: true, type: 'video', url }); }}
                              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                              onMouseOut={e => e.currentTarget.style.transform = 'none'}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Hiển thị danh sách feedback (đánh giá) */}
      <div className={styles['tdd-feedbackSection']} style={{ marginTop: 56 }}>
        <h3 style={{
          fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          fontWeight: 900,
          color: '#222',
          fontSize: 26,
          textAlign: 'center',
          marginBottom: 8,
          letterSpacing: 1.1,
        }}>Đánh giá của khách hàng</h3>
        <div style={{
          width: 54,
          height: 3,
          background: 'linear-gradient(90deg, #1976d2 60%, #00b4d8 100%)',
          borderRadius: 2,
          margin: '0 auto 32px auto',
        }} />
        {feedbackLoading ? (
          <div style={{ fontFamily: 'inherit', color: '#b0bec5', fontWeight: 600, textAlign: 'center', fontSize: 20, padding: '36px 0' }}>Đang tải đánh giá...</div>
        ) : feedbacks.length === 0 ? (
          <div style={{ fontFamily: 'inherit', color: '#b0bec5', fontWeight: 600, textAlign: 'center', fontSize: 20, padding: '36px 0' }}>
            <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>📝</span>
            Chưa có đánh giá nào cho tour này.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            width: '100%',
            maxWidth: 1100,
            margin: '0 auto',
          }}>
            {feedbacks
              .filter(fb => (fb.statusName || '').toLowerCase() === 'approved')
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4)
              .map(fb => (
                <div key={fb.feedbackId} style={{
                  background: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 22,
                  boxShadow: '0 4px 24px #e3e8f0',
                  padding: 28,
                  fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  minHeight: 180,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f5f5f5', border: '3px solid #1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#1976d2' }}>
                      {fb.userFullName ? fb.userFullName[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1976d2', fontSize: 17 }}>{fb.userFullName || 'Ẩn danh'}</div>
                      <div style={{ color: '#90a4ae', fontSize: 13, fontWeight: 600 }}>{fb.createdAt && (new Date(fb.createdAt).toLocaleString())}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    {Array.from({ length: fb.rating }, (_, i) => <span key={i} style={{ color: '#FFD700', fontSize: 22, marginRight: 2 }}>★</span>)}
                    {Array.from({ length: 5 - fb.rating }, (_, i) => <span key={i} style={{ color: '#e0e0e0', fontSize: 22, marginRight: 2 }}>★</span>)}
                  </div>
                  <div style={{ color: '#222', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{fb.message}</div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal Gallery */}
      {modalGallery.open && (
        <div className={styles['tdd-modalGallery']} onClick={() => setModalGallery(g => ({ ...g, open: false }))}>
          <div className={styles['tdd-modalGalleryContent']} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setModalGallery(g => ({ ...g, open: false }))}
              className={styles['tdd-modalGalleryBtn'] + ' ' + styles['tdd-modalGalleryBtnClose']}
              title="Đóng"
            >×</button>
            {modalGallery.index > 0 && (
              <button
                onClick={() => setModalGallery(g => ({ ...g, index: g.index - 1 }))}
                className={styles['tdd-modalGalleryBtn'] + ' ' + styles['tdd-modalGalleryBtnPrev']}
                title="Ảnh trước"
              >&lt;</button>
            )}
            <img
              src={modalGallery.images[modalGallery.index]}
              alt="preview-large"
              className={styles['tdd-modalGalleryImg']}
            />
            {modalGallery.index < modalGallery.images.length - 1 && (
              <button
                onClick={() => setModalGallery(g => ({ ...g, index: g.index + 1 }))}
                className={styles['tdd-modalGalleryBtn'] + ' ' + styles['tdd-modalGalleryBtnNext']}
                title="Ảnh tiếp theo"
              >&gt;</button>
            )}
            {/* Thumbnails in modal */}
            {modalGallery.images.length > 1 && (
              <div className={styles['tdd-modalGalleryThumbsWrap']}>
                <div className={styles['tdd-modalGalleryThumbsLabel']}>Tất cả ảnh ({modalGallery.images.length})</div>
                <div className={styles['tdd-modalGalleryThumbs']}>
                  {modalGallery.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`modal-thumb-${idx}`}
                      className={
                        styles['tdd-modalGalleryThumb'] +
                        (modalGallery.index === idx ? ' ' + styles['tdd-modalGalleryThumbActive'] : '')
                      }
                      onClick={() => setModalGallery(g => ({ ...g, index: idx }))}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay for shared experience media */}
      {mediaOverlay.open && (
        <div
          style={{
            position: 'fixed', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setMediaOverlay({ open: false, type: '', url: '' })}
        >
          <div
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', background: 'transparent' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setMediaOverlay({ open: false, type: '', url: '' })}
              style={{
                position: 'absolute', top: -32, right: -32, background: '#fff', color: '#1976d2', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: 28, fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 8px #0002', zIndex: 2
              }}
              title="Đóng"
            >×</button>
            {mediaOverlay.type === 'image' ? (
              <img
                src={mediaOverlay.url}
                alt="overlay-img"
                style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 4px 32px #0008', background: '#fff' }}
              />
            ) : (
              <video
                src={mediaOverlay.url}
                controls
                autoPlay
                style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 4px 32px #0008', background: '#fff' }}
              />
            )}
          </div>
        </div>
      )}

      {/* Các tour khác */}
      <div style={{ margin: '56px 0 0 0', width: '100%' }}>
        <h2 style={{
          fontWeight: 900,
          fontSize: 28,
          color: '#222',
          marginBottom: 8,
          fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          textAlign: 'center',
          letterSpacing: 1.2,
        }}>Các tour khác</h2>
        <div style={{
          width: 60,
          height: 4,
          background: 'linear-gradient(90deg, #1976d2 60%, #00b4d8 100%)',
          borderRadius: 2,
          margin: '0 auto 32px auto',
        }} />
        {otherToursLoading ? (
          <div style={{ color: '#888', fontWeight: 500, textAlign: 'center' }}>Đang tải...</div>
        ) : otherToursError ? (
          <div style={{ color: '#d32f2f', fontWeight: 600, textAlign: 'center' }}>{otherToursError}</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 36,
            width: '100%',
            maxWidth: 1100,
            margin: '0 auto',
          }}>
            {otherTours.slice(0, 3).map(tour => (
              <div
                key={tour.tourId}
                style={{
                  background: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 28,
                  boxShadow: '0 6px 32px #e3e8f0',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  transition: 'box-shadow 0.22s, transform 0.22s, border 0.22s',
                  cursor: 'pointer',
                  minHeight: 340,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => navigate(`/tours/${tour.tourId}`)}
                onMouseOver={e => {
                  e.currentTarget.style.boxShadow = '0 12px 40px #b0e0ff55';
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.025)';
                  e.currentTarget.style.border = '1.5px solid #1976d2';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.boxShadow = '0 6px 32px #e3e8f0';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.border = '1px solid #e0e0e0';
                }}
              >
                <div style={{ width: '100%', height: 150, overflow: 'hidden', borderTopLeftRadius: 28, borderTopRightRadius: 28, position: 'relative' }}>
                  <img
                    src={tour.imageUrl ? `http://localhost:8080${tour.imageUrl}` : '/no-image.png'}
                    alt={tour.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: 28, borderTopRightRadius: 28, transition: 'filter 0.2s', filter: 'brightness(0.96)' }}
                    onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.08)'}
                    onMouseOut={e => e.currentTarget.style.filter = 'brightness(0.96)'}
                  />
                  {/* Price badge */}
                  <div style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: 'linear-gradient(90deg, #ffb300 60%, #ff7043 100%)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 16,
                    padding: '6px 16px',
                    borderRadius: 16,
                    boxShadow: '0 2px 8px #ffb30033',
                    letterSpacing: 0.5,
                  }}>{tour.price?.toLocaleString()} đ</div>
                  {/* Overlay gradient for text readability */}
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0, bottom: 0, height: 38,
                    background: 'linear-gradient(0deg, #fff 60%, #fff0 100%)',
                  }} />
                </div>
                <div style={{ padding: '18px 18px 14px 18px', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: '#222', marginBottom: 8, textAlign: 'left', fontFamily: 'inherit', minHeight: 44, display: 'flex', alignItems: 'center' }}>{tour.name}</div>
                  <div style={{ color: '#888', fontSize: 15, marginBottom: 10, textAlign: 'left', fontWeight: 500, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {tour.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>📍<span>{tour.location}</span></span>}
                    {tour.duration && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>🕒<span>{tour.duration} ngày</span></span>}
                    {tour.maxParticipants && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>👥<span>{tour.maxParticipants} khách</span></span>}
                  </div>
                  <button
                    style={{
                      background: 'transparent',
                      color: '#1976d2',
                      border: '2px solid #1976d2',
                      borderRadius: 18,
                      padding: '10px 0',
                      fontWeight: 800,
                      fontSize: 16,
                      width: '100%',
                      marginTop: 'auto',
                      boxShadow: 'none',
                      letterSpacing: 1,
                      transition: 'background 0.18s, color 0.18s',
                      cursor: 'pointer',
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/tours/${tour.tourId}`);
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = '#1976d2';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#1976d2';
                    }}
                  >Xem chi tiết</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}