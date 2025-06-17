import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaTrash, FaExclamationTriangle, FaEye, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import '../../styles/tour/TourIndex.css';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function TourIndex() {
  const [tours, setTours] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteAlert, setDeleteAlert] = useState({ show: false, tourId: null, tourName: '' });

  const fetchData = useCallback(async () => {
    const fetchWithRetry = async (url, config, attempt = 1) => {
      try {
        return await axios.get(url, config);
      } catch (error) {
        if (error.response?.status === 500 && attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return fetchWithRetry(url, config, attempt + 1);
        }
        throw error;
      }
    };

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [toursRes, statusRes] = await Promise.all([
        fetchWithRetry('http://localhost:8080/api/tours', config),
        fetchWithRetry('http://localhost:8080/api/tour-status', config)
      ]);

      setTours(toursRes.data);
      setStatuses(statusRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusName = (statusId) => {
    const status = statuses.find(s => s.tourStatusId === statusId);
    return status ? status.statusName : 'N/A';
  };

  const getStatusLabel = (statusId) => {
    const status = statuses.find(s => s.tourStatusId === statusId);
    if (!status) return <span className="status-label status-unknown">N/A</span>;
    if (status.statusName === 'Published') {
      return (
        <span className="status-label status-published">
          <span className="status-dot status-dot-published"></span> Published
        </span>
      );
    }
    if (status.statusName === 'Cancelled') {
      return (
        <span className="status-label status-cancelled-tour">
          <span className="status-dot status-dot-cancelled"></span> Cancelled
        </span>
      );
    }
    return <span className="status-label status-unknown">{status.statusName}</span>;
  };

  const showDeleteAlert = (tourId, tourName) => {
    setDeleteAlert({ show: true, tourId, tourName });
  };

  const hideDeleteAlert = () => {
    setDeleteAlert({ show: false, tourId: null, tourName: '' });
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:8080/api/tours/${deleteAlert.tourId}`, config);
      setTours(tours.filter(tour => tour.tourId !== deleteAlert.tourId));
      hideDeleteAlert();
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Failed to delete tour');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="tour-index-container">
      {/* <h1>🧭 Admin - Manage Tours</h1> */}

      {error && (
        <div className="error-box">
          <p>{error}</p>
          <button onClick={fetchData}>🔄 Retry</button>
        </div>
      )}

      <div className="tour-header-bar">
        <h2 className="tour-title">Quản lý tour</h2>
        <Link to="/admin/tour/add" className="add-button"> <FaPlus /> Tạo tour</Link>
      </div>

      {tours.length > 0 ? (
        <table className="tour-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>IMAGE</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tours.map(tour => (
              <tr key={tour.tourId}>
                <td>{tour.tourId}</td>
                <td>
                  {tour.imageUrls && tour.imageUrls.length > 0 ? (
                    <img
                      src={`http://localhost:8080${tour.imageUrls[0]}`}
                      alt={tour.name}
                      className="tour-thumbnail"
                    />
                  ) : (
                    <span className="no-image">No image</span>
                  )}
                </td>
                <td>{tour.name}</td>
                <td>{tour.price ? tour.price.toLocaleString() + ' VND' : 'N/A'}</td>
                <td>{getStatusLabel(tour.statusId)}</td>
                <td>
                  <div className="tour-actions" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <Link to={`/admin/tour/detail/${tour.tourId}`} className="action-link" title="Xem chi tiết" style={{ color: '#4a90e2', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaEye />
                    </Link>
                    <Link to={`/admin/tour/edit/${tour.tourId}`} className="action-link" title="Chỉnh sửa" style={{ color: '#ffc107', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaEdit />
                    </Link>
                    <Link to={`/admin/tour/schedules/${tour.tourId}`} className="action-link" title="Xem lịch trình" style={{ color: '#2ecc71', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaCalendarAlt />
                    </Link>
                    <button className="delete-button" onClick={() => showDeleteAlert(tour.tourId, tour.name)} title="Xóa" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !error && <p className="no-tours">No tours found.</p>}

      {deleteAlert.show && (
        <div className="tour-alert-overlay">
          <div className="tour-alert-dialog">
            <div className="tour-alert-icon-wrapper">
              <FaExclamationTriangle className="tour-alert-icon" />
            </div>
            <h2 className="tour-alert-title">Xác nhận xóa</h2>
            <p className="tour-alert-message">
              Bạn có chắc chắn muốn xóa tour "{deleteAlert.tourName}"? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="tour-alert-buttons">
              <button 
                className="tour-alert-btn tour-alert-btn-cancel"
                onClick={hideDeleteAlert}
              >
                Hủy
              </button>
              <button 
                className="tour-alert-btn tour-alert-btn-delete"
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
