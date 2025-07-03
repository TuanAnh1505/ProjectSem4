import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingConfirmation.css';

// Hàm tính tuổi từ ngày sinh
function getAge(birthDate) {
  if (!birthDate) return '';
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Hàm hiển thị loại khách + tuổi
function getTypeAndAge(passenger) {
  const age = getAge(passenger.birthDate);
  let type = '';
  if (passenger.passengerType === 'adult') type = 'Người lớn';
  else if (passenger.passengerType === 'child') type = 'Trẻ em';
  else type = 'Em bé';
  return `${type} (${age ? age + ' Tuổi' : ''})`;
}

// Hàm che số điện thoại, chỉ hiện 3 số cuối
function maskPhone(phone) {
  if (!phone) return '';
  const str = phone.toString();
  return str.length > 3 ? '*'.repeat(str.length - 3) + str.slice(-3) : str;
}

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log('BookingConfirmation location.state:', location.state);
  console.log('userId in location.state:', location.state?.userId);
  const { bookingId, bookingCode, passengers, tourInfo, contactInfo, itineraries = [], finalPrice, basePrice, passengerCounts, paymentCode } = location.state || {};

  // Log để debug giá nhận được
  console.log('BookingConfirmation - Giá nhận được:', {
    finalPrice,
    basePrice,
    passengerCounts,
    tourInfo: tourInfo?.price
  });


  const [bookingFromApi, setBookingFromApi] = React.useState(null);


  const [currentImage, setCurrentImage] = React.useState(0);

  const imageCount = tourInfo && tourInfo.imageUrls ? tourInfo.imageUrls.length : 0;


  const [touchStartX, setTouchStartX] = React.useState(null);
  const [touchEndX, setTouchEndX] = React.useState(null);
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => {
    if (bookingId) {
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:8080/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setBookingFromApi(res.data))
      .catch(err => console.error('Lỗi lấy booking:', err));
    }
  }, [bookingId]);

  if (!bookingCode && !bookingId) {
    return (
      <div className="confirmation-wrapper">
        <h2>Không tìm thấy thông tin đặt chỗ</h2>
        <button onClick={() => navigate('/tour-dashboard')}>Quay lại trang Tour</button>
      </div>
    );
  }


  const contact = contactInfo || passengers[0] || {};

  const calculateTotal = () => {
    if (!tourInfo || !passengerCounts) return 0;
    

    if (finalPrice !== undefined) {
      console.log('BookingConfirmation - Using finalPrice:', finalPrice);
      return finalPrice;
    }
    

    const adultPrice = basePrice || tourInfo.price;
    const childPrice = adultPrice * 0.5;
    const infantPrice = 0; // Em bé miễn phí

    const adultTotal = (passengerCounts?.adult || 0) * adultPrice;
    const childTotal = (passengerCounts?.child || 0) * childPrice;
    const infantTotal = (passengerCounts?.infant || 0) * infantPrice;

    const total = adultTotal + childTotal + infantTotal;

    console.log('BookingConfirmation - Price calculation:', {
      basePrice: adultPrice,
      passengerCounts,
      adultPrice,
      childPrice,
      infantPrice,
      adultTotal,
      childTotal,
      infantTotal,
      total,
      finalPrice
    });

    return total;
  };


  const bookingStatus = 'Đã xác nhận';

  const flightInfo = 'Thông tin chuyến bay';

  const handlePayment = async () => {
    const calculatedAmount = calculateTotal();
    try {
      const token = localStorage.getItem('token');

      const userId = bookingFromApi?.user?.userid || location.state?.userId;
      if (!userId) throw new Error('Không tìm thấy userId cho booking');

      const res = await axios.post('http://localhost:8080/api/payments', {
        bookingId,
        userId,
        amount: finalPrice !== undefined ? finalPrice : calculatedAmount,
        paymentMethodId: 1 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const paymentCode = res.data.paymentCode;
      if (!paymentCode) throw new Error('Không nhận được mã thanh toán');
    
      navigate(`/payment/${paymentCode}`, {
        state: {
          paymentCode,
          amount: finalPrice !== undefined ? finalPrice : calculatedAmount,
          tourInfo,
          passengers,
          passengerCounts,
          basePrice,
          finalPrice
        }
      });
    } catch (err) {
      alert('Không thể tạo thanh toán mới: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePrevImage = () => {
    setCurrentImage((prevImage) => (prevImage === 0 ? imageCount - 1 : prevImage - 1));
  };

  const handleNextImage = () => {
    setCurrentImage((prevImage) => (prevImage === imageCount - 1 ? 0 : prevImage + 1));
  };

  // Mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchEndX - touchStartX;
      if (diff > 40) handlePrevImage();
      else if (diff < -40) handleNextImage();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Desktop
  const handleMouseDown = (e) => {
    setDragging(true);
    setTouchStartX(e.clientX);
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setTouchEndX(e.clientX);
  };
  const handleMouseUp = () => {
    if (dragging && touchStartX !== null && touchEndX !== null) {
      const diff = touchEndX - touchStartX;
      if (diff > 40) handlePrevImage();
      else if (diff < -40) handleNextImage();
    }
    setDragging(false);
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-main-layout">
        {/* Cột trái */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Thông tin liên lạc */}
          <div className="confirmation-box">
            <h4 className="confirmation-title">Thông tin liên lạc</h4>
            <div className="confirmation-info-row">
              <div className="confirmation-info-item"><b>Họ tên:</b> {contact.fullName}</div>
              <div className="confirmation-info-item"><b>Email:</b> {contact.email}</div>
            </div>
            <div className="confirmation-info-row">
            <div className="confirmation-info-item"><b>Điện thoại:</b> {maskPhone(contact.phone || contact.phoneNumber)}</div>
              <div className="confirmation-info-item"><b>Địa chỉ:</b> {contact.address}</div>
            </div>
          </div>
          {/* Chi tiết booking */}
          <div className="confirmation-box">
            <h4 className="confirmation-title">Chi tiết booking</h4>
            <div className="confirmation-info-row">
              <div className="confirmation-info-item"><b>Mã đặt chỗ:</b> <span style={{ color: 'red' }}>{bookingCode}</span></div>
              <div className="confirmation-info-item"><b>Ngày đặt:</b> {new Date().toLocaleString('vi-VN')}</div>
            </div>
            <div className="confirmation-info-row">
              <div className="confirmation-info-item"><b>Số khách:</b> {passengers.length}</div>
              <div className="confirmation-info-item"><b>Tổng cộng:</b> <span style={{ color: 'red', fontWeight: 'bold' }}>{calculateTotal().toLocaleString()} đ</span></div>
              <div className="confirmation-info-item"><b>Trạng thái:</b> <span className="confirmation-status">{bookingStatus}</span></div>
            </div>
          </div>
          {/* Danh sách hành khách */}
          <div className="confirmation-box">
            <h4 className="confirmation-title">Danh sách hành khách</h4>
            <div className="confirmation-table-wrapper">
              <table className="confirmation-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Ngày sinh</th>
                    <th>Giới tính</th>
                    <th>Độ tuổi</th>
                  </tr>
                </thead>
                <tbody>
                  {passengers.map((p, i) => (
                    <tr key={i}>
                      <td>{p.fullName}</td>
                      <td>{p.birthDate}</td>
                      <td>{p.gender}</td>
                      <td>{getTypeAndAge(p)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="confirmation-total">
              Tổng cộng: {calculateTotal().toLocaleString()} đ
            </div>
          </div>
        </div>
        {/* Cột phải */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="confirmation-box" style={{ minWidth: 340 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Slider ảnh tour */}
              <div className="confirmation-slider-wrapper">
                {imageCount > 0 ? (
                  <img
                    src={`http://localhost:8080${tourInfo.imageUrls[currentImage]}`}
                    alt={tourInfo.name}
                    className="confirmation-slider-image"
                    onClick={handleNextImage}
                    style={{ cursor: imageCount > 1 ? 'pointer' : 'default' }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                ) : (
                  <div className="confirmation-tour-noimage">No Image</div>
                )}
                {imageCount > 1 && (
                  <div className="slider-dots">
                    {tourInfo.imageUrls.map((_, idx) => (
                      <span
                        key={idx}
                        className={`slider-dot${idx === currentImage ? ' active' : ''}`}
                        onClick={() => setCurrentImage(idx)}
                      ></span>
                    ))}
                  </div>
                )}
              </div>
              {/* Kết thúc slider ảnh tour */}
              <div className="confirmation-tour-name">
                {tourInfo.name}
              </div>
            </div>
            <div className="confirmation-tour-detail"><b>Mã booking:</b> <span style={{ color: 'red' }}>{bookingCode}</span></div>
            <div style={{ marginBottom: 8 }}><b>Trạng thái:</b> <span className="confirmation-status">{bookingStatus}</span></div>
            <div className="confirmation-tour-pricebox">
              {/* <div style={{ marginBottom: 4 }}><b>Giá tour:</b> {(basePrice || tourInfo?.price || 0).toLocaleString()} đ</div> */}
              <div style={{ marginBottom: 4 }}><b>Số khách:</b> {passengerCounts?.adult || 0} người lớn, {passengerCounts?.child || 0} trẻ em, {passengerCounts?.infant || 0} em bé</div>
              <div style={{ marginBottom: 4 }}><b>Tổng cộng:</b> <span style={{ color: 'red', fontWeight: 'bold' }}>{calculateTotal().toLocaleString()} đ</span></div>
            </div>
            {/* {itineraries && itineraries.length > 0 && (
              <div className="confirmation-itinerary-summary">
                <h4 className="confirmation-itinerary-title">Lịch trình đã chọn</h4>
                {itineraries.map((itinerary, idx) => (
                  <div key={itinerary.itineraryId} style={{marginBottom: 12}}>
                    <div><b>{itinerary.title || `Lịch trình ${idx + 1}`}</b></div>
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
                    {itinerary.startTime && (
                      <div style={{marginTop: 8}}>
                        <div><b>Giờ bắt đầu:</b> {itinerary.startTime}</div>
                      </div>
                    )}
                    {itinerary.endTime && (
                      <div style={{marginTop: 8}}>
                        <div><b>Giờ kết thúc:</b> {itinerary.endTime}</div>
                      </div>
                    )}
                    {itinerary.description && (
                      <div style={{marginTop: 8}}>
                        <div><b>Mô tả:</b> {itinerary.description}</div>
                      </div>
                    )}
                    {itinerary.type && (
                      <div style={{marginTop: 8}}>
                        <div><b>Loại:</b> {itinerary.type}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )} */}
            <button 
              onClick={handlePayment}
              className="confirmation-pay-btn"
            >
              Thanh toán ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;