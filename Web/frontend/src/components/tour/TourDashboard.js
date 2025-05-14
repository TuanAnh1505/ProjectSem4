import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/tour/TourDashboard.css';

export default function TourDashboard() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const res = await axios.get('http://localhost:8080/api/tours', config);
        setTours(res.data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch tours:', err);
        setError('Failed to load tours. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) return <div className="loading">Loading tours...</div>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="tour-dashboard">
      <h2>🌍 Available Tours</h2>
      <div className="tour-list">
        {tours.map(tour => (
          <div className="tour-card" key={tour.tourId}>
            {tour.imageUrl ? (
              <img
                src={`http://localhost:8080${tour.imageUrl}`}
                alt={tour.name}
                className="tour-image"
              />
            ) : (
              <div className="tour-image-placeholder">No Image</div>
            )}
            <div className="tour-info">
              <h3>{tour.name}</h3>
              <p><strong>Price:</strong> ${tour.price}</p>
              <p><strong>Duration:</strong> {tour.duration} days</p>
              <Link to={`/tour-dashboard/detail/${tour.tourId}`} className="btn-tour-dashboard">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
