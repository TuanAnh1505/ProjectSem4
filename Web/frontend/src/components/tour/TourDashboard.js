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

      <div className="tour-dashboard-search">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tours by name or description..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-box">
          <div className="filter-group">
            <FaDollarSign className="filter-icon" />
            <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
              <option value="">Price Range</option>
              <option value="0-1000000">Under 1M VND</option>
              <option value="1000000-3000000">1M - 3M VND</option>
              <option value="3000000-5000000">3M - 5M VND</option>
              <option value="5000000-10000000">5M - 10M VND</option>
              <option value="10000000-999999999">Over 10M VND</option>
            </select>
          </div>

          <div className="filter-group">
            <FaCalendarAlt className="filter-icon" />
            <select name="duration" value={filters.duration} onChange={handleFilterChange}>
              <option value="">Duration</option>
              <option value="1-3">1-3 days</option>
              <option value="4-7">4-7 days</option>
              <option value="8-14">8-14 days</option>
              <option value="15-999">15+ days</option>
            </select>
          </div>

          <div className="filter-group">
            <FaMapMarkerAlt className="filter-icon" />
            <input
              type="text"
              name="destination"
              placeholder="Search by destination..."
              value={filters.destination}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <div className="no-tours-found">
          <h3>No tours found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="tour-list">
          {filteredTours.map(tour => (
            <div className="tour-card" key={tour.tourId}>
              <div className="tour-image-container">
                {tour.imageUrl ? (
                  <img
                    src={`http://localhost:8080${tour.imageUrl}`}
                    alt={tour.name}
                    className="tour-image"
                  />
                ) : (
                  <div className="tour-image-placeholder">No Image</div>
                )}
                <div className="tour-price">${tour.price.toLocaleString()}</div>
              </div>
              <div className="tour-info">
                <h3>{tour.name}</h3>
                <div className="tour-meta">
                  <span className="tour-duration">
                    <FaCalendarAlt /> {tour.duration} days
                  </span>
                  {tour.destinations?.length > 0 && (
                    <span className="tour-destination">
                      <FaMapMarkerAlt /> {tour.destinations[0].name}
                    </span>
                  )}
                </div>
                <p className="tour-description">
                  {tour.description?.substring(0, 100)}...
                </p>
                <Link to={`/tour-dashboard/detail/${tour.tourId}`} className="btn-tour-dashboard">
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
