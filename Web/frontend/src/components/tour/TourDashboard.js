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
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const res = await axios.get('http://localhost:8080/api/tours', config);
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
    <div className="tour-dashboard">
      <div className="loading">Loading tours...</div>
    </div>
  );

  if (error) return (
    <div className="tour-dashboard">
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="tour-dashboard">
      <div className="tour-dashboard-header">
        <h1>Discover Amazing Tours</h1>
        <p>Explore our curated collection of Vietnam's best tours</p>
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
          marginBottom: '32px'
        }}
      >
        <div
          className="search-box"
          style={{
            flex: 1,
            minWidth: 320,
            maxWidth: 500,
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            height: 64
          }}
        >
          <FaSearch className="search-icon" style={{ color: '#1976d2', fontSize: 24, marginRight: 16 }} />
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
          className="filter-box"
          style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 350,
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            height: 64
          }}
        >
          <FaDollarSign className="filter-icon" style={{ color: '#1976d2', fontSize: 22, marginRight: 12 }} />
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
              color: '#222',
              padding: '8px 0'
            }}
          >
            <option value="">Price Range</option>
            <option value="0-1000000">Under 1M VND</option>
            <option value="1000000-3000000">1M - 3M VND</option>
            <option value="3000000-5000000">3M - 5M VND</option>
            <option value="5000000-10000000">5M - 10M VND</option>
            <option value="10000000-999999999">Over 10M VND</option>
          </select>
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>No tours found</h3>
          <p style={{ color: '#888' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          padding: '20px 0'
        }}>
          {filteredTours.slice(0, 6).map(tour => (
            <div key={tour.tourId} style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <div style={{
                position: 'relative',
                height: '200px',
                overflow: 'hidden'
              }}>
                {tour.imageUrl ? (
                  <img
                    src={`http://localhost:8080${tour.imageUrl}`}
                    alt={tour.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666'
                  }}>No Image</div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>{tour.price.toLocaleString()} VND</div>
              </div>
              <div style={{
                padding: '15px'
              }}>
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '18px',
                  color: '#333'
                }}>{tour.name}</h3>
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  marginBottom: '10px',
                  color: '#666',
                  fontSize: '14px'
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
                  color: '#666',
                  fontSize: '14px',
                  marginBottom: '15px',
                  lineHeight: '1.4'
                }}>
                  {tour.description?.substring(0, 100)}...
                </p>
                <Link 
                  to={`/tour-dashboard/detail/${tour.tourId}`}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#0056b3'
                    }
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
