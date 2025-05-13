import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, passengers, tourInfo, contactInfo, selectedDate: stateSelectedDate } = location.state || {};

  if (!bookingId || !passengers || !tourInfo) {
    return (
      <div className="confirmation-wrapper">
        <h2>Không tìm thấy thông tin đặt chỗ</h2>
        <button onClick={() => navigate('/tours')}>Quay lại trang Tour</button>
      </div>
    );
  }

  // Lấy thông tin liên lạc từ contactInfo hoặc passengers[0]
  const contact = contactInfo || passengers[0] || {};

  // Lấy ngày khởi hành ưu tiên theo thứ tự: state.selectedDate -> tourInfo.selectedDate -> passengers[0].selectedDate
  const departureDate = stateSelectedDate || tourInfo.selectedDate || (passengers[0] && passengers[0].selectedDate);

  console.log('departureDate:', departureDate, 'stateSelectedDate:', stateSelectedDate, 'tourInfo.selectedDate:', tourInfo.selectedDate, 'passengers[0].selectedDate:', passengers[0] && passengers[0].selectedDate);

  const calculateTotal = () => {
    let total = 0;
    const basePrice = tourInfo.price;
    passengers.forEach(p => {
      switch (p.passengerType) {
        case 'adult':
          total += basePrice;
          break;
        case 'child':
          total += basePrice * 0.5;
          break;
        case 'infant':
          total += basePrice * 0.25;
          break;
        default:
          break;
      }
    });
    return total;
  };

  // Mock trạng thái và ghi chú nếu chưa có
  const bookingStatus = 'Đã xác nhận';
  // const bookingNote = '(Booking từ Travel.com.vn (Tour giá chợ -500.000 đ/ khách, ))';
  const flightInfo = 'Thông tin chuyến bay';

  return (
    <div className="confirmation-container">
      <div className="confirmation-main-layout" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Cột trái */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Thông tin liên lạc */}
          <div className="confirmation-box" style={{border: '1px solid #bbbbbb', background: '#fff', borderRadius: 8, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px #eee' }}>
            <h4 style={{ marginBottom: 12, color: '#1976d2' }}>THÔNG TIN LIÊN LẠC</h4>
            <div style={{ display: 'flex', marginBottom: 4 }}><b style={{ minWidth: 150 }}>Họ tên:</b> <span style={{ flex: 1 }}>{contact.fullName}</span></div>
            <div style={{ display: 'flex', marginBottom: 4 }}><b style={{ minWidth: 150 }}>Email:</b> <span style={{ flex: 1 }}>{contact.email}</span></div>
            <div style={{ display: 'flex', marginBottom: 4 }}><b style={{ minWidth: 150 }}>Điện thoại:</b> <span style={{ flex: 1 }}>{contact.phone || contact.phoneNumber}</span></div>
            <div style={{ display: 'flex', marginBottom: 4 }}><b style={{ minWidth: 150 }}>Địa chỉ:</b> <span style={{ flex: 1 }}>{contact.address}</span></div>
            {/* <div><b>Ghi chú:</b> {bookingNote}</div> */}
          </div>
          {/* Chi tiết booking */}
          <div className="confirmation-box" style={{ border: '1px solid #bbbbbb', background: '#fff', borderRadius: 8, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px #eee' }}>
            <h4 style={{ marginBottom: 12, color: '#1976d2' }}>CHI TIẾT BOOKING</h4>
            <div style={{ display: 'flex', marginBottom: 4 }}><b style={{ minWidth: 150 }}>Mã đặt chỗ:</b> <span style={{ color: 'red', flex: 1 }}>{bookingId}</span></div>
            <div style={{ display: 'flex', marginBottom: 4 }}>
              <b style={{ minWidth: 150 }}>Ngày khởi hành:</b>
              <span style={{ flex: 1 }}>
                {departureDate
                  ? (() => {
                      const d = new Date(departureDate);
                      return isNaN(d) ? '--' : d.toLocaleDateString('vi-VN');
                    })()
                  : '--'}
              </span>
            </div>
            <div style={{ display: 'flex', marginBottom: 4 }}><b style={{ minWidth: 150 }}>Ngày đặt:</b> <span style={{ flex: 1 }}>{new Date().toLocaleString('vi-VN')}</span></div>
            <div style={{ display: 'flex', marginBottom: 4 }}><b style={{ minWidth: 150 }}>Số khách:</b> <span style={{ flex: 1 }}>{passengers.length}</span></div>
            <div style={{ display: 'flex', marginBottom: 4 }}><b style={{ minWidth: 150 }}>Tổng cộng:</b> <span style={{ color: 'red', fontWeight: 'bold', flex: 1 }}>{calculateTotal().toLocaleString()} đ</span></div>
            <div style={{ display: 'flex', marginBottom: 4 }}><b style={{ minWidth: 150 }}>Trạng thái:</b> <span style={{ color: '#388e3c', fontWeight: 'bold', flex: 1 }}>{bookingStatus}</span></div>
            {/* <div><b>Ghi chú:</b> {bookingNote}</div> */}
          </div>
          {/* Danh sách hành khách */}
          <div className="confirmation-box" style={{ border: '1px solid #bbbbbb', borderRadius: 8, padding: 20 }}>
            <h4 style={{ marginBottom: 12, color: '#1976d2' }}>DANH SÁCH HÀNH KHÁCH</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  <th style={{ padding: 8 }}>Họ tên</th>
                  <th style={{ padding: 8 }}>Ngày sinh</th>
                  <th style={{ padding: 8 }}>Giới tính</th>
                  <th style={{ padding: 8 }}>Độ tuổi</th>
                  
                </tr>
              </thead>
              <tbody>
                {passengers.map((p, i) => (
                  <tr key={i}>
                    <td style={{ padding: 8 }}>{p.fullName}</td>
                    <td style={{ padding: 8 }}>{p.birthDate}</td>
                    <td style={{ padding: 8 }}>{p.gender}</td>
                    <td style={{ padding: 8 }}>{getTypeAndAge(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr/>
            <div style={{ textAlign: 'right', fontWeight: 'bold', color: 'red', fontSize: 20 }}>
              Tổng cộng: {calculateTotal().toLocaleString()} đ
            </div>
          </div>
        </div>
        {/* Cột phải */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="confirmation-box" style={{ border: '1px solid #bbbbbb', background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px #eee' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
                {tourInfo.imageUrl ? (
                  <img 
                    src={`http://localhost:8080${tourInfo.imageUrl}`} 
                    alt={tourInfo.name} 
                    style={{ 
                      width: 200, 
                      height: 150, 
                      borderRadius: 8, 
                      objectFit: 'cover' 
                    }} 
                  />
                ) : (
                  <div style={{ 
                    width: 200, 
                    height: 150, 
                    borderRadius: 8, 
                    background: '#f5f5f5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px dashed #bbb'
                  }}>
                    No Image
                  </div>
                )}
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: 16, 
                  flex: 1 
                }}>
                  {tourInfo.name}
                </div>
              </div>
              <div style={{ marginBottom: 8 }}><b>Mã booking:</b> <span style={{ color: 'red' }}>{bookingId}</span></div>
              <div style={{ marginBottom: 8 }}><b>Trạng thái:</b> <span style={{ color: '#388e3c', fontWeight: 'bold' }}>{bookingStatus}</span></div>
              {/* <div style={{ marginBottom: 8 }}><b>Thông tin chuyến bay:</b> {flightInfo}</div> */}
              <button style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 24px', fontWeight: 'bold', marginTop: 12, cursor: 'pointer' }}>
                Thanh toán ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
