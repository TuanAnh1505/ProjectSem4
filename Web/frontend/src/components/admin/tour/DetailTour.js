import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/tour/DetailTour.css';

export default function DetailTour() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [tourRes, statusRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/tours/${tourId}`, config),
          axios.get(`http://localhost:8080/api/tour-status`, config)
        ]);

        if (!tourRes.data) throw new Error('Tour not found');
        setTour(tourRes.data);
        setStatuses(statusRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tour');
      } finally {
        setLoading(false);
      }
    };

    if (tourId) fetchData();
    else {
      setError('Invalid tour ID');
      setLoading(false);
    }
  }, [tourId]);

  const getStatusName = (statusId) => {
    const status = statuses.find(s => s.tourStatusId === statusId);
    return status ? status.statusName : 'N/A';
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (error) {
    return (
      <div className="error-box">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/admin/tour')} className="btn">← Back</button>
      </div>
    );
  }

  return (
    <div className="form-detail-container">
      <h2>Tour Details</h2>

      <div className="form-detail">
        {tour.imageUrl && (
          <div className="form-row image-row">
            <label>Image:</label>
            <span className="image-container">
              <img 
                src={`http://localhost:8080/uploads/tours/${tour.imageUrl.split('/').pop()}`}
                alt={tour.name} 
                className="tour-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </span>
          </div>
        )}

        <div className="form-row">
          <label>Name:</label>
          <span>{tour.name}</span>
        </div>

        <div className="form-row">
          <label>Price:</label>
          <span>${tour.price}</span>
        </div>

        <div className="form-row">
          <label>Duration:</label>
          <span>{tour.duration} days</span>
        </div>

        <div className="form-row">
          <label>Max Participants:</label>
          <span>{tour.maxParticipants}</span>
        </div>

        <div className="form-row">
          <label>Status:</label>
          <span>{getStatusName(tour.statusId)}</span>
        </div>

        <div className="form-row">
          <label>Description:</label>
          <span>{tour.description || 'No description available'}</span>
        </div>

        <div className="form-row">
          <label>Destinations:</label>
          <span>
            {tour.destinations?.length > 0 ? (
              <ul>
                {tour.destinations.map(dest => (
                  <li key={dest.destinationId}>{dest.name}</li>
                ))}
              </ul>
            ) : 'No destinations'}
          </span>
        </div>

        <div className="form-row">
          <label>Events:</label>
          <span>
            {tour.events?.length > 0 ? (
              <ul>
                {tour.events.map(ev => (
                  <li key={ev.eventId}>
                    {ev.name} ({new Date(ev.startDate).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : 'No events'}
          </span>
        </div>

        <div className="form-row">
          <button onClick={() => navigate('/admin/tour')} className="btn-tour-detail-admin">← Back to Tour List</button>
        </div>
      </div>
    </div>
  );
}
