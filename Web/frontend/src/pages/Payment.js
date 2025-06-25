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
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="payment-title">Thanh toán</h1>
        
        {/* Hiển thị thông tin giá tiền */}
        {/* <div style={{
          background: '#f8f9fa',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1976d2' }}>Thông tin thanh toán</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div><strong>Mã booking:</strong> {bookingId}</div>
              <div><strong>Số tiền cần thanh toán:</strong></div>
            </div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#d32f2f',
              textAlign: 'right'
            }}>
              {(finalPriceFromState !== undefined ? finalPriceFromState : 
                amountFromState || 
                booking?.booking?.totalPrice || 
                booking?.totalAmount || 0).toLocaleString()} VND
            </div>
          </div>
          {amountFromState && (
            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginTop: '8px',
              fontStyle: 'italic'
            }}>
              * Giá tiền được tính từ thông tin đặt tour
              {finalPriceFromState !== undefined && finalPriceFromState !== amountFromState && 
                ` (Final price: ${finalPriceFromState.toLocaleString()} VND)`
              }
            </div>
          )}
        </div> */}

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
              </div>
            )}
          </div>
        </div>

        <div className="payment-actions">
          {bankQr ? (
            <button
              className="payment-button"
              style={{ background: '#28a745' }}
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
              className="payment-button"
              onClick={handlePayment}
              disabled={!selectedMethod}
            >
              Thanh toán ngay
            </button>
          )}
          <button
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
        </div>

        {confirmResult === 'success' && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: '32px 48px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              textAlign: 'center',
              minWidth: 320
            }}>
              <div style={{ fontSize: 48, color: '#28a745', marginBottom: 16 }}>✔</div>
              <div style={{ fontSize: 22, color: '#28a745', fontWeight: 600, marginBottom: 12 }}>Thanh toán thành công !</div>
              <button
                style={{
                  marginTop: 16,
                  padding: '10px 28px',
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  const publicId = localStorage.getItem('publicId');
                  if (publicId) {
                    navigate(`/account/${publicId}`);
                  } else {
                    navigate('/login');
                  }
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
        {confirmResult === 'failed' && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: '#fff0f0',
              borderRadius: 12,
              padding: '32px 48px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              textAlign: 'center',
              minWidth: 320,
              border: '1px solid #f5c2c7'
            }}>
              <div style={{ fontSize: 48, color: '#dc3545', marginBottom: 16 }}>✖</div>
              <div style={{ fontSize: 20, color: '#dc3545', fontWeight: 600, marginBottom: 12 }}>
                Chưa nhận được thanh toán, vui lòng thử lại sau.
              </div>
              <button
                style={{
                  marginTop: 16,
                  padding: '10px 28px',
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onClick={() => window.location.reload()}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
        {showPaidModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '32px 48px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', textAlign: 'center', minWidth: 320, border: '1px solid #28a745' }}>
              <div style={{ fontSize: 48, color: '#28a745', marginBottom: 16 }}>✔</div>
              <div style={{ fontSize: 22, color: '#28a745', fontWeight: 600, marginBottom: 12 }}>Tour này đã được thanh toán!</div>
              <button style={{ marginTop: 16, padding: '10px 28px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 500, cursor: 'pointer' }} onClick={() => { setShowPaidModal(false); navigate('/'); }}>Đóng</button>
            </div>
          </div>
        )}
        {showErrorModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#fff0f0', borderRadius: 12, padding: '32px 48px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', textAlign: 'center', minWidth: 320, border: '1px solid #f5c2c7' }}>
              <div style={{ fontSize: 48, color: '#dc3545', marginBottom: 16 }}>✖</div>
              <div style={{ fontSize: 20, color: '#dc3545', fontWeight: 600, marginBottom: 12 }}>{error}</div>
              <button style={{ marginTop: 16, padding: '10px 28px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 500, cursor: 'pointer' }} onClick={() => setShowErrorModal(false)}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment; 