import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaEdit, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaClock, FaInfoCircle } from 'react-icons/fa';
import '../../styles/tour/DetailTour.css';

const DetailTour = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:8080/api/tours/${tourId}`, config);
        setTour(response.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  if (loading) {
    return (
      <div className="tour-detail-loading">
        <FaInfoCircle /> Đang tải thông tin tour...
      </div>
    );
  }

  if (error) {
    return <div className="tour-detail-error">{error}</div>;
  }

  if (!tour) {
    return <div className="tour-detail-error">Không tìm thấy thông tin tour</div>;
  }

  return (
    <div className="tour-detail-container">
      <div className="tour-detail-hero">
        <img 
          src={tour.imageUrl} 
          alt={tour.name} 
          className="tour-detail-hero-image"
        />
        <div className="tour-detail-hero-content">
          <h1 className="tour-detail-title" style={{color: 'white'}}>{tour.name}</h1>
          {/* <p className="tour-detail-subtitle" style={{color: 'white'}}>{tour.description}</p> */}
        </div>
      </div>

      <div className="tour-detail-content">
        <div className="tour-detail-card">
          <div className="tour-detail-info-grid">
            <div className="tour-detail-info-item">
              <FaMapMarkerAlt className="tour-detail-info-icon" />
              <span className="tour-detail-label">Điểm đến</span>
              <div className="tour-detail-value">{tour.destinations?.length || 0}</div>
            </div>
            <div className="tour-detail-info-item">
              <FaCalendarAlt className="tour-detail-info-icon" />
              <span className="tour-detail-label">Sự kiện</span>
              <div className="tour-detail-value">{tour.events?.length || 0}</div>
            </div>
            <div className="tour-detail-info-item">
              <FaUsers className="tour-detail-info-icon" />
              <span className="tour-detail-label">Số người</span>
              <div className="tour-detail-value">{tour.maxParticipants}</div>
            </div>
            <div className="tour-detail-info-item">
              <FaMoneyBillWave className="tour-detail-info-icon" />
              <span className="tour-detail-label">Giá</span>
              <div className="tour-detail-value">{tour.price.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>

          <div className="tour-detail-section">
            <h2 className="tour-detail-section-title">
              <FaInfoCircle /> Thông tin chi tiết
            </h2>
            <div className="tour-detail-description">
              {tour.description}
            </div>
          </div>

          {tour.destinations && tour.destinations.length > 0 && (
            <div className="tour-detail-section">
              <h2 className="tour-detail-section-title">
                <FaMapMarkerAlt /> Điểm đến
              </h2>
              <div className="tour-detail-list">
                {tour.destinations.map((destination) => (
                  <div key={destination.id} className="tour-detail-list-item">
                    <h3 className="tour-detail-list-item-title">{destination.name}</h3>
                    <p className="tour-detail-list-item-date">{destination.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tour.events && tour.events.length > 0 && (
            <div className="tour-detail-section">
              <h2 className="tour-detail-section-title">
                <FaCalendarAlt /> Sự kiện
              </h2>
              <div className="tour-detail-list">
                {tour.events.map((event) => (
                  <div key={event.id} className="tour-detail-list-item">
                    <h3 className="tour-detail-list-item-title">{event.name}</h3>
                    <p className="tour-detail-list-item-date">
                      {new Date(event.startDate).toLocaleDateString('vi-VN')} - 
                      {new Date(event.endDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="tour-detail-actions">
            <button 
              className="tour-detail-btn tour-detail-btn-back"
              onClick={() => navigate('/admin/tours')}
            >
              <FaArrowLeft /> Quay lại
            </button>
            <button 
              className="tour-detail-btn tour-detail-btn-edit"
              onClick={() => navigate(`/admin/tours/update/${tourId}`)}
            >
              <FaEdit /> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTour;
