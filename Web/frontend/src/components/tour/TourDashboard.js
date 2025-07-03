import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaSearch, FaClock, FaInfoCircle } from 'react-icons/fa';
import '../styles/tour/TourDashboard.css';

const getMonths = () => [
  { value: '', label: 'Chọn tháng' },
  ...Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Tháng ${i + 1}` }))
];

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return [
    { value: '', label: 'Chọn năm' },
    ...Array.from({ length: 5 }, (_, i) => ({ value: currentYear + i, label: `${currentYear + i}` }))
  ];
};

export default function TourDashboard() {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterParams, setFilterParams] = useState({
    destinationId: '',
    month: '',
    year: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/destinations');
        setDestinations(res.data);
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
      }
    };
    fetchDestinations();
  }, []);
  
  const fetchTours = async () => {
    setLoading(true);
    try {
      const params = Object.entries(filterParams).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {});
      
      const res = await axios.get('http://localhost:8080/api/tours', { params });
      setTours(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch tours:', err);
      setError('Không thể tải danh sách tour. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTours();
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return price.toLocaleString('vi-VN');
  };

  return (
    <div className="tour-dashboard-container">
      <div className="filter-wrapper">
        <form className="filter-form" onSubmit={handleFilterSubmit}>
          <div className="filter-item">
            <label htmlFor="destinationId"><FaMapMarkerAlt /> Điểm đến</label>
            <select id="destinationId" name="destinationId" value={filterParams.destinationId} onChange={handleFilterChange}>
              <option value="">Chọn điểm đến</option>
              {destinations.map(dest => (
                <option key={dest.id} value={dest.id}>{dest.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="month"><FaCalendarAlt /> Ngày đi</label>
            <div className="date-filter-group">
              <select id="month" name="month" value={filterParams.month} onChange={handleFilterChange}>
                {getMonths().map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              <select name="year" value={filterParams.year} onChange={handleFilterChange}>
                {getYears().map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
              </select>
            </div>
          </div>

          <div className="filter-item">
            <label htmlFor="minPrice"><FaDollarSign /> Ngân sách</label>
            <div className="price-filter-group">
              <input
                id="minPrice"
                type="number"
                name="minPrice"
                placeholder="Từ"
                value={filterParams.minPrice}
                onChange={handleFilterChange}
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Đến"
                value={filterParams.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <button type="submit" className="search-button">
            <FaSearch /> Tìm
          </button>
        </form>
      </div>

      <div className="tour-list-container">
        {loading ? (
          <div className="loading-state">Đang tải danh sách tour...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : tours.length > 0 ? (
          <div className="tour-grid">
            {tours.map(tour => (
              <div key={tour.tourId} className="tour-card">
                 <Link to={`/tour-dashboard/detail/${encodeURIComponent(tour.name)}`} className="card-image-link">
                    <div className="card-image">
                      <img 
                        src={tour.imageUrls && tour.imageUrls.length > 0 ? `http://localhost:8080${tour.imageUrls[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={tour.name} 
                      />
                    </div>
                 </Link>
                 <div className="card-content">
                    
                    <Link to={`/tour-dashboard/detail/${encodeURIComponent(tour.name)}`} className="card-title-link">
                        <h3 className="card-title">{tour.name}</h3>
                    </Link>
                    
                    <p className="card-description">
                        <FaInfoCircle /> {tour.description}
                    </p>
                    <div className="card-info-top">
                        <span className="info-item">
                          <FaClock /> {tour.duration} ngày {tour.duration > 1 ? `${tour.duration - 1} đêm` : ''}
                        </span>
                        {tour.schedules && tour.schedules.length > 0 && 
                            <span className="info-item"><FaCalendarAlt /> {new Date(tour.schedules[0].startDate).toLocaleDateString('vi-VN')}</span>
                        }
                    </div>
                    <div className="card-footer">
                        <div className="price-section">
                            <span className="price-label">Giá từ</span>
                            <span className="price-value">{formatPrice(tour.price)}<span className="price-unit"> đ</span></span>
                        </div>
                        <Link to={`/tour-dashboard/detail/${encodeURIComponent(tour.name)}`} className="details-button">
                            Xem chi tiết
                        </Link>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tours-found">
            <h3>Không tìm thấy tour phù hợp</h3>
            <p>Vui lòng thử thay đổi điều kiện lọc của bạn và tìm kiếm lại.</p>
          </div>
        )}
      </div>
    </div>
  );
}
