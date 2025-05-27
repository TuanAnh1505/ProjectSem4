import React from 'react';
import './PaymentSummary.css';

const PaymentSummary = ({ booking, paymentMethod }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!booking) return 0;
    const subtotal = booking.totalAmount || 0;
    const tax = subtotal * 0.1; // 10% VAT
    return subtotal + tax;
  };

  if (!booking) {
    return <div className="payment-summary-loading">Đang tải thông tin thanh toán...</div>;
  }

  return (
    <div className="payment-summary">
      <h3 className="payment-summary-title">Thông tin thanh toán</h3>
      
      <div className="payment-summary-section">
        <h4>Thông tin đặt phòng</h4>
        <div className="summary-item">
          <span>Mã đặt phòng:</span>
          <span>{booking.bookingId}</span>
        </div>
        <div className="summary-item">
          <span>Ngày đặt:</span>
          <span>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="summary-item">
          <span>Ngày nhận phòng:</span>
          <span>{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="summary-item">
          <span>Ngày trả phòng:</span>
          <span>{new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      <div className="payment-summary-section">
        <h4>Chi tiết thanh toán</h4>
        <div className="summary-item">
          <span>Tạm tính:</span>
          <span>{formatCurrency(booking.totalAmount)}</span>
        </div>
        <div className="summary-item">
          <span>Thuế (10%):</span>
          <span>{formatCurrency(booking.totalAmount * 0.1)}</span>
        </div>
        <div className="summary-item total">
          <span>Tổng cộng:</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>
      </div>

      {paymentMethod && (
        <div className="payment-summary-section">
          <h4>Phương thức thanh toán</h4>
          <div className="summary-item">
            <span>Đã chọn:</span>
            <span className="payment-method">{paymentMethod}</span>
          </div>
        </div>
      )}

      <div className="payment-summary-note">
        <p>* Giá đã bao gồm thuế VAT</p>
        <p>* Vui lòng kiểm tra kỹ thông tin trước khi thanh toán</p>
      </div>
    </div>
  );
};

export default PaymentSummary; 