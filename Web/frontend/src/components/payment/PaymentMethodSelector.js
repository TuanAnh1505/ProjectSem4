import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCreditCard, FaPaypal, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import './PaymentMethodSelector.css';

const PaymentMethodSelector = ({ onSelectMethod, selectedMethod }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn chưa đăng nhập!');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          'http://localhost:8080/api/payments/methods',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setMethods(response.data);
      } catch (err) {
        setError('Không thể tải danh sách phương thức thanh toán');
        console.error('Error fetching payment methods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const getMethodIcon = (methodName) => {
    switch (methodName.toLowerCase()) {
      case 'credit_card':
        return <FaCreditCard />;
      case 'paypal':
        return <FaPaypal />;
      case 'bank_transfer':
        return <FaUniversity />;
      case 'cash':
        return <FaMoneyBillWave />;
      default:
        return <FaCreditCard />;
    }
  };

  if (loading) {
    return <div className="payment-method-loading">Đang tải phương thức thanh toán...</div>;
  }

  if (error) {
    return <div className="payment-method-error">{error}</div>;
  }

  return (
    <div className="payment-method-selector">
      <h3 className="payment-method-title">Chọn phương thức thanh toán</h3>
      <div className="payment-method-grid">
        {methods.map((method) => {
          const isBankTransfer = method.methodId === 2;
          return (
            <div
              key={method.methodId}
              className={`payment-method-card ${selectedMethod === method.methodId ? 'selected' : ''} ${!isBankTransfer ? 'disabled' : ''}`}
              onClick={() => isBankTransfer && onSelectMethod(method.methodId)}
              style={{ cursor: isBankTransfer ? 'pointer' : 'not-allowed', opacity: isBankTransfer ? 1 : 0.5 }}
            >
              <div className="payment-method-icon">
                {getMethodIcon(method.methodName)}
              </div>
              <div className="payment-method-info">
                <h4>{method.methodName}</h4>
                {isBankTransfer ? (
                  method.description && <p>{method.description}</p>
                ) : (
                  <p style={{ color: 'red', fontWeight: 500 }}>Bảo trì</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector; 