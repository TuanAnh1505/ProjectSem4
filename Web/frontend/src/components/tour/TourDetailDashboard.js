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

  // Feedback state
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // Thêm state cho gallery images
  const [galleryImages, setGalleryImages] = useState([]);

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
    // Lấy gallery images từ API riêng
    const fetchGalleryImages = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/tours/${tourId}/images`);
        setGalleryImages(res.data || []);
      } catch (err) {
        setGalleryImages([]);
      }
    };
    if (tourId) fetchGalleryImages();
  }, [tourId]);

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
          <div className={styles['tdd-bookingCard']}>
            <div className={styles['tdd-bookingStats']}>
              <div className={styles['tdd-statItem']}>
                <span className={styles['tdd-statIcon']}>💰</span>
                <span className={styles['tdd-statLabel']}>Giá</span>
                <span className={styles['tdd-statValue']}>{tour.price?.toLocaleString()}đ</span>
              </div>
              <div className={styles['tdd-statItem']}>
                <span className={styles['tdd-statIcon']}>⏳</span>
                <span className={styles['tdd-statLabel']}>Thời gian</span>
                <span className={styles['tdd-statValue']}>{tour.duration} ngày</span>
              </div>
              <div className={styles['tdd-statItem']}>
                <span className={styles['tdd-statIcon']}>👥</span>
                <span className={styles['tdd-statLabel']}>Số lượng</span>
                <span className={styles['tdd-statValue']}>{tour.maxParticipants} khách</span>
              </div>
            </div>

            <div className={styles['tdd-bookingForm']}>
              <label className={styles['tdd-bookingLabel']}>Chọn lịch trình:</label>
              <select
                value={selectedScheduleId || ''}
                onChange={e => setSelectedScheduleId(Number(e.target.value))}
                className={styles['tdd-bookingSelect']}
              >
                <option value="">-- Chọn lịch trình --</option>
                {itineraries.map(sch => (
                  <option
                    key={sch.scheduleId}
                    value={sch.scheduleId}
                    disabled={sch.status === 'full' || sch.status === 'closed'}
                  >
                    {sch.startDate} - {sch.endDate}
                    {sch.status === 'full' ? ' (Đã đủ người)' :
                     sch.status === 'closed' ? ' (Đã đóng)' : ' (Còn chỗ)'} -
                    {sch.currentParticipants || 0}/{tour.maxParticipants} người
                  </option>
                ))}
              </select>

              {selectedScheduleId && ['full', 'closed'].includes(
                itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status
              ) && (
                <div className={styles['tdd-bookingWarning']}>
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
        <div className={styles['tdd-expFormWrapper']}>
          <h2 className={styles['tdd-expTitle']}>Chia sẻ trải nghiệm của bạn</h2>
          <div className={styles['tdd-expDesc']}>
            Hãy chia sẻ cảm nhận, hình ảnh hoặc video về chuyến đi để truyền cảm hứng cho cộng đồng du lịch!
          </div>
          <form onSubmit={handleExpSubmit} style={{ width: '100%' }}>
            <input
              type="text"
              value={expTitle}
              onChange={e => setExpTitle(e.target.value)}
              placeholder="Tiêu đề trải nghiệm"
              required
              className={styles['tdd-expInput']}
              onFocus={e => e.target.style.border = '2px solid #1565c0'}
              onBlur={e => e.target.style.border = '2px solid #1976d2'}
            />
            <textarea
              value={expContent}
              onChange={e => setExpContent(e.target.value)}
              placeholder="Cảm nhận, kinh nghiệm, kỷ niệm đáng nhớ..."
              required
              className={styles['tdd-expTextarea']}
              onFocus={e => e.target.style.border = '2px solid #1565c0'}
              onBlur={e => e.target.style.border = '2px solid #1976d2'}
            />
            <label htmlFor="expMediaInput" className={styles['tdd-expMediaLabel']}>
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
              <div className={styles['tdd-expMediaList']}>
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
              className={
                styles['tdd-expBtn'] + (expLoading ? ' ' + styles['tdd-expBtnDisabled'] : '')
              }
            >
              {expLoading ? 'Đang gửi...' : 'Gửi trải nghiệm'}
            </button>
          </form>
        </div>
      </div>

      {/* Hiển thị danh sách trải nghiệm đã chia sẻ */}
      <div className={styles['tdd-sharedExpSection']}>
        <h3 className={styles['tdd-sharedExpTitle']}>
          Các trải nghiệm đã chia sẻ
        </h3>
        {(!Array.isArray(experiences) || experiences.length === 0) ? (
          <div className={styles['tdd-noExp']}>
            Chưa có trải nghiệm nào cho tour này.
          </div>
        ) : (
          <div className={styles['tdd-sharedExpList']}>
            {(Array.isArray(experiences) ? experiences : [])
              .filter(exp => (exp.status || '').toLowerCase() === 'approved')
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4)
              .map(exp => {
                const images = (exp.mediaList || []).filter(m => m.fileType === 'image');
                const videos = (exp.mediaList || []).filter(m => m.fileType === 'video');
                return (
                  <div key={exp.experienceId} className={styles['tdd-sharedExpCard']}>
                    <div className={styles['tdd-sharedExpCardTitle']}>{exp.title || 'Trải nghiệm'}</div>
                    <div className={styles['tdd-sharedExpCardUser']}>
                      👤 {exp.userFullName || 'Ẩn danh'}
                    </div>
                    <div className={styles['tdd-sharedExpCardDate']}>
                      {exp.createdAt && (new Date(exp.createdAt).toLocaleString())}
                    </div>
                    <div className={styles['tdd-sharedExpCardContent']}>{exp.content}</div>
                    {(images.length > 0 || videos.length > 0) && (
                      <div className={styles['tdd-sharedExpCardMedia']}>
                        {images.slice(0, 3).map((m, idx) => (
                          <img
                            key={m.mediaId}
                            src={m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}`}
                            alt="exp-img"
                            className={styles['tdd-sharedExpCardImg']}
                          />
                        ))}
                        {videos.map(m => {
                          const url = m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}`;
                          return (
                            <video
                              key={m.mediaId}
                              src={url}
                              controls
                              className={styles['tdd-sharedExpCardVideo']}
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
      <div className={styles['tdd-feedbackSection']}>
        <h3 className={styles['tdd-feedbackTitle']}>
          Đánh giá của khách hàng
        </h3>
        {feedbackLoading ? (
          <div>Đang tải đánh giá...</div>
        ) : feedbacks.length === 0 ? (
          <div className={styles['tdd-noFeedback']}>
            Chưa có đánh giá nào cho tour này.
          </div>
        ) : (
          <div className={styles['tdd-feedbackList']}>
            {feedbacks
              .filter(fb => (fb.statusName || '').toLowerCase() === 'approved')
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4)
              .map(fb => (
                <div key={fb.feedbackId} className={styles['tdd-feedbackCard']}>
                  <div className={styles['tdd-feedbackCardStars']}>
                    {Array.from({ length: fb.rating }, (_, i) => <span key={i} style={{ color: '#FFD700', fontSize: 22 }}>★</span>)}
                    {Array.from({ length: 5 - fb.rating }, (_, i) => <span key={i} style={{ color: '#e0e0e0', fontSize: 22 }}>★</span>)}
                  </div>
                  <div className={styles['tdd-feedbackCardUser']}>
                    👤 {fb.userFullName || 'Ẩn danh'}
                  </div>
                  <div className={styles['tdd-feedbackCardDate']}>
                    {fb.createdAt && (new Date(fb.createdAt).toLocaleString())}
                  </div>
                  <div className={styles['tdd-feedbackCardContent']}>
                    {fb.message}
                  </div>
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
    </div>
  );
}