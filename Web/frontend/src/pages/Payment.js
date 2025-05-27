import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import './Payment.css';

const Payment = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bankQr, setBankQr] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8080/api/bookings/${bookingId}/detail`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setBooking(response.data);
      } catch (err) {
        setError('Không thể tải thông tin đặt phòng');
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      // Lấy số điện thoại user từ booking (giả sử booking.booking.user.phone)
      const userPhone = booking?.booking?.user?.phone || '0123456789';
      const amount = booking?.booking?.totalPrice || booking?.totalAmount;

      // Nếu là Bank Transfer (methodId = 2)
      if (selectedMethod === 2) {
        setQrLoading(true);
        setBankQr(null);
        try {
          const response = await axios.post(
            'http://localhost:8080/api/payments/bank-transfer-qr',
            {
              amount: amount,
              phone: userPhone
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('Bank transfer QR response:', response.data);
          setBankQr(response.data);
        } catch (err) {
          console.error('Error generating QR code:', err.response?.data || err);
          setError('Không thể tạo mã QR. Vui lòng thử lại sau.');
        } finally {
          setQrLoading(false);
        }
        return;
      }

      // Nếu là MoMo (giả sử methodId = 5 là MoMo)
      if (selectedMethod === 5) {
        const response = await axios.post(
          'http://localhost:8080/api/payments/momo',
          {
            bookingId: parseInt(bookingId),
            userId: parseInt(userId),
            paymentMethodId: selectedMethod,
            amount: amount
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        window.location.href = response.data.payUrl;
        return;
      }

      // Xử lý các phương thức thanh toán khác ở đây
      const response = await axios.post(
        'http://localhost:8080/api/payments',
        {
          bookingId: parseInt(bookingId),
          userId: parseInt(userId),
          paymentMethodId: selectedMethod,
          amount: amount
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Chuyển hướng đến trang thanh toán thành công
      navigate(`/payment/success/${response.data.paymentId}`);
    } catch (err) {
      setError('Có lỗi xảy ra khi xử lý thanh toán');
      setQrLoading(false);
      console.error('Payment error:', err);
    }
  };

  if (loading) {
    return <div className="payment-loading">Đang tải thông tin thanh toán...</div>;
  }

  if (error) {
    return <div className="payment-error">{error}</div>;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="payment-title">Thanh toán</h1>
        <div className="payment-content">
          <div className="payment-left">
            <PaymentMethodSelector
              onSelectMethod={handleMethodSelect}
              selectedMethod={selectedMethod}
            />
          </div>
          <div className="payment-right">
            {qrLoading && (
              <div className="payment-loading">Đang tạo mã QR chuyển khoản...</div>
            )}
            {bankQr && (
              <div className="bank-transfer-qr-modal">
                <h3>Quét mã QR để chuyển khoản</h3>
                {console.log('Current bankQr state:', bankQr)}
                <img 
                  src={bankQr.qrDataURL} 
                  alt="QR Bank Transfer" 
                  style={{maxWidth: 300}}
                  onError={(e) => {
                    console.error('Error loading QR image:', e);
                    console.log('Failed QR image src:', bankQr.qrDataURL);
                  }}
                />
                <div><b>Ngân hàng:</b> {bankQr.bankName}</div>
                <div><b>Số tài khoản:</b> {bankQr.accountNumber}</div>
                <div><b>Tên tài khoản:</b> {bankQr.accountName}</div>
                <div><b>Số tiền:</b> {bankQr.amount.toLocaleString()} VND</div>
                <div><b>Nội dung chuyển khoản:</b> {bankQr.transferContent}</div>
                <div style={{color: 'red', marginTop: 8}}>Vui lòng chuyển khoản đúng nội dung để được xác nhận tự động!</div>
                <button onClick={() => setBankQr(null)} style={{marginTop: 12}}>Đóng</button>
              </div>
            )}
          </div>
        </div>

        <div className="payment-actions">
          <button
            className="payment-button"
            onClick={handlePayment}
            disabled={!selectedMethod}
          >
            Thanh toán ngay
          </button>
          <button
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
        </div>

        {error && (
          <div className="payment-error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment; 