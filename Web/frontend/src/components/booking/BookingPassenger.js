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
  const { bookingId, tourInfo, selectedDate, itinerary } = location.state || {};

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
  const [passengerCounts, setPassengerCounts] = useState({
    adult: 1,
    child: 0,
    infant: 0
  });

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
        const userId = localStorage.getItem('userId');
        if (!token || !userId) return navigate('/login');

        const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
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

  // Tính toán tổng giá
  useEffect(() => {
    if (bookedTour) {
      const adultPrice = bookedTour.price;
      const childPrice = bookedTour.price * 0.5;
      const infantPrice = bookedTour.price * 0.25;

      const total = (passengerCounts.adult * adultPrice) +
        (passengerCounts.child * childPrice) +
        (passengerCounts.infant * infantPrice);
      setTotalPrice(total);
    }
  }, [passengerCounts, bookedTour]);

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
      const newCount = operation === 'add'
        ? prev[type] + 1
        : Math.max(type === 'adult' ? 1 : 0, prev[type] - 1);

      setAdditionalPassengers(prevDetails => {
        let updated = [...prevDetails[type]];
        if (type === 'adult') {
          // Đảm bảo số phần tử luôn là newCount - 1
          if (updated.length < newCount - 1) {
            // Thêm phần tử nếu thiếu
            while (updated.length < newCount - 1) {
              updated.push({ fullName: '', gender: 'Nam', birthDate: '' });
            }
          } else if (updated.length > newCount - 1) {
            // Xóa phần tử nếu thừa
            updated = updated.slice(0, newCount - 1);
          }
        } else {
          // Trẻ em và em bé: số phần tử đúng bằng newCount
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
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return navigate('/login');

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

      const payload = {
        bookingId: parseInt(bookingId),
        userId: parseInt(userId),
        contactInfo: {
          fullName: contactInfo.fullName.trim(),
          phoneNumber: contactInfo.phoneNumber.trim(),
          email: contactInfo.email.trim(),
          address: contactInfo.address?.trim() || '',
          gender: contactInfo.gender,
          birthDate: contactInfo.birthDate
        },
        passengers: passengerCounts,
        passengerDetails // <-- chỉ chứa Người lớn 2 trở đi, trẻ em, em bé
      };

      const res = await axios.post('http://localhost:8080/api/booking-passengers/submit', payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      toast.success('Đăng ký thông tin hành khách thành công!');
      navigate('/booking-confirmation', {
        state: { bookingId, passengers: res.data, tourInfo: bookedTour, itinerary}
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký thông tin hành khách';
      toast.error(msg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-layout">
      <div className="booking-left">
        <h2>THÔNG TIN LIÊN LẠC</h2>
        <div className="contact-info">
          <div className="use-logged-in-toggle">
            <label className="toggle-switch">
              <input type="checkbox" checked={useLoggedInInfo} onChange={handleToggleUserInfo} />
              <span className="toggle-slider"></span>
            </label>
            <span>Sử dụng thông tin tài khoản đang đăng nhập</span>
          </div>

          <div className="form-row">
            <div className="form-group-booking-passenger">
              <label>Họ tên <span className="asterisk">*</span></label>
              <input type="text" name="fullName" value={contactInfo.fullName} onChange={handleContactChange} placeholder="Liên hệ" />
            </div>
            <div className="form-group-booking-passenger">
              <label>Điện thoại <span className="asterisk">*</span></label>
              <input type="tel" name="phoneNumber" value={contactInfo.phoneNumber} onChange={handleContactChange} placeholder="Nhập số điện thoại" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-booking-passenger">
              <label>Email <span className="asterisk">*</span></label>
              <input type="email" name="email" value={contactInfo.email} onChange={handleContactChange} placeholder="Nhập email" />
            </div>
            <div className="form-group-booking-passenger">
              <label>Địa chỉ</label>
              <input type="text" name="address" value={contactInfo.address} onChange={handleContactChange} placeholder="Nhập địa chỉ" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-booking-passenger">
              <label>Giới tính: <span className="asterisk">*</span></label>
              <select name="gender" value={contactInfo.gender} onChange={handleContactChange}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="form-group-booking-passenger">
              <label>Ngày sinh: <span className="asterisk">*</span></label>
              <input type="date" name="birthDate" value={contactInfo.birthDate} onChange={handleContactChange} />
            </div>
          </div>
        </div>

        <h2>HÀNH KHÁCH</h2>
        <div className="passenger-counters-group">
          <div className="passenger-counters-row">
            <div className="passenger-counter passenger-counter-adult">
              <div className="passenger-label">
                Người lớn <small>(Từ 12 trở lên) <span className="info-icon" title="Từ 12 tuổi trở lên">&#9432;</span></small>
              </div>
              <div className="counter-controls">
                <button onClick={() => handlePassengerCountChange('adult', 'subtract')}>-</button>
                <span>{passengerCounts.adult}</span>
                <button onClick={() => handlePassengerCountChange('adult', 'add')}>+</button>
              </div>
            </div>
            <div className="passenger-counter passenger-counter-child">
              <div className="passenger-label">
                Trẻ em <small>(Từ 2 - 11 tuổi) <span className="info-icon" title="Từ 2 đến 11 tuổi">&#9432;</span></small>
              </div>
              <div className="counter-controls">
                <button onClick={() => handlePassengerCountChange('child', 'subtract')}>-</button>
                <span>{passengerCounts.child}</span>
                <button onClick={() => handlePassengerCountChange('child', 'add')}>+</button>
              </div>
            </div>
          </div>
          <div className="passenger-counter passenger-counter-infant">
            <div className="passenger-label">
              Em bé <small>(Dưới 2 tuổi) <span className="info-icon" title="Dưới 2 tuổi">&#9432;</span></small>
            </div>
            <div className="counter-controls">
              <button onClick={() => handlePassengerCountChange('infant', 'subtract')}>-</button>
              <span>{passengerCounts.infant}</span>
              <button onClick={() => handlePassengerCountChange('infant', 'add')}>+</button>
            </div>
          </div>
        </div>

        {/* Form nhập thông tin hành khách phụ */}
        {passengerCounts.adult > 1 && (
          <div className="passenger-type-section">
            <h3 className="passenger-type-title">
              <Users size={20} />
              Người lớn
              <small className="passenger-type-desc">(Từ 12 trở lên)</small>
            </h3>
            {additionalPassengers.adult.map((passenger, index) => (
              <div className="passenger-form" key={`adult-${index + 2}`}>
                <div className="passenger-form-row">
                  <div className="passenger-form-group" style={{ flex: 2 }}>
                    <label className="passenger-form-label">Người lớn {index + 2} - Họ tên <span className="asterisk">*</span></label>
                    <input
                      className="passenger-form-input"
                      type="text"
                      value={passenger.fullName}
                      onChange={(e) => handleAdditionalPassengerChange('adult', index, 'fullName', e.target.value)}
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div className="passenger-form-group" style={{ flex: 1 }}>
                    <label className="passenger-form-label">Giới tính: <span className="asterisk">*</span></label>
                    <select
                      className="passenger-form-select"
                      value={passenger.gender}
                      onChange={(e) => handleAdditionalPassengerChange('adult', index, 'gender', e.target.value)}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div className="passenger-form-group" style={{ flex: 1 }}>
                    <label className="passenger-form-label">Ngày sinh: <span className="asterisk">*</span></label>
                    <input
                      className="passenger-form-input"
                      type="date"
                      value={passenger.birthDate}
                      onChange={(e) => handleAdditionalPassengerChange('adult', index, 'birthDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {passengerCounts.child > 0 && (
          <div className="passenger-type-section">
            <h3 className="passenger-type-title">
              <User size={20} />
              Trẻ em
              <small className="passenger-type-desc">(Từ 2 - 11 tuổi)</small>
            </h3>
            {additionalPassengers.child.map((passenger, index) => (
              <div className="passenger-form" key={`child-${index}`}>
                <div className="passenger-form-row">
                  <div className="passenger-form-group" style={{ flex: 2 }}>
                    <label className="passenger-form-label">Trẻ em {index + 1} - Họ tên <span className="asterisk">*</span></label>
                    <input
                      className="passenger-form-input"
                      type="text"
                      value={passenger.fullName}
                      onChange={(e) => handleAdditionalPassengerChange('child', index, 'fullName', e.target.value)}
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div className="passenger-form-group" style={{ flex: 1 }}>
                    <label className="passenger-form-label">Giới tính: <span className="asterisk">*</span></label>
                    <select
                      className="passenger-form-select"
                      value={passenger.gender}
                      onChange={(e) => handleAdditionalPassengerChange('child', index, 'gender', e.target.value)}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div className="passenger-form-group" style={{ flex: 1 }}>
                    <label className="passenger-form-label">Ngày sinh: <span className="asterisk">*</span></label>
                    <input
                      className="passenger-form-input"
                      type="date"
                      value={passenger.birthDate}
                      onChange={(e) => handleAdditionalPassengerChange('child', index, 'birthDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {passengerCounts.infant > 0 && (
          <div className="passenger-type-section">
            <h3 className="passenger-type-title">
              <Smile size={20} />
              Em bé
              <small className="passenger-type-desc">(Dưới 2 tuổi)</small>
            </h3>
            {additionalPassengers.infant.map((passenger, index) => (
              <div className="passenger-form" key={`infant-${index}`}>
                <div className="passenger-form-row">
                  <div className="passenger-form-group" style={{ flex: 2 }}>
                    <label className="passenger-form-label">Em bé {index + 1} - Họ tên <span className="asterisk">*</span></label>
                    <input
                      className="passenger-form-input"
                      type="text"
                      value={passenger.fullName}
                      onChange={(e) => handleAdditionalPassengerChange('infant', index, 'fullName', e.target.value)}
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div className="passenger-form-group" style={{ flex: 1 }}>
                    <label className="passenger-form-label">Giới tính: <span className="asterisk">*</span></label>
                    <select
                      className="passenger-form-select"
                      value={passenger.gender}
                      onChange={(e) => handleAdditionalPassengerChange('infant', index, 'gender', e.target.value)}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div className="passenger-form-group" style={{ flex: 1 }}>
                    <label className="passenger-form-label">Ngày sinh: <span className="asterisk">*</span></label>
                    <input
                      className="passenger-form-input"
                      type="date"
                      value={passenger.birthDate}
                      onChange={(e) => handleAdditionalPassengerChange('infant', index, 'birthDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="booking-right">
        {bookedTour && (
          <div className="booked-tour-summary">
            <h2>THÔNG TIN TOUR ĐÃ ĐẶT</h2>
            <div className="tour-summary">
              <div className="tour-image-booking-passenger">
                <img src={`http://localhost:8080${bookedTour.imageUrl}`} alt={bookedTour.name} />
              </div>

              <div className="tour-details">
                <h3>{bookedTour.name}</h3>
                <p>Ngày khởi hành: {new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
                <p>Giá: {bookedTour.price.toLocaleString()}đ</p>
                <p>Mã đặt tour: {bookingId}</p>
              </div>
            </div>

            {/* Hiển thị thông tin lịch trình đã đặt nếu có */}
            {itinerary && (
              <div className="itinerary-summary" style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: 8,
                height: 220,
                overflowY: 'auto',
                boxSizing: 'border-box',
                transition: 'height 0.2s',
                minHeight: 120,
                maxHeight: 300
              }}>
                <h4 style={{fontWeight: 'bold'}}>Lịch trình đã chọn</h4>
                <div><b>{itinerary.name ? itinerary.name : `Lịch trình`}</b></div>
                {(itinerary.startDate || itinerary.endDate) && (
                  <div>
                    {itinerary.startDate && (
                      <span>Bắt đầu: {new Date(itinerary.startDate).toLocaleDateString('vi-VN')}</span>
                    )}
                    {itinerary.startDate && itinerary.endDate && ' - '}
                    {itinerary.endDate && (
                      <span>Kết thúc: {new Date(itinerary.endDate).toLocaleDateString('vi-VN')}</span>
                    )}
                  </div>
                )}
                {itinerary.destinations && itinerary.destinations.length > 0 && (
                  <div style={{marginTop: 8}}>
                    <b>Điểm đến:</b>
                    <ul style={{margin: 0, paddingLeft: 20}}>
                      {itinerary.destinations.sort((a, b) => a.visitOrder - b.visitOrder).map(dest => (
                        <li key={dest.destinationId} style={{cursor: 'pointer'}} onClick={() => toggleDestinationNote(dest.destinationId)}>
                          Ngày {dest.visitOrder}: {dest.name}
                          {expandedDestinationIds.includes(dest.destinationId) && (
                            <div style={{marginLeft: 16, color: '#555', fontStyle: 'italic', fontSize: 14}}>
                              {dest.note ? dest.note : 'Không có ghi chú'}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {itinerary.events && itinerary.events.length > 0 && (
                  <div style={{marginTop: 8}}>
                    <b>Sự kiện:</b>
                    <ul style={{margin: 0, paddingLeft: 20}}>
                      {itinerary.events.map(event => (
                        <li key={event.eventId} style={{cursor: 'pointer'}} onClick={() => toggleEventNote(event.eventId)}>
                          {event.name}
                          {expandedEventIds.includes(event.eventId) && (
                            <div style={{marginLeft: 16, color: '#555', fontStyle: 'italic', fontSize: 14}}>
                              {event.note ? event.note : 'Không có ghi chú'}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="price-breakdown">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: 15 }}>
                  <span role="img" aria-label="user">👥</span> KHÁCH HÀNG + PHỤ THU
                </span>
                <span style={{ color: 'red', fontWeight: 'bold', fontSize: 24, marginLeft: 70 }}>
                  {totalPrice.toLocaleString()} đ
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                {passengerCounts.adult > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Người lớn</span>
                    <span>{passengerCounts.adult} x {bookedTour.price.toLocaleString()} đ</span>
                  </div>
                )}
                {passengerCounts.child > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Trẻ em</span>
                    <span>{passengerCounts.child} x {(bookedTour.price * 0.5).toLocaleString()} đ</span>
                  </div>
                )}
                {passengerCounts.infant > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Em bé</span>
                    <span>{passengerCounts.infant} x {(bookedTour.price * 0.25).toLocaleString()} đ</span>
                  </div>
                )}
              </div>
            </div>

            <div className="submit-section">
              <button className="submit-button" onClick={handleSubmitPassengers} disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : 'Đặt ngay'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPassenger;
