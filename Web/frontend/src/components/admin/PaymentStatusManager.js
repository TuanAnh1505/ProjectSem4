import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentStatusManager.css';

const PAGE_SIZE = 5;

const statusBadge = (statusName) => {
  if (statusName.toLowerCase() === 'completed')
    return <span className="payment-badge completed">Completed</span>;
  if (statusName.toLowerCase() === 'pending')
    return <span className="payment-badge pending">Pending</span>;
  if (statusName.toLowerCase() === 'processing')
    return <span className="payment-badge processing">Processing</span>;
  if (statusName.toLowerCase() === 'failed')
    return <span className="payment-badge failed">Failed</span>;
  if (statusName.toLowerCase() === 'refunded')
    return <span className="payment-badge refunded">Refunded</span>;
  if (statusName.toLowerCase() === 'cancelled')
    return <span className="payment-badge cancelled">Cancelled</span>;
  return <span className="payment-badge">{statusName}</span>;
};

const PaymentStatusManager = () => {
  const [payments, setPayments] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [editStatus, setEditStatus] = useState({});

  useEffect(() => {
    fetchPayments();
    fetchStatuses();
  }, []);

  // Tự động cập nhật danh sách payment mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPayments();
    }, 5000);
    return () => clearInterval(interval);
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

  const handleStatusChange = (paymentId, newStatusId) => {
    setEditStatus(prev => ({ ...prev, [paymentId]: newStatusId }));
  };

  const handleSave = async (paymentId) => {
    setUpdating((prev) => ({ ...prev, [paymentId]: true }));
    try {
      const token = localStorage.getItem('token');
      const newStatusId = editStatus[paymentId];
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

  // Thêm các trạng thái bổ sung nếu chưa có trong danh sách từ API
  const extraStatuses = [
    { paymentStatusId: 'active', statusName: 'Active' },
    { paymentStatusId: 'inactive', statusName: 'Inactive' },
    { paymentStatusId: 'waiting', statusName: 'Waiting' },
    { paymentStatusId: 'processing', statusName: 'Processing' },
  ];
  const allStatuses = [
    ...extraStatuses.filter(
      es => !statuses.some(s => s.statusName?.toLowerCase() === es.statusName.toLowerCase())
    ),
    ...statuses
  ];

  // Filter + search + pagination
  const filteredPayments = payments.filter(p => {
    const matchSearch =
      search === '' ||
      p.paymentId.toString().includes(search) ||
      p.userId.toString().includes(search) ||
      p.bookingId.toString().includes(search);
    const matchStatus =
      !filterStatus ||
      statuses.find(s => s.paymentStatusId === p.statusId)?.statusName === filterStatus;
    return matchSearch && matchStatus;
  });

  // Sắp xếp payments theo ngày mới nhất lên đầu
  const sortedPayments = filteredPayments.slice().sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
  const total = sortedPayments.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pagedPayments = sortedPayments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="payment-table-container">
      <div className="payment-table-header">
        <div className="payment-table-title">Quản lý thanh toán</div>
        <div className="payment-table-filter">
          <input
            className="payment-table-search"
            placeholder="Tìm kiếm thanh toán..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="payment-table-select"
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          >
            <option value="">Tất cả trạng thái</option>
            {statuses.map(s => (
              <option key={s.paymentStatusId} value={s.statusName}>{s.statusName}</option>
            ))}
          </select>
        </div>
      </div>
      <table className="payment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>BOOKING</th>
            <th>SỐ TIỀN</th>
            <th>TRẠNG THÁI</th>
            <th>NGÀY THANH TOÁN</th>
            <th>HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          {pagedPayments.map((p) => {
            return (
              <tr key={p.paymentId}>
                <td>{p.paymentId}</td>
                <td>{p.userId}</td>
                <td>{p.bookingId}</td>
                <td><b>{p.amount?.toLocaleString()} VND</b></td>
                <td>
                  <select
                    className={`payment-table-select select-${(allStatuses.find(s => s.paymentStatusId == (editStatus[p.paymentId] ?? p.statusId))?.statusName || '').toLowerCase()}`}
                    value={editStatus[p.paymentId] ?? p.statusId}
                    onChange={e => handleStatusChange(p.paymentId, e.target.value)}
                    disabled={updating[p.paymentId]}
                  >
                    {allStatuses.map(s => (
                      <option key={s.paymentStatusId} value={s.paymentStatusId}>{s.statusName}</option>
                    ))}
                  </select>
                </td>
                <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : ''}</td>
                <td>
                  <button
                    className="payment-table-btn"
                    onClick={() => handleSave(p.paymentId)}
                    disabled={updating[p.paymentId] || (editStatus[p.paymentId] ?? p.statusId) === p.statusId}
                  >
                    Lưu
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="payment-table-info">
        Hiển thị {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} đến {Math.min(page * PAGE_SIZE, total)} của {total} bản ghi
      </div>
      <div className="payment-table-pagination">
        <button
          className="payment-table-pagination-btn"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          &lt; Trước
        </button>
        <span className="payment-table-pagination-btn active">{page}</span>
        <button
          className="payment-table-pagination-btn"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          Tiếp &gt;
        </button>
      </div>
    </div>
  );
};

export default PaymentStatusManager; 