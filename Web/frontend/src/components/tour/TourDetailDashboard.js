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
  const [experiences, setExperiences] = useState([]);
  const [expContent, setExpContent] = useState('');
  const [expMedia, setExpMedia] = useState([]);
  const [expLoading, setExpLoading] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [modalGallery, setModalGallery] = useState({ images: [], index: 0, open: false });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [openItineraryDay, setOpenItineraryDay] = useState(0);
  const [guideAssignments, setGuideAssignments] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const showThumbs = galleryImages.length > 1;
  const maxThumbs = 5;
  const extraCount = galleryImages.length - maxThumbs;

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        // Fetch Tour Details
        const tourRes = await axios.get(`http://localhost:8080/api/tours/${tourId}`, config);
        if (!tourRes.data) throw new Error('Tour not found');
        setTour(tourRes.data);

        // Fetch Gallery Images
        const galleryRes = await axios.get(`http://localhost:8080/api/tours/${tourId}/images`);
        setGalleryImages(galleryRes.data || []);

        // Fetch Schedules and Itineraries
        const schedulesRes = await axios.get(`http://localhost:8080/api/schedules/tour/${tourId}`, config);
        const schedules = schedulesRes.data;
        const schedulesWithItineraries = [];
        for (const schedule of schedules) {
          const itinerariesRes = await axios.get(`http://localhost:8080/api/itineraries/schedule/${schedule.scheduleId}`, config);
          schedulesWithItineraries.push({ ...schedule, itineraries: itinerariesRes.data });
        }
        setItineraries(schedulesWithItineraries);

        // Fetch Destinations
        const destinationsRes = await axios.get(`http://localhost:8080/api/tours/${tourId}/destinations`);
        setDestinations(destinationsRes.data || []);

        // Fetch Experiences
        const expRes = await axios.get(`http://localhost:8080/api/experiences/tour/${tourId}`, config);
        setExperiences(Array.isArray(expRes.data) ? expRes.data : []);

        // Fetch Feedbacks
        setFeedbackLoading(true);
        const feedbackRes = await axios.get(`http://localhost:8080/api/feedbacks?tourId=${tourId}`);
        setFeedbacks(Array.isArray(feedbackRes.data) ? feedbackRes.data : []);
        
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please login to view tour details');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load tour details.');
        }
      } finally {
        setLoading(false);
        setFeedbackLoading(false);
      }
    };

    if (tourId) {
      fetchAllData();
      // If user is a guide, fetch their assignments
      const role = localStorage.getItem('role');
      if (role === 'GUIDE') {
        fetchGuideAssignments();
      }
    } else {
      setError('Invalid tour ID');
      setLoading(false);
    }
  }, [tourId, navigate]);

  const fetchGuideAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/tour-guide-assignments/my-assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGuideAssignments(res.data.map(a => a.scheduleId));
    } catch (err) {
      console.error("Failed to fetch guide assignments", err);
    }
  };

  const formatItineraryText = (text) => {
    if (!text) return null;
    const regex = /(\d{2}:\d{2}\s*–\s*\d{2}:\d{2})/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        // Reset regex state for global regex
        regex.lastIndex = 0;
        return <strong key={index} className={styles.itineraryTimeHighlight}>{part}</strong>;
      }
      return part;
    });
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      toast.info(
        <div>
          Bạn cần đăng nhập để đặt tour.<br />
          <button
            style={{ marginTop: 8, padding: "4px 12px", background: "#00AEEF", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
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
        const finalPrice = res.data.finalPrice;
        const selectedSchedule = itineraries.find(sch => sch.scheduleId === selectedScheduleId);
        navigate("/booking-passenger", { 
          state: { 
            bookingId: res.data.bookingId, 
            bookingCode: res.data.bookingCode, 
            tourInfo: tour, 
            selectedDate: selectedSchedule?.startDate, 
            itineraries: selectedSchedule?.itineraries || [], 
            finalPrice 
          } 
        });
      } else {
        toast.error("Invalid response from server");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi đặt tour");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setExpLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const expRes = await axios.post('http://localhost:8080/api/experiences', {
        userid: userId,
        tourId: tourId,
        content: expContent,
        title: expTitle
      }, config);
      
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
        await axios.post('http://localhost:8080/api/media', formData, {
          ...config,
          headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
        });
      }
      setExpContent('');
      setExpMedia([]);
      setExpTitle('');
      // Refresh experiences
      const newExpRes = await axios.get(`http://localhost:8080/api/experiences/tour/${tourId}`, config);
      setExperiences(Array.isArray(newExpRes.data) ? newExpRes.data : []);
    } catch (err) {
      alert('Gửi trải nghiệm thất bại!');
    }
    setExpLoading(false);
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
  
  if (error) return (
    <div className={styles.errorContainer}>
      <h2>Error</h2>
      <p>{error}</p>
    </div>
  );
  
  if (!tour) return null;

  const selectedScheduleDetails = itineraries.find(s => s.scheduleId === selectedScheduleId);
  const isGuideAssignedToSelectedSchedule = selectedScheduleId && guideAssignments.includes(selectedScheduleId);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.tourHeaderTitle}>{tour.name}</h1>
      
      <div className={styles.mainLayout}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          
          {/* Gallery Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Hình ảnh tour</h2>
            {galleryImages.length > 0 ? (
                <div className={styles.galleryContainer}>
                  <div className={styles.mainImageContainer}>
                    <img
                      src={`http://localhost:8080${galleryImages[mainImgIdx]}`}
                      alt="Tour main"
                      className={styles.mainImage}
                      onClick={() => setModalGallery({ 
                        images: galleryImages.map(i => `http://localhost:8080${i}`), 
                        index: mainImgIdx, 
                        open: true 
                      })}
                    />
                  </div>
                  {galleryImages.length > 1 && (
                    <div className={styles.thumbnailContainer}>
                      {galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`${styles.thumbnail} ${idx === mainImgIdx ? styles.active : ''}`}
                          onClick={() => setMainImgIdx(idx)}
                        >
                          <img
                            src={`http://localhost:8080${img}`}
                            alt={`Thumbnail ${idx + 1}`}
                            className={styles.thumbnailImage}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : <p>Chưa có hình ảnh cho tour này.</p>
            }
          </div>

          {/* Description Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Mô tả chi tiết</h2>
            <p className={`${styles.descriptionText} ${!isDescriptionExpanded ? styles.collapsed : ''}`}>
              {tour.description}
            </p>
            <button 
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} 
              className={styles.readMoreButton}
            >
              {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}><span>Thời gian</span><strong>{tour.duration} ngày</strong></div>
              <div className={styles.infoItem}><span>Số lượng khách</span><strong>Tối đa {tour.maxParticipants}</strong></div>
              <div className={styles.infoItem}><span>Giá tour</span><strong>{tour.price?.toLocaleString()}đ</strong></div>
              <div className={styles.infoItem}><span>Phương tiện</span><strong>Ô tô cao cấp</strong></div>
              <div className={styles.infoItem}><span>Hướng dẫn viên</span><strong>Chuyên nghiệp</strong></div>
            </div>
          </div>

          {/* Destinations Card */}
          {destinations.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px', verticalAlign: 'bottom' }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Địa điểm nổi bật
              </h2>
              <div className={styles.destinationsGrid}>
                {destinations.map(destination => (
                  <div key={destination.id} className={styles.destinationCard}>
                    {destination.imageUrls && destination.imageUrls.length > 0 ? (
                      <div 
                        className={styles.destinationImageContainer}
                        onClick={() => setModalGallery({ 
                          images: destination.imageUrls.map(i => `http://localhost:8080${i}`), 
                          index: 0, 
                          open: true 
                        })}
                      >
                        <img 
                          src={`http://localhost:8080${destination.imageUrls[0]}`} 
                          alt={destination.name} 
                          className={styles.destinationImage}
                        />
                        {destination.imageUrls.length > 1 && (
                          <div className={styles.imageCountOverlay}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm4.21 3.555a.5.5 0 0 1 .59.082l2.648 3.178-2.618 3.143a.5.5 0 0 1-.806-.59l2.182-2.618-2.182-2.618a.5.5 0 0 1 .224-.672z"/>
                            </svg>
                            <span>{destination.imageUrls.length}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.destinationImagePlaceholder}>
                        <span>No Image</span>
                      </div>
                    )}
                    <div className={styles.destinationInfo}>
                      <h3 className={styles.destinationName}>{destination.name}</h3>
                      <p className={styles.destinationDescription}>{destination.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Lịch trình tour</h2>
            {selectedScheduleDetails ? (
              <div className={styles.itineraryList}>
                {selectedScheduleDetails.itineraries.map((itinerary, i) => (
                  <div key={itinerary.itineraryId} className={styles.itineraryItem}>
                    <h4 
                      className={styles.itineraryTitle}
                      onClick={() => setOpenItineraryDay(openItineraryDay === i ? null : i)}
                    >
                      <span>Ngày {i + 1}: {itinerary.title}</span>
                      <span className={`${styles.itineraryArrow} ${openItineraryDay === i ? styles.open : ''}`}>▼</span>
                    </h4>
                    {openItineraryDay === i && (
                      <p className={styles.itineraryDescription}>
                        {formatItineraryText(itinerary.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>Chọn một lịch trình từ ô "Đặt tour" để xem chi tiết.</p>
            )}
          </div>

          {/* Share Experience Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Chia sẻ trải nghiệm</h2>
            <p className={styles.cardSubtitle}>Chia sẻ cảm nhận của bạn về chuyến đi</p>
            <form onSubmit={handleExpSubmit} className={styles.experienceForm}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  id="expTitle"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  placeholder=" " /* Required for floating label */
                  required
                  className={styles.formInput}
                />
                <label htmlFor="expTitle" className={styles.formFloatingLabel}>Tiêu đề trải nghiệm</label>
              </div>
              
              <div className={styles.formGroup}>
                <textarea
                  id="expContent"
                  value={expContent}
                  onChange={e => setExpContent(e.target.value)}
                  placeholder=" " /* Required for floating label */
                  required
                  className={styles.formTextarea}
                />
                <label htmlFor="expContent" className={styles.formFloatingLabel}>Cảm nhận, kinh nghiệm, kỷ niệm đáng nhớ...</label>
              </div>

              <div className={styles.formInputGroup}>
                <label htmlFor="experienceMedia" className={styles.fileLabel}>Chọn ảnh</label>
                <input
                  type="file"
                  id="experienceMedia"
                  name="experienceMedia"
                  multiple
                  onChange={e => setExpMedia([...e.target.files])}
                  accept="image/*" // Restrict to image files
                />
              </div>

              {/* Preview selected images */}
              {expMedia.length > 0 && (
                <div className={styles.imagePreviewContainer}>
                  {expMedia.map((file, index) => (
                    <img key={index} src={URL.createObjectURL(file)} alt={`preview ${index}`} className={styles.imagePreview} />
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={expLoading}
                className={styles.submitButton}
              >
                {expLoading ? 'Đang gửi...' : 'Gửi trải nghiệm'}
              </button>
            </form>
          </div>

          {/* Shared Experiences Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Trải nghiệm đã chia sẻ</h2>
            {(!Array.isArray(experiences) || experiences.filter(exp => (exp.status || '').toLowerCase() === 'approved').length === 0) ? (
              <p>Chưa có trải nghiệm nào được duyệt.</p>
            ) : (
              <div className={styles.experienceList}>
                {(Array.isArray(experiences) ? experiences : [])
                  .filter(exp => (exp.status || '').toLowerCase() === 'approved')
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 6)
                  .map(exp => {
                    const images = (exp.media || []).filter(m => m.fileType === 'image');
                    const imageUrls = images.map(i => `http://localhost:8080${i.fileUrl}`);

                    return (
                      <div key={exp.experienceId} className={styles.experienceItem}>
                        {imageUrls.length > 0 && (
                          <img 
                            src={imageUrls[0]} 
                            alt={exp.title} 
                            className={styles.experienceItemImage} 
                            onClick={() => setModalGallery({ images: imageUrls, index: 0, open: true })}
                          />
                        )}
                        <div className={styles.experienceItemContent}>
                          <p className={styles.experienceItemTitle}>{exp.title}</p>
                          <div className={styles.itemMeta}>
                            <span className={styles.itemUser}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {exp.userFullName || 'Ẩn danh'}
                            </span>
                            <span className={styles.itemDate}>{new Date(exp.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p>{exp.content}</p>
                          {imageUrls.length > 1 && (
                            <div className={styles.experienceThumbnails}>
                              {imageUrls.slice(1, 4).map((url, index) => (
                                <img 
                                  key={index}
                                  src={url}
                                  alt={`thumbnail ${index + 1}`}
                                  className={styles.experienceThumbnail}
                                  onClick={() => setModalGallery({ images: imageUrls, index: index + 1, open: true })}
                                />
                              ))}
                              {imageUrls.length > 4 && (
                                <div 
                                  className={styles.experienceThumbnailOverlay}
                                  onClick={() => setModalGallery({ images: imageUrls, index: 4, open: true })}
                                >
                                  <span>+{imageUrls.length - 4}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
          
          {/* Feedback Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Đánh giá khách hàng</h2>
            {feedbackLoading ? <p>Đang tải...</p> : feedbacks.length === 0 ? (
              <p>Chưa có đánh giá nào.</p>
            ) : (
              <div className={styles.feedbackList}>
                {feedbacks
                  .filter(fb => (fb.statusName || '').toLowerCase() === 'approved')
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 6)
                  .map(fb => (
                    <div key={fb.feedbackId} className={styles.feedbackItem}>
                      <div className={styles.feedbackStars}>
                        {Array.from({ length: fb.rating }, (_, i) => <span key={i}>★</span>)}
                        {Array.from({ length: 5 - fb.rating }, (_, i) => <span key={i} className={styles.starEmpty}>★</span>)}
                      </div>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemUser}>
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {fb.userFullName || 'Ẩn danh'}
                        </span>
                        <span className={styles.itemDate}>{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{fb.message}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={`${styles.card} ${styles.bookingWidget}`}>
            <h2 className={styles.cardTitle}>Đặt tour</h2>
            <div className={styles.bookingInfo}>
              <div className={styles.bookingInfoItem}>
                <span>Giá tour</span>
                <strong>{tour.price?.toLocaleString()}đ / người</strong>
              </div>
              <div className={styles.bookingInfoItem}>
                <span>Thời gian</span>
                <strong>{tour.duration} ngày</strong>
              </div>
              <div className={styles.bookingInfoItem}>
                <span>Số khách</span>
                <strong>Tối đa {tour.maxParticipants}</strong>
              </div>
            </div>
            
            <div className={styles.bookingForm}>
                <label htmlFor="schedule-select">Chọn lịch trình</label>
                <select
                  id="schedule-select"
                  value={selectedScheduleId || ''}
                  onChange={e => setSelectedScheduleId(Number(e.target.value))}
                  className={styles.formSelect}
                >
                  <option value="">-- Chọn lịch trình --</option>
                  {itineraries.map(sch => (
                    <option
                      key={sch.scheduleId}
                      value={sch.scheduleId}
                      disabled={sch.status === 'full' || sch.status === 'closed'}
                    >
                      {sch.startDate} - {sch.endDate}
                      {sch.status === 'full' ? ' (Hết chỗ)' :
                       sch.status === 'closed' ? ' (Đã đóng)' : ''}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleBooking}
                  disabled={
                    bookingLoading || 
                    !selectedScheduleId ||
                    ['full', 'closed'].includes(
                      itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status
                    ) ||
                    isGuideAssignedToSelectedSchedule
                  }
                  className={`${styles.bookingButton} ${isGuideAssignedToSelectedSchedule ? styles.disabledButton : ''}`}
                >
                  {bookingLoading
                    ? 'Đang xử lý...'
                    : isGuideAssignedToSelectedSchedule
                    ? 'Đã được phân công'
                    : 'Đặt ngay'}
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Gallery */}
      {modalGallery.open && (
        <div className={styles.modalOverlay} onClick={() => setModalGallery({ ...modalGallery, open: false })}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalGallery({ ...modalGallery, open: false })} className={styles.modalClose}>×</button>
            <img src={modalGallery.images[modalGallery.index]} alt="Gallery view" className={styles.modalImage} />
          </div>
        </div>
      )}
    </div>
  );
}