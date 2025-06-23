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
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchTourData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch main tour details
        const tourResponse = await axios.get(`http://localhost:8080/api/tours/${tourId}`, config);
        setTour(tourResponse.data);

        // Fetch tour destinations with images
        const destinationsResponse = await axios.get(`http://localhost:8080/api/tours/${tourId}/destinations`, config);
        setDestinations(destinationsResponse.data);

      } catch (err) {
        setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
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
        {tour.imageUrls && tour.imageUrls.length > 0 ? (
          <img 
            src={`http://localhost:8080${tour.imageUrls[0]}`} 
            alt={tour.name} 
            className="tour-detail-hero-image"
          />
        ) : (
          <div className="tour-detail-hero-placeholder">
            <span>No Image Available</span>
          </div>
        )}
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

          {destinations && destinations.length > 0 && (
            <div className="tour-detail-section">
              <h2 className="tour-detail-section-title">
                <FaMapMarkerAlt /> Địa điểm nổi bật
              </h2>
              <div className="destinationsGrid">
                {destinations.map((destination) => (
                  <div key={destination.id} className="destinationCard">
                     {destination.imageUrls && destination.imageUrls.length > 0 ? (
                      <img 
                        src={`http://localhost:8080${destination.imageUrls[0]}`} 
                        alt={destination.name} 
                        className="destinationImage"
                      />
                    ) : (
                      <div className="destinationImagePlaceholder">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="destinationInfo">
                      <h3 className="destinationName">{destination.name}</h3>
                      <p className="destinationDescription">{destination.description}</p>
                    </div>
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
