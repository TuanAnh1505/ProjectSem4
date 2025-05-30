import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentStatusManager = () => {
  const [payments, setPayments] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchPayments();
    fetchStatuses();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      setError('Không thể tải danh sách thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/payments/statuses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStatuses(res.data);
    } catch (err) {
      setStatuses([]);
    }
  };

  const handleStatusChange = async (paymentId, newStatusId) => {
    setUpdating((prev) => ({ ...prev, [paymentId]: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/payments/${paymentId}/status?statusId=${newStatusId}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchPayments();
    } catch (err) {
      alert('Cập nhật trạng thái thất bại!');
    } finally {
      setUpdating((prev) => ({ ...prev, [paymentId]: false }));
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý trạng thái thanh toán</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th>ID</th>
            <th>User</th>
            <th>Booking</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Ngày thanh toán</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.paymentId}>
              <td>{p.paymentId}</td>
              <td>{p.userId}</td>
              <td>{p.bookingId}</td>
              <td>{p.amount?.toLocaleString()} VND</td>
              <td>
                <select
                  value={p.statusId}
                  onChange={e => handleStatusChange(p.paymentId, e.target.value)}
                  disabled={updating[p.paymentId]}
                >
                  {statuses.map(s => (
                    <option key={s.paymentStatusId} value={s.paymentStatusId}>{s.statusName}</option>
                  ))}
                </select>
              </td>
              <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : ''}</td>
              <td>
                <button
                  onClick={() => handleStatusChange(p.paymentId, p.statusId)}
                  disabled={updating[p.paymentId]}
                >
                  Lưu
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentStatusManager; 