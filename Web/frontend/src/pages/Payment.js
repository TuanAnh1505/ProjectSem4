import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import './Payment.css';

const Payment = () => {
  const { paymentCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bankQr, setBankQr] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null); 
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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
    const fetchPayment = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8080/api/payments/code/${paymentCode}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setPayment(response.data);
        console.log('Fetched payment:', response.data);
      } catch (err) {
        setError('Không thể tải thông tin thanh toán');
        console.error('Error fetching payment:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [paymentCode, navigate]);

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
      const bookingId = payment?.bookingId;
      const userId = payment?.userId || localStorage.getItem('userId');
      console.log('token:', token, 'bookingId:', bookingId, 'userId:', userId);
      if (!token || !userId || !bookingId) {
        alert('Thiếu thông tin đăng nhập hoặc booking, vui lòng thử lại!');
        return;
      }
      const userPhone = payment?.booking?.user?.phone || '0123456789';
      const amount = finalPriceFromState !== undefined ? finalPriceFromState : 
                    amountFromState || 
                    payment?.booking?.totalPrice || 
                    payment?.totalAmount;

      console.log('Payment amount:', {
        finalPriceFromState,
        amountFromState,
        bookingTotalPrice: payment?.booking?.totalPrice,
        bookingTotalAmount: payment?.totalAmount,
        finalAmount: amount
      });

      if (selectedMethod === 2) {
        setQrLoading(true);
        setBankQr(null);
        try {
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
          console.log('bankQr:', response.data);
        } catch (err) {
          const errMsg = err.response?.data?.error || 'Không thể tạo mã QR. Vui lòng thử lại sau.';
          setError(errMsg);
          setShowErrorModal(true);
        } finally {
          setQrLoading(false);
        }
        return;
      }

      if (selectedMethod === 5) {
        const response = await axios.post(
          'http://localhost:8080/api/payments/momo',
          {
            bookingId: parseInt(paymentCode),
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

      if (bankQr) {
        setConfirmResult('success');
        setSelectedMethod(null);
        return;
      }
      const response = await axios.post(
        'http://localhost:8080/api/payments',
        {
          bookingId: parseInt(paymentCode),
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
              disabled={!selectedMethod || !payment}
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