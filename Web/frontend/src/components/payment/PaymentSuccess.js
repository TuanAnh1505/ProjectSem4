import React from 'react';
import { FaCheckCircle, FaFileInvoice, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = ({ payment, booking }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download functionality
    console.log('Downloading invoice for payment:', payment.paymentId);
  };

  if (!payment || !booking) {
    return <div className="payment-success-loading">Đang tải thông tin thanh toán...</div>;
  }

  return (
    <div className="payment-success">
      <div className="payment-success-header">
        <FaCheckCircle className="success-icon" />
        <h2>Thanh toán thành công!</h2>
        <p className="success-message">Cảm ơn bạn đã đặt phòng tại khách sạn của chúng tôi</p>
      </div>

      <div className="payment-success-details">
        <div className="success-section">
          <h3>Thông tin thanh toán</h3>
          <div className="detail-item">
            <span>Mã thanh toán:</span>
            <span>{payment.paymentId}</span>
          </div>
          <div className="detail-item">
            <span>Phương thức thanh toán:</span>
            <span>{payment.paymentMethod.methodName}</span>
          </div>
          <div className="detail-item">
            <span>Số tiền:</span>
            <span className="amount">{formatCurrency(payment.amount)}</span>
          </div>
          <div className="detail-item">
            <span>Trạng thái:</span>
            <span className="status success">Đã thanh toán</span>
          </div>
          <div className="detail-item">
            <span>Thời gian:</span>
            <span>{new Date(payment.paymentDate).toLocaleString('vi-VN')}</span>
          </div>
        </div>

        <div className="success-section">
          <h3>Thông tin đặt phòng</h3>
          <div className="detail-item">
            <span>Mã đặt phòng:</span>
            <span>{booking.bookingId}</span>
          </div>
          <div className="detail-item">
            <span>Ngày nhận phòng:</span>
            <span>{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="detail-item">
            <span>Ngày trả phòng:</span>
            <span>{new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        <div className="success-actions">
          <button className="download-invoice" onClick={handleDownloadInvoice}>
            <FaDownload /> Tải hóa đơn
          </button>
          <Link to="/bookings" className="view-bookings">
            <FaFileInvoice /> Xem đặt phòng của tôi
          </Link>
        </div>

        <div className="success-note">
          <p>* Hóa đơn đã được gửi đến email của bạn</p>
          <p>* Vui lòng kiểm tra email để biết thêm chi tiết</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 