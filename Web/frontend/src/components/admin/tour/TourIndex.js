import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/tour/TourIndex.css';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function TourIndex() {
  const [tours, setTours] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleDelete = async (tourId) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:8080/api/tours/${tourId}`, config);
      setTours(tours.filter(tour => tour.tourId !== tourId));
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Failed to delete tour');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="tour-index-container">
      <h1>🧭 Admin - Manage Tours</h1>

      {error && (
        <div className="error-box">
          <p>{error}</p>
          <button onClick={fetchData}>🔄 Retry</button>
        </div>
      )}

      <div className="action-bar">
        <Link to="/admin/tour/add" className="add-button"> Add New Tour</Link>
      </div>

      {tours.length > 0 ? (
        <table className="tour-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map(tour => (
              <tr key={tour.tourId}>
                <td>{tour.tourId}</td>
                <td>
                  {tour.imageUrl ? (
                    <img
                      src={`http://localhost:8080${tour.imageUrl}`}
                      alt={tour.name}
                      className="tour-thumbnail"
                    />
                  ) : (
                    <span className="no-image">No image</span>
                  )}
                </td>
                <td>{tour.name}</td>
                <td>${tour.price}</td>
                <td>{getStatusName(tour.statusId)}</td>
                <td>
                  <Link to={`/admin/tour/detail/${tour.tourId}`} className="action-link">🔍</Link>
                  <Link to={`/admin/tour/edit/${tour.tourId}`} className="action-link">✏️</Link>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(tour.tourId)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !error && <p className="no-tours">No tours found.</p>}
    </div>
  );
}
