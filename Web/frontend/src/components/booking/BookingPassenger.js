// BookingPassenger.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, User, Smile } from 'lucide-react';
import './BookingPassenger.css';
import { toast } from 'react-toastify';

const BookingPassenger = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log('BookingPassenger location.state:', location.state);
  const { bookingId, bookingCode, tourInfo, selectedDate, itineraries = [], finalPrice } = location.state || {};

  // State cho thông tin người đặt tour
  const [useLoggedInInfo, setUseLoggedInInfo] = useState(true);
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    gender: 'Nam',
    birthDate: ''
  });

  // State cho thông tin người dùng đã đăng nhập
  const [loggedInUser, setLoggedInUser] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    gender: 'Nam',
    birthDate: ''
  });

  // State cho số lượng hành khách
  const initialPassengerCounts = location.state?.passengerCounts || {
    adult: 1,
    child: 0,
    infant: 0
  };
  const [passengerCounts, setPassengerCounts] = useState(initialPassengerCounts);

  // State cho thông tin chi tiết của các hành khách phụ
  const [additionalPassengers, setAdditionalPassengers] = useState({
    adult: [], // Chỉ chứa thông tin người lớn 2 trở đi
    child: [],
    infant: []
  });

  const [bookedTour, setBookedTour] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [expandedDestinationIds, setExpandedDestinationIds] = useState([]);
  const [expandedEventIds, setExpandedEventIds] = useState([]);

  // Thêm lại các state cho mã giảm giá
  const [discountCode, setDiscountCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(location.state?.finalPrice || 0);

  function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  }

  // Cập nhật contactInfo khi toggle useLoggedInInfo
  useEffect(() => {
    if (useLoggedInInfo) {
      setContactInfo(loggedInUser);
    } else {
      setContactInfo({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        gender: 'Nam',
        birthDate: ''
      });
    }
  }, [useLoggedInInfo, loggedInUser]);

  // Fetch thông tin tour và user
  useEffect(() => {
    if (!bookingId || !tourInfo) return navigate('/tours');
    setBookedTour(tourInfo);

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const publicId = localStorage.getItem('publicId');
        if (!token || !publicId) return navigate('/login');

        const res = await axios.get(`http://localhost:8080/api/users/${publicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        const userData = {
          fullName: data.fullName || '',
          phoneNumber: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          gender: 'Nam',
          birthDate: ''
        };
        setLoggedInUser(userData);
        setContactInfo(userData);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchUserInfo();
  }, [bookingId, tourInfo, navigate]);

  // Tính toán tổng giá (có áp dụng giảm giá nếu có)
  useEffect(() => {
    if (!bookedTour) return;
    const adultPrice = bookedTour.price;
    const childPrice = bookedTour.price * 0.5;
    const infantPrice = bookedTour.price * 0.25;
    const totalBeforeDiscount =
      (passengerCounts.adult * adultPrice) +
      (passengerCounts.child * childPrice) +
      (passengerCounts.infant * infantPrice);
    if (discountInfo && discountInfo.discountPercent) {
      const percent = discountInfo.discountPercent;
      const newTotal = Math.round(totalBeforeDiscount - (totalBeforeDiscount * percent / 100));
      setDiscountedPrice(newTotal);
      setTotalPrice(newTotal);
    } else {
      setDiscountedPrice(totalBeforeDiscount);
      setTotalPrice(totalBeforeDiscount);
    }
  }, [passengerCounts, bookedTour, discountInfo]);

  // Xử lý thay đổi thông tin liên hệ
  const handleContactChange = (e) => {
    setContactInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Xử lý thay đổi số lượng hành khách
  const handlePassengerCountChange = (type, operation) => {
    setPassengerCounts(prev => {
      const totalCurrent = prev.adult + prev.child + prev.infant;
      const max = bookedTour?.maxParticipants || 99;
      let newCount = operation === 'add'
        ? prev[type] + 1
        : Math.max(type === 'adult' ? 1 : 0, prev[type] - 1);
      // Nếu là tăng, kiểm tra tổng số khách mới
      if (operation === 'add') {
        if (totalCurrent + 1 > max) {
          toast.error(`Số lượng khách không được vượt quá ${max} người!`);
          return prev;
        }
      }
      setAdditionalPassengers(prevDetails => {
        let updated = [...prevDetails[type]];
        if (type === 'adult') {
          if (updated.length < newCount - 1) {
            while (updated.length < newCount - 1) {
              updated.push({ fullName: '', gender: 'Nam', birthDate: '' });
            }
          } else if (updated.length > newCount - 1) {
            updated = updated.slice(0, newCount - 1);
          }
        } else {
          if (updated.length < newCount) {
            while (updated.length < newCount) {
              updated.push({ fullName: '', gender: 'Nam', birthDate: '' });
            }
          } else if (updated.length > newCount) {
            updated = updated.slice(0, newCount);
          }
        }
        return { ...prevDetails, [type]: updated };
      });
      return { ...prev, [type]: newCount };
    });
  };

  // Xử lý thay đổi thông tin hành khách phụ
  const handleAdditionalPassengerChange = (type, index, field, value) => {
    setAdditionalPassengers(prev => {
      // Luôn tạo mảng mới để React nhận biết thay đổi
      const updated = prev[type].map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      );
      return { ...prev, [type]: updated };
    });
  };

  // Toggle sử dụng thông tin đăng nhập
  const handleToggleUserInfo = () => {
    setUseLoggedInInfo(prev => !prev);
  };

  // Toggle hiển thị note điểm đến
  const toggleDestinationNote = (destinationId) => {
    setExpandedDestinationIds(prev =>
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  // Toggle hiển thị note sự kiện
  const toggleEventNote = (eventId) => {
    setExpandedEventIds(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Validate dữ liệu trước khi submit
  const validateData = () => {
    const errors = [];

    // Validate thông tin liên hệ
    if (!contactInfo.fullName?.trim()) errors.push("Họ tên không được để trống");
    if (!contactInfo.email?.trim()) errors.push("Email không được để trống");
    if (!contactInfo.phoneNumber?.trim()) errors.push("Số điện thoại không được để trống");
    if (!contactInfo.birthDate) errors.push("Ngày sinh không được để trống");

    // Validate thông tin hành khách phụ
    additionalPassengers.adult.forEach((p, index) => {
      if (!p.fullName?.trim()) {
        errors.push(`Vui lòng nhập tên cho Người lớn ${index + 2}`);
      }
    });

    additionalPassengers.child.forEach((p, index) => {
      if (!p.fullName?.trim()) {
        errors.push(`Vui lòng nhập tên cho Trẻ em ${index + 1}`);
      }
    });

    additionalPassengers.infant.forEach((p, index) => {
      if (!p.fullName?.trim()) {
        errors.push(`Vui lòng nhập tên cho Em bé ${index + 1}`);
      }
    });

    return errors;
  };

  // Xử lý submit form
  const handleSubmitPassengers = async () => {
    const errors = validateData();
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const publicId = localStorage.getItem('publicId');
      if (!token || !publicId) return navigate('/login');

      // Tạo danh sách hành khách (chỉ để log, không gửi cả mảng này lên backend)
      const allPassengers = [];
      allPassengers.push({
        fullName: contactInfo.fullName.trim(),
        gender: contactInfo.gender,
        birthDate: contactInfo.birthDate,
        passengerType: 'adult',
        phone: contactInfo.phoneNumber.trim(),
        email: contactInfo.email.trim(),
        address: contactInfo.address?.trim() || ''
      });
      additionalPassengers.adult.forEach((p, idx) => {
        allPassengers.push({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'adult'
        });
      });
      additionalPassengers.child.forEach(p => {
        allPassengers.push({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'child'
        });
      });
      additionalPassengers.infant.forEach(p => {
        allPassengers.push({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'infant'
        });
      });
      // Log kiểm tra dữ liệu trước khi gửi
      console.log('allPassengers:', allPassengers);
      console.log('additionalPassengers:', additionalPassengers);

      // Chỉ gửi Người lớn 2 trở đi, trẻ em, em bé vào passengerDetails
      const passengerDetails = [
        ...additionalPassengers.adult.map(p => ({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'adult'
        })),
        ...additionalPassengers.child.map(p => ({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'child'
        })),
        ...additionalPassengers.infant.map(p => ({
          fullName: p.fullName.trim(),
          gender: p.gender,
          birthDate: p.birthDate,
          passengerType: 'infant'
        }))
      ];

      const bookingPassengerRequest = {
        bookingId,
        publicId: localStorage.getItem('publicId'),
        contactInfo,
        passengers: passengerCounts,
        passengerDetails,
        discountCode: discountCode || null,
        discountedPrice: discountedPrice || null
      };

      const res = await axios.post('http://localhost:8080/api/booking-passengers/submit', bookingPassengerRequest, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      toast.success('Đăng ký thông tin hành khách thành công!');
      navigate('/booking-confirmation', {
        state: {
          bookingId,
          bookingCode: location.state.bookingCode,
          passengers: res.data,
          tourInfo: bookedTour,
          finalPrice: discountedPrice,
          basePrice: bookedTour.price,
          itineraries,
          passengerCounts
        }
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký thông tin hành khách';
      toast.error(msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm áp dụng mã giảm giá
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Vui lòng nhập mã giảm giá trước khi áp dụng!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:8080/api/discounts/check',
        { code: discountCode, tourId: bookedTour?.tourId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiscountInfo(res.data);
      setDiscountError('');
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setDiscountInfo(null);
        setDiscountedPrice(bookedTour.price);
        setDiscountError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      }
    }
  };

  if (!bookedTour) return <div className="loading">Đang tải thông tin tour...</div>;

  return (
    <div className="booking-layout">
      {/* LEFT: Thông tin liên hệ & hành khách */}
      <div className="booking-left">
        <h2>Thông tin liên hệ</h2>
        <div className="use-logged-in-toggle">
          <label htmlFor="toggle-user-info">Dùng thông tin tài khoản</label>
          <div className="toggle-switch">
            <input id="toggle-user-info" type="checkbox" checked={useLoggedInInfo} onChange={handleToggleUserInfo} />
            <span className="toggle-slider"></span>
          </div>
        </div>
        <div className="contact-info">
          <div className="form-row">
            <div className="form-group form-group-booking-passenger">
              <label>Họ tên <span className="asterisk">*</span></label>
              <input name="fullName" value={contactInfo.fullName} onChange={handleContactChange} placeholder="Họ và tên" required />
            </div>
            <div className="form-group form-group-booking-passenger">
              <label>Số điện thoại <span className="asterisk">*</span></label>
              <input name="phoneNumber" value={contactInfo.phoneNumber} onChange={handleContactChange} placeholder="Số điện thoại" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group form-group-booking-passenger">
              <label>Email <span className="asterisk">*</span></label>
              <input name="email" value={contactInfo.email} onChange={handleContactChange} placeholder="Email" required />
            </div>
            <div className="form-group form-group-booking-passenger">
              <label>Địa chỉ</label>
              <input name="address" value={contactInfo.address} onChange={handleContactChange} placeholder="Địa chỉ" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group form-group-booking-passenger">
              <label>Giới tính</label>
              <select name="gender" value={contactInfo.gender} onChange={handleContactChange}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="form-group form-group-booking-passenger">
              <label>Ngày sinh <span className="asterisk">*</span></label>
              <input name="birthDate" type="date" value={contactInfo.birthDate} onChange={handleContactChange} required />
            </div>
          </div>
        </div>

        {/* Bộ đếm hành khách */}
        <div className="passenger-counters-group">
          <div className="passenger-counters-row">
            {['adult', 'child', 'infant'].map(type => (
              <div key={type} className={`passenger-counter passenger-counter-${type}${type === 'infant' && passengerCounts.adult === 0 ? ' disabled' : ''}`}> 
                <div className="passenger-label">
                  {type === 'adult' ? 'Người lớn' : type === 'child' ? 'Trẻ em' : 'Em bé'}
                  <small>
                    {type === 'adult' ? '>= 12 tuổi' : type === 'child' ? '2-11 tuổi' : '< 2 tuổi'}
                  </small>
                </div>
                <div className="counter-controls">
                  <button type="button" onClick={() => handlePassengerCountChange(type, 'sub')} disabled={type === 'adult' ? passengerCounts[type] <= 1 : passengerCounts[type] <= 0}>-</button>
                  <span>{passengerCounts[type]}</span>
                  <button type="button" onClick={() => handlePassengerCountChange(type, 'add')}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin từng hành khách phụ */}
        {['adult', 'child', 'infant'].map(type => (
          additionalPassengers[type].length > 0 && (
            <div key={type} className="passenger-type-section">
              <div className="passenger-type-title">
                {type === 'adult' ? 'Người lớn' : type === 'child' ? 'Trẻ em' : 'Em bé'} bổ sung
                <span className="passenger-type-desc">(Vui lòng nhập đủ thông tin)</span>
              </div>
              {additionalPassengers[type].map((p, idx) => (
                <div key={idx} className="passenger-form passenger-form-row">
                  <div className="passenger-form-group">
                    <label className="passenger-form-label">Họ tên <span className="asterisk">*</span></label>
                    <input className="passenger-form-input" value={p.fullName} onChange={e => handleAdditionalPassengerChange(type, idx, 'fullName', e.target.value)} placeholder="Họ và tên" required />
                  </div>
                  <div className="passenger-form-group">
                    <label className="passenger-form-label">Giới tính</label>
                    <select className="passenger-form-select" value={p.gender} onChange={e => handleAdditionalPassengerChange(type, idx, 'gender', e.target.value)}>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="passenger-form-group">
                    <label className="passenger-form-label">Ngày sinh <span className="asterisk">*</span></label>
                    <input className="passenger-form-input" type="date" value={p.birthDate} onChange={e => handleAdditionalPassengerChange(type, idx, 'birthDate', e.target.value)} required />
                  </div>
                </div>
              ))}
            </div>
          )
        ))}
      </div>

      {/* RIGHT: Thông tin tour đã đặt & tổng giá */}
      <div className="booking-right">
        <div className="booked-tour-summary">
          <div className="tour-summary">
            <div className="tour-image-booking-passenger">
              <img src={bookedTour.imageUrl ? `http://localhost:8080${bookedTour.imageUrl}` : '/no-image.png'} alt="tour" />
            </div>
            <div className="tour-details">
              <h3>{bookedTour.name}</h3>
              <p><b>Ngày khởi hành:</b> {selectedDate}</p>
              <p><b>Mã booking:</b> {bookingCode}</p>
              <p><b>Thời gian:</b> {bookedTour.duration} ngày</p>
              <p><b>Điểm đến:</b> {bookedTour.destinationName || '-'}</p>
            </div>
          </div>
        </div>
        <div className="price-summary" style={{marginTop: 32, marginBottom: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e3e8f0', padding: 20}}>
          <div style={{fontSize: 18, fontWeight: 700, marginBottom: 8}}>Tổng giá</div>
          <div style={{fontSize: 28, fontWeight: 800, color: '#ff5722', marginBottom: 8}}>
            {discountedPrice?.toLocaleString()}đ
          </div>
          {discountInfo && (
            <div style={{color: '#388e3c', fontWeight: 600, marginBottom: 8}}>
              Đã áp dụng mã giảm giá: {discountInfo.code} (-{discountInfo.discountPercent}%)
            </div>
          )}
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <input type="text" value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="Nhập mã giảm giá" style={{padding: '6px 12px', borderRadius: 6, border: '1px solid #bbb', fontSize: 15}} />
            <button type="button" onClick={handleApplyDiscount} style={{padding: '6px 18px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'}}>Áp dụng</button>
          </div>
          {discountError && <div style={{color: '#e53935', marginTop: 6}}>{discountError}</div>}
        </div>
        <div className="submit-section">
          <button className="submit-button" onClick={handleSubmitPassengers} disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Xác nhận & Tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPassenger;