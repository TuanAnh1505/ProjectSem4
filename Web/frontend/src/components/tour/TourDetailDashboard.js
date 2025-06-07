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

  // Dữ liệu mẫu cho các mốc thời gian trong ngày nếu API không trả về
  const sampleDayDetails = [
    {
      time: '8:00 - 8:30',
      icon: 'ri-time-line',
      title: 'Tập trung tại điểm hẹn: 44 Nguyễn Thái Học, Ba Đình. Làm quen với HDV và các thành viên trong đoàn.'
    },
    {
      time: '8:30 - 12:00',
      icon: 'ri-time-line',
      title: 'Di chuyển theo cao tốc Nội Bài - Lào Cai. Dừng chân nghỉ ngơi tại trạm dừng chân và dùng bữa trưa.'
    },
    {
      time: '12:00 - 17:00',
      icon: 'ri-time-line',
      title: 'Tiếp tục hành trình qua Tuyên Quang, ngắm cảnh đẹp hai bên đường. Dừng chân chụp ảnh tại các điểm đẹp.'
    },
    {
      time: '17:00 - 18:00',
      icon: 'ri-time-line',
      title: 'Đến Hà Giang, nhận phòng khách sạn. Nghỉ ngơi và tự do khám phá ẩm thực địa phương.'
    }
  ];

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

  if (loading) return <div className="loading">Loading tour details...</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!tour) return <div className="error-box">Tour not found</div>;

  // Gallery images (nếu có nhiều ảnh, ở đây demo chỉ lấy 1 ảnh chính)
  const galleryImages = tour.images || (tour.imageUrl ? [tour.imageUrl] : []);

  return (
    <main className="tour-main-container">
      {/* Tour Information */}
      <div className="tour-info">
        <div className="tour-info-row">
          <div className="tour-info-left">
            <h1 className="tour-title">{tour.name}</h1>
            <p className="tour-desc">{tour.description}</p>
            <div className="tour-meta">
              <div className="tour-meta-item">
                <div className="tour-meta-icon">
                  <i className="ri-time-line ri-lg"></i>
                </div>
                <div className="tour-meta-text">
                  <p className="tour-meta-label">Thời gian</p>
                  <p className="tour-meta-value">{tour.duration} ngày</p>
                </div>
              </div>
              <div className="tour-meta-item">
                <div className="tour-meta-icon">
                  <i className="ri-user-line ri-lg"></i>
                </div>
                <div className="tour-meta-text">
                  <p className="tour-meta-label">Số lượng</p>
                  <p className="tour-meta-value">{tour.maxParticipants} khách</p>
                </div>
              </div>
              <div className="tour-meta-item">
                <div className="tour-meta-icon">
                  <i className="ri-money-dollar-circle-line ri-lg"></i>
                </div>
                <div className="tour-meta-text">
                  <p className="tour-meta-label">Giá</p>
                  <p className="tour-meta-value tour-meta-price">{tour.price?.toLocaleString()}đ</p>
                </div>
              </div>
            </div>
          </div>
          <div className="tour-info-right">
            {tour.imageUrl && (
              <img
                src={`http://localhost:8080${tour.imageUrl}`}
                alt={tour.name}
                className="tour-main-img"
              />
            )}
          </div>
        </div>
      </div>

      {/* Tour Itinerary */}
      <div className="itinerary-section itinerary-fullwidth">
        <h2 className="itinerary-title">LỊCH TRÌNH</h2>
        <div className="itinerary-list">
          {itineraries.length > 0 ? (
            itineraries.map((schedule, idx) => (
              <div key={schedule.scheduleId} className="itinerary-item itinerary-item-fullwidth">
                <h3 className="itinerary-item-title">
                  Lịch trình {idx + 1}: {schedule.startDate} - {schedule.endDate}
                </h3>
                {schedule.itineraries && schedule.itineraries.length > 0 ? (
                  schedule.itineraries.map((itinerary, i) => (
                    <div key={itinerary.itineraryId} className="itinerary-day itinerary-day-fullwidth">
                      <div className="itinerary-day-header-row itinerary-day-header-row-fullwidth">
                        <div className="itinerary-day-header-col">
                          <span className="itinerary-day-label">Giờ bắt đầu:</span>
                          <span className="itinerary-day-value">{formatTime(itinerary.startTime)}</span>
                        </div>
                        <div className="itinerary-day-title-main">Ngày {i + 1}: {itinerary.title}</div>
                        <div className="itinerary-day-header-col" style={{textAlign: 'right'}}>
                          <span className="itinerary-day-label">Giờ kết thúc:</span>
                          <span className="itinerary-day-value">{formatTime(itinerary.endTime)}</span>
                        </div>
                      </div>
                      <div className="itinerary-day-details">
                        {(itinerary.dayDetails && itinerary.dayDetails.length > 0 ? itinerary.dayDetails : sampleDayDetails).map((detail, j) => (
                          <div className="itinerary-detail-row" key={j}>
                            <div className="itinerary-detail-icon">
                              <i className={(detail.icon ? detail.icon : "ri-time-line") + ' ri-lg'}></i>
                            </div>
                            <div className="itinerary-detail-content">
                              <span className="itinerary-detail-time">{detail.time}</span>
                              <span className="itinerary-detail-title">{detail.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {itinerary.importantInfo && (
                        <div className="itinerary-important itinerary-important-fullwidth">
                          <h5 className="itinerary-important-title">
                            <i className="ri-information-line itinerary-important-icon"></i>
                            Thông tin quan trọng
                          </h5>
                          <ul className="itinerary-important-list">
                            {itinerary.importantInfo.map((info, k) => (
                              <li className="itinerary-important-item" key={k}>
                                <i className={(info.icon ? info.icon : "ri-information-line") + ' itinerary-important-item-icon'}></i>
                                <span className="itinerary-important-item-text">{info.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="itinerary-no-data">Không có lịch trình cho schedule này.</div>
                )}
              </div>
            ))
          ) : (
            <div className="itinerary-no-data">Chưa có lịch trình cho tour này</div>
          )}
        </div>
      </div>

      {/* Tour Images */}
      {galleryImages.length > 0 && (
        <div className="tour-gallery">
          <h2 className="tour-gallery-title">Hình ảnh tour</h2>
          <div className="tour-gallery-list">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="tour-gallery-img-wrap">
                <img src={`http://localhost:8080${img}`} alt={`gallery-${idx}`} className="tour-gallery-img" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking and Highlights */}
      <div className="booking-highlight-row">
        {/* Booking Form */}
        <div className="booking-form">
          <h2 className="booking-title">Đặt tour</h2>
          <div className="booking-form-group">
            <label htmlFor="schedule" className="booking-label">Chọn lịch trình:</label>
            <div className="booking-select-wrap">
              <select
                id="schedule"
                className="booking-select"
                value={selectedScheduleId || ''}
                onChange={e => setSelectedScheduleId(Number(e.target.value))}
              >
                <option value="">-- Chọn lịch trình --</option>
                {itineraries.map(sch => (
                  <option
                    key={sch.scheduleId}
                    value={sch.scheduleId}
                    disabled={sch.status === 'full' || sch.status === 'closed'}
                  >
                    {sch.startDate} - {sch.endDate} {sch.status === 'full' ? '(Đã đủ người)' : sch.status === 'closed' ? '(Đã đóng)' : '(Còn chỗ)'} - {sch.currentParticipants || 0}/{tour.maxParticipants} người
                  </option>
                ))}
              </select>
              <div className="booking-select-icon">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
          </div>
          <button
            className="booking-btn"
            onClick={handleBooking}
            disabled={bookingLoading || !selectedScheduleId ||
              ['full', 'closed'].includes(itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status)}
          >
            {bookingLoading ? 'Đang xử lý...' :
              (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'full')
                ? 'Đã đủ người'
                : (itineraries.find(sch => sch.scheduleId === selectedScheduleId)?.status === 'closed')
                  ? 'Đã đóng'
                  : 'Đặt ngay'}
          </button>
        </div>
        {/* Highlights */}
        <div className="highlight-section">
          <h2 className="highlight-title">Điểm nổi bật</h2>
          <ul className="highlight-list">
            <li className="highlight-item">
              <div className="highlight-icon">
                <i className="ri-check-line"></i>
              </div>
              <span className="highlight-text">Khám phá Cao nguyên đá Đồng Văn - Di sản địa chất toàn cầu được UNESCO công nhận</span>
            </li>
            <li className="highlight-item">
              <div className="highlight-icon">
                <i className="ri-check-line"></i>
              </div>
              <span className="highlight-text">Trải nghiệm đèo Mã Pí Lèng - Con đường hạnh phúc</span>
            </li>
            <li className="highlight-item">
              <div className="highlight-icon">
                <i className="ri-check-line"></i>
              </div>
              <span className="highlight-text">Tham quan Cột cờ Lũng Cú - Điểm cực Bắc của Tổ quốc</span>
            </li>
            <li className="highlight-item">
              <div className="highlight-icon">
                <i className="ri-check-line"></i>
              </div>
              <span className="highlight-text">Khám phá văn hóa đặc sắc của đồng bào dân tộc thiểu số</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="faq-title">FAQ về tour</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h3 className="faq-question">Tôi cần mang những gì khi tham gia tour {tour.name}?</h3>
            <p className="faq-answer">Quần áo thoải mái, giày đi bộ, áo khoác nhẹ (vì thời tiết có thể thay đổi đột ngột), kem chống nắng, thuốc cá nhân, giấy tờ tùy thân và tiền mặt (một số nơi không hỗ trợ thanh toán điện tử).</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">Có cần giấy phép đi {tour.name} không?</h3>
            <p className="faq-answer">Đối với người Việt Nam không cần giấy phép đặc biệt. Đối với khách nước ngoài, cần mang theo hộ chiếu để làm thủ tục tạm trú tại các điểm lưu trú.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">Thời điểm lý tưởng để đi {tour.name} là khi nào?</h3>
            <p className="faq-answer">Hà Giang đẹp quanh năm, nhưng thời điểm lý tưởng nhất là từ tháng 9 đến tháng 11 (mùa hoa tam giác mạch) và tháng 4 đến tháng 5 (mùa lúa xanh).</p>
          </div>
        </div>
      </div>

      {/* Related Tours */}
      <div className="related-tours">
        <h2 className="related-tours-title">Các tour liên quan</h2>
        <div className="related-tours-list">
          {relatedTours.map(tour => (
            <div key={tour.tourId} className="related-tour-card">
              <div className="related-tour-img-wrap">
                <img src={`http://localhost:8080${tour.imageUrl}`} alt={tour.name} className="related-tour-img" />
              </div>
              <div className="related-tour-content">
                <h3 className="related-tour-name">{tour.name}</h3>
                <div className="related-tour-meta">
                  <div className="related-tour-meta-icon">
                    <i className="ri-time-line"></i>
                  </div>
                  <span className="related-tour-meta-text">{tour.duration || 'N/A'} ngày</span>
                </div>
                <div className="related-tour-meta-bottom">
                  <p className="related-tour-price">{tour.price?.toLocaleString()}đ</p>
                  <button onClick={() => navigate(`/tour-dashboard/detail/${tour.tourId}`)} className="related-tour-btn">Xem chi tiết</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS bổ sung cho layout và class mới */}
      <style>{`
        .tour-main-container { max-width: 1200px; margin: 0 auto; padding: 32px 0; }
        .tour-info { background: #fff; border-radius: 16px; box-shadow: 0 2px 8px #e3e8f0; padding: 32px; margin-bottom: 32px; }
        .tour-info-row { display: flex; flex-wrap: wrap; gap: 32px; align-items: center; }
        .tour-info-left { flex: 1; min-width: 380px; }
        .tour-title { color: #1976d2; font-weight: 800; font-size: 38px; margin-bottom: 18px; text-align: left; letter-spacing: 1px; }
        .tour-desc { color: #333; font-size: 20px; margin-bottom: 28px; line-height: 1.5; font-weight: 400; }
        .tour-meta { display: flex; gap: 48px; margin-bottom: 0; justify-content: flex-start; width: 100%; }
        .tour-meta-item { display: flex; flex-direction: row; align-items: center; }
        .tour-meta-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #1976d2; font-size: 24px; }
        .tour-meta-label { font-size: 15px; color: #888; margin-bottom: 2px; }
        .tour-meta-value { font-size: 18px; color: #333; font-weight: 500; }
        .tour-meta-price { color: #388e3c; font-weight: 700; font-size: 20px; }
        .tour-info-right { flex: 1; min-width: 320px; display: flex; justify-content: center; }
        .tour-main-img { width: 100%; max-width: 420px; max-height: 320px; object-fit: cover; border-radius: 18px; border: 6px solid #1976d2; box-shadow: 0 4px 24px rgba(0,0,0,0.12); }

        .itinerary-section.itinerary-fullwidth {
          width: 100vw;
          max-width: none;
          margin-left: 50%;
          transform: translateX(-50%);
          border-radius: 0;
          box-shadow: none;
          padding: 0 0 32px 0;
        }
        .itinerary-list {
          width: 100%;
          padding: 0 0 0 0;
        }
        .itinerary-item.itinerary-item-fullwidth {
          background: #eaf3fc;
          border-radius: 18px;
          box-shadow: 0 4px 24px #dbeafe;
          padding: 32px 48px 32px 48px;
          margin-bottom: 36px;
          width: 90vw;
          max-width: 1400px;
          margin-left: 50%;
          transform: translateX(-50%);
        }
        .itinerary-day.itinerary-day-fullwidth {
          background: #f7fbff;
          border-radius: 14px;
          box-shadow: 0 2px 8px #e3e8f0;
          border: 2px solid #1976d2;
          padding: 32px 32px 20px 32px;
          margin-bottom: 18px;
          width: 100%;
        }
        .itinerary-day-header-row.itinerary-day-header-row-fullwidth {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          gap: 18px;
        }
        .itinerary-day-header-col {
          min-width: 140px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 16px;
        }
        .itinerary-day-title-main {
          flex: 1;
          text-align: center;
          font-size: 20px;
          font-weight: 700;
          color: #1976d2;
          letter-spacing: 0.5px;
        }
        .itinerary-day-label {
          font-size: 15px;
          color: #888;
          font-weight: 500;
        }
        .itinerary-day-value {
          font-size: 18px;
          color: #222;
          font-weight: 700;
          margin-left: 2px;
        }
        .itinerary-day-details {
          margin-top: 0;
          margin-bottom: 18px;
        }
        .itinerary-detail-row {
          display: flex;
          align-items: flex-start;
          margin-bottom: 10px;
          gap: 8px;
        }
        .itinerary-detail-icon {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1976d2;
          margin-top: 2px;
        }
        .itinerary-detail-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }
        .itinerary-detail-time {
          font-weight: 500;
          color: #1976d2;
          font-size: 15px;
          margin-bottom: 0;
        }
        .itinerary-detail-title {
          color: #333;
          font-size: 15px;
        }
        .itinerary-important.itinerary-important-fullwidth {
          background: #fff;
          border-radius: 16px;
          padding: 16px 20px;
          border: 1.5px solid #1976d2;
          margin-top: 18px;
          box-shadow: 0 1px 4px #e3e8f0;
        }
        .itinerary-important-title {
          font-weight: 700;
          color: #1976d2;
          font-size: 16px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .itinerary-important-icon {
          font-size: 18px;
          margin-right: 8px;
        }
        .itinerary-important-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .itinerary-important-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 6px;
        }
        .itinerary-important-item-icon {
          font-size: 16px;
          color: #1976d2;
          margin-top: 2px;
        }
        .itinerary-important-item-text {
          margin-left: 8px;
          color: #444;
          font-size: 15px;
        }
        .itinerary-no-data { color: #888; font-size: 15px; margin: 12px 0; }

        .tour-gallery { background: #fff; border-radius: 16px; box-shadow: 0 2px 8px #e3e8f0; padding: 32px; margin-bottom: 32px; }
        .tour-gallery-title { font-size: 20px; font-weight: 700; color: #1976d2; margin-bottom: 16px; }
        .tour-gallery-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .tour-gallery-img-wrap { overflow: hidden; border-radius: 12px; height: 180px; }
        .tour-gallery-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .tour-gallery-img:hover { transform: scale(1.05); }

        .booking-highlight-row { display: flex; flex-wrap: wrap; gap: 32px; margin-bottom: 32px; }
        .booking-form { flex: 1; min-width: 320px; background: #e3f2fd; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px #e3e8f0; border: 1.5px solid #e3e8f0; }
        .booking-title { font-weight: 700; color: #1976d2; font-size: 18px; margin-bottom: 16px; }
        .booking-form-group { margin-bottom: 16px; }
        .booking-label { font-weight: 600; color: #333; margin-bottom: 6px; display: block; }
        .booking-select-wrap { position: relative; }
        .booking-select { width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #1976d2; margin-top: 6px; font-size: 15px; }
        .booking-select-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none; }
        .booking-btn { width: 100%; padding: 12px; background: #1976d2; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
        .booking-btn:disabled { background: #bdbdbd; cursor: not-allowed; }

        .highlight-section { flex: 1; min-width: 320px; background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px #e3e8f0; border: 1.5px solid #e3e8f0; }
        .highlight-title { font-weight: 700; color: #1976d2; font-size: 18px; margin-bottom: 16px; }
        .highlight-list { margin: 0; padding: 0; list-style: none; }
        .highlight-item { display: flex; align-items: flex-start; margin-bottom: 12px; }
        .highlight-icon { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; color: #1976d2; margin-top: 2px; }
        .highlight-text { margin-left: 8px; color: #333; font-size: 15px; }

        .faq-section { background: #fff; border-radius: 16px; box-shadow: 0 2px 8px #e3e8f0; padding: 32px; margin-bottom: 32px; }
        .faq-title { font-size: 20px; font-weight: 700; color: #1976d2; margin-bottom: 16px; }
        .faq-list { margin: 0; padding: 0; }
        .faq-item { border-bottom: 1px solid #e3e8f0; padding-bottom: 16px; margin-bottom: 16px; }
        .faq-question { font-weight: 600; color: #1976d2; font-size: 16px; margin-bottom: 6px; }
        .faq-answer { color: #444; font-size: 15px; }

        .related-tours { margin-bottom: 32px; }
        .related-tours-title { font-size: 20px; font-weight: 700; color: #1976d2; margin-bottom: 16px; }
        .related-tours-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .related-tour-card { background: #e3f2fd; border-radius: 12px; box-shadow: 0 2px 8px #e3e8f0; border: 1.5px solid #e3e8f0; padding: 12px; display: flex; flex-direction: column; align-items: center; }
        .related-tour-img-wrap { width: 100%; height: 120px; overflow: hidden; border-radius: 8px; margin-bottom: 8px; }
        .related-tour-img { width: 100%; height: 100%; object-fit: cover; }
        .related-tour-content { width: 100%; }
        .related-tour-name { font-weight: 600; color: #1976d2; font-size: 16px; margin-bottom: 4px; }
        .related-tour-meta { display: flex; align-items: center; color: #666; margin-bottom: 8px; }
        .related-tour-meta-icon { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
        .related-tour-meta-text { margin-left: 6px; font-size: 14px; }
        .related-tour-meta-bottom { display: flex; justify-content: space-between; align-items: center; }
        .related-tour-price { color: #388e3c; font-size: 15px; font-weight: 600; }
        .related-tour-btn { background: #1976d2; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s; }
        .related-tour-btn:hover { background: #1565c0; }
      `}</style>
    </main>
  );
}