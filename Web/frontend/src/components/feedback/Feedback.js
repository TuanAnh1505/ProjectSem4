import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Star rating component
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            cursor: 'pointer',
            color: (hover || value) >= star ? '#FFD700' : '#e0e0e0',
            fontSize: 32,
            transition: 'color 0.2s',
            textShadow: (hover || value) >= star ? '0 2px 8px #ffe066' : 'none'
          }}
          title={star + ' sao'}
        >★</span>
      ))}
      <span style={{marginLeft: 12, fontWeight: 600, fontSize: 18, color: '#1976d2'}}>
        {value} sao
      </span>
    </div>
  );
}

function FeedbackForm({ bookingId, tourId, onSubmit, loading }) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(false);
    setSubmitting(true);
    const token = localStorage.getItem('token');
    const res = await fetch("/api/feedbacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ tourId, message, rating }),
    });
    setSubmitting(false);
    if (res.status === 401) {
      setAuthError(true);
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#f8f9fa',
      padding: 32,
      borderRadius: 14,
      maxWidth: 480,
      margin: '0 auto',
      boxShadow:'0 2px 8px #eee',
      marginTop: 18
    }}>
      <div style={{ marginBottom: 22, textAlign:'center' }}>
        <label style={{fontWeight:600, fontSize:18, marginRight:12, display:'block',marginBottom:8}}>Chấm điểm tour:</label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label htmlFor="feedback-message" style={{fontWeight:600, fontSize:18, display:'block', marginBottom:8}}>Đánh giá chi tiết của bạn</label>
        <textarea
          id="feedback-message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={7}
          style={{
            width: "100%",
            fontSize: 16,
            padding: 14,
            borderRadius: 10,
            border: '1.5px solid #bdbdbd',
            resize:'vertical',
            minHeight:120,
            background:'#fff',
            boxShadow:'0 1px 4px #f0f0f0'
          }}
          placeholder="Nhập đánh giá chi tiết của bạn về tour này..."
          required
        />
      </div>
      <button type="submit" disabled={submitting || loading} style={{
        width:'100%',
        marginTop: 8,
        background: 'linear-gradient(90deg,#1976d2 0%,#42a5f5 100%)',
        color: '#fff',
        border: 'none',
        padding: '15px 0',
        borderRadius: 10,
        fontSize: 20,
        fontWeight: 700,
        cursor: submitting || loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 8px #e0e0e0',
        letterSpacing:1,
        opacity: submitting || loading ? 0.7 : 1
      }}>
        {submitting || loading ? 'Đang gửi...' : 'Gửi feedback'}
      </button>
      {authError && <div style={{color:'#d32f2f',marginTop:12,textAlign:'center'}}>Bạn cần đăng nhập để gửi feedback.</div>}
    </form>
  );
}

function Feedback() {
  const query = new URLSearchParams(useLocation().search);
  const bookingId = query.get("bookingId");
  const [submitted, setSubmitted] = useState(false);
  const [booking, setBooking] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleDetail, setScheduleDetail] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${bookingId}/detail`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setBooking(data.booking);
      setPassengers(data.passengers);
      setLoading(false);
      if (data.booking && data.booking.scheduleId) {
        fetchScheduleDetail(data.booking.scheduleId, token);
      }
    }
    async function fetchScheduleDetail(scheduleId, token) {
      try {
        const res = await fetch(`/api/schedules/${scheduleId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const detail = await res.json();
          setScheduleDetail(detail);
        }
      } catch {}
    }
    if (bookingId) fetchBooking();
  }, [bookingId]);

  let tourImage = booking?.tour?.imageUrl;
  if (tourImage && tourImage.startsWith("/uploads/tours/")) {
    tourImage = `${window.location.origin}${tourImage}`;
  }

  if (loading) return <div style={{textAlign:'center',marginTop:40}}>Đang tải thông tin booking...</div>;
  if (!booking) return <div style={{textAlign:'center',marginTop:40}}>Không tìm thấy thông tin booking.</div>;
  if (submitted) return <div style={{textAlign:'center',marginTop:60,fontSize:24,color:'#28a745',fontWeight:600}}>Cảm ơn bạn đã gửi feedback!</div>;

  return (
    <div style={{ maxWidth: 650, margin: "40px auto", background: "#fff", borderRadius: 18, boxShadow: "0 6px 32px #e0e0e0", padding: 0, overflow: 'hidden' }}>
      {/* Ảnh tour */}
      {tourImage && (
        <div style={{width:'100%',height:220,overflow:'hidden',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <img src={tourImage} alt="Tour" style={{ width: '100%', height: '100%', objectFit: "cover", borderBottom: '1px solid #eee' }} />
        </div>
      )}
      {/* Thông tin tour */}
      <div style={{padding: '32px 28px 18px 28px'}}>
        <h2 style={{textAlign:'center',marginBottom:18,fontWeight:700,fontSize:26,letterSpacing:1}}>Gửi đánh giá cho booking #{booking.bookingId}</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr',rowGap:8,fontSize:16,marginBottom:18}}>
          <div><b>Tour:</b> <span style={{color:'#1976d2'}}>{booking.tour?.name}</span></div>
          <div><b>Mô tả:</b> <span style={{color:'#444'}}>{booking.tour?.description}</span></div>
          <div><b>Ngày đặt:</b> {booking.bookingDate && new Date(booking.bookingDate).toLocaleString()}</div>
          <div><b>Giá:</b> <span style={{color:'#388e3c'}}>{booking.totalPrice?.toLocaleString()} VND</span></div>
          <div><b>Trạng thái:</b> {booking.status?.statusName}</div>
          <div><b>Lịch trình:</b> {booking.schedule?.startDate} - {booking.schedule?.endDate}</div>
          <div><b>Khách đặt:</b> {booking.user?.fullName} ({booking.user?.email})</div>
          <div><b>Hành khách:</b> {passengers.map(p => (
            <span key={p.passengerId}>{p.fullName} ({p.passengerType}){p.phone ? ` - ${p.phone}` : ''}; </span>
          ))}</div>
          {scheduleDetail && (
            <div style={{fontSize:15, color:'#555'}}>
              <b>Chi tiết lịch trình:</b> Bắt đầu: {scheduleDetail.startDate} - Kết thúc: {scheduleDetail.endDate} | Trạng thái: {scheduleDetail.status} | Số người hiện tại: {scheduleDetail.currentParticipants}
            </div>
          )}
        </div>
        <FeedbackForm bookingId={booking.bookingId} tourId={booking.tour?.tourId} onSubmit={() => setSubmitted(true)} loading={loading} />
      </div>
    </div>
  );
}

export default Feedback;