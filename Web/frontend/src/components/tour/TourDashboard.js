import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import '../styles/tour/TourDashboard.css';

export default function TourDashboard() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceRange: '',
    duration: '',
    destination: ''
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/tours');
        setTours(res.data);
        setFilteredTours(res.data);
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

  useEffect(() => {
    let result = tours;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(tour => 
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(tour => tour.price >= min && tour.price <= max);
    }

    // Filter by duration
    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number);
      result = result.filter(tour => tour.duration >= min && tour.duration <= max);
    }

    // Filter by destination
    if (filters.destination) {
      result = result.filter(tour => 
        tour.destinations?.some(dest => 
          dest.name.toLowerCase().includes(filters.destination.toLowerCase())
        )
      );
    }

    setFilteredTours(result);
  }, [searchTerm, filters, tours]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return (
    <div className="tour-dashboard" style={{ background: '#e3f2fd', minHeight: '100vh', paddingBottom: 32 }}>
      <div className="loading">Loading tours...</div>
    </div>
  );

  if (error) return (
    <div className="tour-dashboard" style={{ background: '#e3f2fd', minHeight: '100vh', paddingBottom: 32 }}>
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="tour-dashboard" style={{ background: '#f6f7fb', minHeight: '100vh', padding: '0 0 48px 0' }}>
      <div
        style={{
          position: 'relative',
          height: '420px',
          overflow: 'hidden',
          marginTop: '32px',
          marginBottom: '32px',
          borderRadius: '24px',
          boxShadow: '0 4px 24px #e3e8f0'
        }}
      >
        <img
          src="https://readdy.ai/api/search-image?query=Beautiful%20panoramic%20view%20of%20Vietnam%20landscape%20with%20emerald%20rice%20terraces%2C%20limestone%20mountains%2C%20and%20traditional%20boats%20on%20Ha%20Long%20Bay%20with%20dramatic%20clouds%20and%20sunlight%2C%20professional%20photography%2C%20high%20resolution%2C%20vibrant%20colors%2C%20serene%20atmosphere&width=1440&height=500&seq=1&orientation=landscape"
          alt="Vietnam Tours"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(25,118,210,0.18)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            zIndex: 2
          }}
        >
          <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16, color: '#fff', textShadow: '0 2px 12px #1976d2' }}>
            Discover Amazing Tours
          </h1>
          <p style={{ fontSize: 24, fontWeight: 400, textAlign: 'center', maxWidth: 700, color: '#fff', textShadow: '0 2px 8px #1976d2' }}>
            Explore our curated collection of Vietnam's best tours
          </p>
        </div>
      </div>

      <div
        className="tour-dashboard-search"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '32px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '40px',
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 4px 24px #e3e8f0',
          padding: '24px 0',
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div
          className="search-box"
          style={{
            flex: 2,
            minWidth: 320,
            maxWidth: 600,
            background: '#f6f7fb',
            borderRadius: '18px',
            boxShadow: '0 2px 12px #e3e8f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            height: 56
          }}
        >
          <FaSearch className="search-icon" style={{ color: '#1976d2', fontSize: 26, marginRight: 16 }} />
          <input
            type="text"
            placeholder="Search tours by name or description..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: 20,
              flex: 1,
              background: 'transparent',
              color: '#333'
            }}
          />
        </div>
        <div
          className="filter-price"
          style={{
            flex: 1,
            minWidth: 180,
            maxWidth: 220,
            background: '#f6f7fb',
            borderRadius: '18px',
            boxShadow: '0 2px 12px #e3e8f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            height: 56
          }}
        >
          <span style={{ color: '#1976d2', fontSize: 22, marginRight: 10, fontWeight: 700 }}>₫</span>
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleFilterChange}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: 18,
              flex: 1,
              background: 'transparent',
              color: '#1976d2',
              fontWeight: 600,
              padding: '8px 0',
              cursor: 'pointer'
            }}
          >
            <option value="">Tất cả giá tiền</option>
            <option value="0-1000000">Dưới 1 triệu</option>
            <option value="1000000-3000000">1 - 3 triệu</option>
            <option value="3000000-5000000">3 - 5 triệu</option>
            <option value="5000000-10000000">5 - 10 triệu</option>
            <option value="10000000-999999999">Trên 10 triệu</option>
          </select>
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          margin: '32px 0',
          color: '#1976d2',
          fontWeight: 600,
          boxShadow: '0 2px 12px #e3e8f0'
        }}>
          <h3 style={{ color: '#1976d2', marginBottom: '10px', fontSize: 22 }}>No tours found</h3>
          <p style={{ color: '#1976d2' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '32px',
          padding: '0 24px',
          maxWidth: 1200,
          margin: '0 auto'
        }}>
          {filteredTours.slice(0, 6).map(tour => (
            <div
              key={tour.tourId}
              className="tour-card-hover"
              style={{
                backgroundColor: '#fff',
                borderRadius: '22px',
                boxShadow: '0 4px 24px #e3e8f0',
                overflow: 'hidden',
                transition: 'transform 0.22s cubic-bezier(.4,2,.3,1), box-shadow 0.22s, border 0.22s',
                cursor: 'pointer',
                border: '1.5px solid #e3e8f0',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 370,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'relative',
                height: '180px',
                overflow: 'hidden',
                background: '#e3f2fd',
                borderTopLeftRadius: 22,
                borderTopRightRadius: 22,
              }}>
                {tour.imageUrl ? (
                  <img
                    src={`http://localhost:8080${tour.imageUrl}`}
                    alt={tour.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: 22,
                      borderTopRightRadius: 22,
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1976d2',
                    fontWeight: 700
                  }}>No Image</div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  backgroundColor: '#fff',
                  color: '#388e3c',
                  padding: '7px 18px',
                  borderRadius: '16px',
                  fontSize: '18px',
                  fontWeight: 800,
                  boxShadow: '0 2px 8px #e3e8f0',
                  border: '1.5px solid #e3e8f0',
                  zIndex: 2
                }}>{tour.price.toLocaleString()} <span style={{ color: '#388e3c', fontWeight: 800 }}>đ</span></div>
              </div>
              <div style={{
                padding: '24px 20px 18px 20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '22px',
                  color: '#1976d2',
                  fontWeight: 800,
                  lineHeight: 1.3
                }}>{tour.name}</h3>
                <div style={{
                  display: 'flex',
                  gap: '18px',
                  marginBottom: '12px',
                  color: '#1976d2',
                  fontSize: '15px',
                  fontWeight: 600
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <FaCalendarAlt /> {tour.duration} days
                  </span>
                  {tour.destinations?.length > 0 && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <FaMapMarkerAlt /> {tour.destinations[0].name}
                    </span>
                  )}
                </div>
                <p style={{
                  color: '#333',
                  fontSize: '15px',
                  marginBottom: '18px',
                  lineHeight: '1.5',
                  minHeight: 38,
                  maxHeight: 44,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {tour.description?.substring(0, 100)}...
                </p>
                <Link 
                  to={`/tour-dashboard/detail/${tour.tourId}`}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    padding: '12px 0',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: 800,
                    transition: 'background-color 0.2s',
                    border: 'none',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px #e3e8f0',
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#1565c0'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#1976d2'}
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .tour-card-hover:hover {
          transform: translateY(-8px) scale(1.025);
          box-shadow: 0 8px 32px #1976d2cc;
          border: 2px solid #1976d2;
          z-index: 2;
        }
      `}</style>
    </div>
  );
}
