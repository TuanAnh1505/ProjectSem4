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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null); // 'success' | 'failed' | null
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Lấy giá tiền từ location.state (được truyền từ BookingConfirmation)
  const amountFromState = location.state?.amount;
  const finalPriceFromState = location.state?.finalPrice;
  const basePriceFromState = location.state?.basePrice;
  const passengerCountsFromState = location.state?.passengerCounts;

  // Debug log để kiểm tra dữ liệu nhận được
  console.log('Payment - location.state:', location.state);
  console.log('Payment - amount values:', {
    amountFromState,
    finalPriceFromState,
    basePriceFromState,
    passengerCountsFromState
  });

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

        // Kiểm tra trạng thái PENDING quá 1 tiếng
        const bookingObj = response.data?.booking;
        if (bookingObj && bookingObj.status?.statusName === 'PENDING') {
          const bookingDate = new Date(bookingObj.bookingDate);
          const now = new Date();
          const diffMs = now - bookingDate;
          const diffHours = diffMs / (1000 * 60 * 60);
          if (diffHours > 1) {
            // Gọi API chuyển trạng thái sang SUPPORT_CONTACT
            await axios.put(
              `http://localhost:8080/api/bookings/${bookingId}/support-contact`,
              {},
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // Reload lại booking
            const updated = await axios.get(
              `http://localhost:8080/api/bookings/${bookingId}/detail`,
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setBooking(updated.data);
            alert('Đơn đặt tour của bạn đã được chuyển sang trạng thái "Nhân viên hỗ trợ liên hệ" do chưa thanh toán sau 1 tiếng. Vui lòng chờ nhân viên liên hệ hoặc đặt lại tour mới.');
          }
        }
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
      
      // Ưu tiên sử dụng giá tiền từ location.state, nếu không có thì lấy từ API
      // Ưu tiên: finalPriceFromState > amountFromState > booking API
      const amount = finalPriceFromState !== undefined ? finalPriceFromState : 
                    amountFromState || 
                    booking?.booking?.totalPrice || 
                    booking?.totalAmount;

      console.log('Payment amount:', {
        finalPriceFromState,
        amountFromState,
        bookingTotalPrice: booking?.booking?.totalPrice,
        bookingTotalAmount: booking?.totalAmount,
        finalAmount: amount
      });

      // Kiểm tra payment đã tồn tại cho booking này chưa
      const paymentRes = await axios.get(
        `http://localhost:8080/api/payments/booking/${bookingId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const existingPayment = paymentRes.data.find(
        p => p.statusName !== 'Completed' && p.statusName !== 'Failed'
      );

      // Nếu là Bank Transfer (methodId = 2)
      if (selectedMethod === 2) {
        setQrLoading(true);
        setBankQr(null);
        try {
          if (existingPayment) {
            setBankQr(existingPayment);
          } else {
            const response = await axios.post(
              'http://localhost:8080/api/payments/bank-transfer-qr',
              {
                amount: amount,
                phone: userPhone,
                bookingId: parseInt(bookingId),
                userId: parseInt(userId)
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            setBankQr(response.data);
          }
        } catch (err) {
          const errMsg = err.response?.data?.error || 'Không thể tạo mã QR. Vui lòng thử lại sau.';
          // Kiểm tra lỗi booking đã thanh toán
          if (errMsg.includes('đã thanh toán')) {
            // Kiểm tra user hiện tại có phải chủ booking không
            if (booking?.booking?.user?.userid?.toString() === userId) {
              setShowPaidModal(true);
            } else {
              setError('Bạn không có quyền truy cập booking này!');
              setShowErrorModal(true);
            }
          } else {
            setError(errMsg);
            setShowErrorModal(true);
          }
        } finally {
          setQrLoading(false);
        }
        return;
      }

      // Nếu là MoMo (giả sử methodId = 5 là MoMo)
      if (selectedMethod === 5) {
        if (existingPayment) {
          // Nếu đã có payment chưa completed, dùng lại
          // (Có thể redirect hoặc hiển thị thông tin payment)
          setBankQr(existingPayment);
          return;
        }
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
      if (existingPayment) {
        setBankQr(existingPayment);
        setConfirmResult('success');
        setSelectedMethod(null);
        return;
      }
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
      setConfirmResult('success');
      setBankQr(null);
      setSelectedMethod(null);
    } catch (err) {
      setError('Có lỗi xảy ra khi xử lý thanh toán');
      setQrLoading(false);
      console.error('Payment error:', err);
    }
  };

  useEffect(() => {
    let interval;
    if (bankQr && bankQr.paymentId) {
      interval = setInterval(async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `http://localhost:8080/api/payments/${bankQr.paymentId}/status`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          if (response.data.statusName && response.data.statusName.toLowerCase() === 'completed') {
            setConfirmResult('success');
            clearInterval(interval);
          }
        } catch (err) {
          
        }
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [bankQr]);

  if (loading) {
    return <div className="payment-loading">Đang tải thông tin thanh toán...</div>;
  }

  if (error) {
    return <div className="payment-error">{error}</div>;
  }

  return (
    <div className="payment-bg-gradient">
      <div className="payment-main-card">
        <h1 className="payment-title fintech">Thanh toán</h1>
        <div className="payment-content fintech">
          <div className="payment-methods fintech">
            <PaymentMethodSelector
              onSelectMethod={handleMethodSelect}
              selectedMethod={selectedMethod}
            />
          </div>
          <div className="payment-qr fintech">
            {qrLoading && (
              <div className="payment-loading fintech">Đang tạo mã QR chuyển khoản...</div>
            )}
            {bankQr && (
              <div className="bank-transfer-qr fintech">
                <h3 className="qr-title fintech">Quét mã QR để chuyển khoản</h3>
                <img 
                  src={bankQr.qrDataURL} 
                  alt="QR Bank Transfer" 
                  className="qr-image fintech"
                />
                <div className="qr-info fintech"><b>Ngân hàng:</b> <span>{bankQr.bankName}</span></div>
                <div className="qr-info fintech"><b>Số tài khoản:</b> <span>{bankQr.accountNumber}</span></div>
                <div className="qr-info fintech"><b>Tên tài khoản:</b> <span>{bankQr.accountName}</span></div>
                <div className="qr-info fintech"><b>Số tiền:</b> <span>{bankQr.amount.toLocaleString()} VND</span></div>
                <div className="qr-info fintech"><b>Nội dung chuyển khoản:</b> <span>{bankQr.transferContent}</span></div>
                <div className="qr-warning fintech"><span className="qr-warning-icon">⚠️</span> Vui lòng chuyển khoản đúng nội dung để được xác nhận tự động!</div>
              </div>
            )}
          </div>
        </div>
        <div className="payment-actions fintech">
          {bankQr ? (
            <button
              className="payment-btn fintech payment-confirm"
              onClick={async () => {
                setConfirmLoading(true);
                setConfirmResult(null);
                try {
                  const token = localStorage.getItem('token');
                  const response = await axios.get(
                    `http://localhost:8080/api/payments/${bankQr.paymentId}/status`,
                    {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    }
                  );
                  if (response.data.statusName && response.data.statusName.toLowerCase() === 'completed') {
                    setConfirmResult('success');
                  } else {
                    setConfirmResult('failed');
                  }
                } catch (err) {
                  setConfirmResult('failed');
                } finally {
                  setConfirmLoading(false);
                }
              }}
              disabled={confirmLoading}
            >
              {confirmLoading ? 'Đang xác nhận...' : 'Xác nhận đã thanh toán'}
            </button>
          ) : (
            <button
              className="payment-btn fintech payment-pay"
              onClick={handlePayment}
              disabled={!selectedMethod}
            >
              Thanh toán ngay
            </button>
          )}
          <button
            className="payment-btn fintech cancel-btn"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
        </div>
        {/* Popup thông báo */}
        {confirmResult === 'success' && (
          <div className="payment-modal-overlay fintech">
            <div className="payment-modal fintech success">
              <div className="modal-icon fintech">✔</div>
              <div className="modal-title fintech">Thanh toán thành công!</div>
              <button className="modal-close-btn fintech" onClick={() => navigate('/')}>Đóng</button>
            </div>
          </div>
        )}
        {confirmResult === 'failed' && (
          <div className="payment-modal-overlay fintech">
            <div className="payment-modal fintech failed">
              <div className="modal-icon fintech">✖</div>
              <div className="modal-title fintech">Chưa nhận được thanh toán, vui lòng thử lại sau.</div>
              <button className="modal-close-btn fintech" onClick={() => window.location.reload()}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment; 