import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/tour/AddTour.css';
// FontAwesome icons
import { FaLink, FaDollarSign, FaCalendarAlt, FaUsers, FaCamera, FaCheckCircle } from 'react-icons/fa';

export default function AddTour() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    maxParticipants: '',
    statusId: '',
    imageUrl: '',
    destinationIds: [],
    eventIds: []
  });
  const [destinations, setDestinations] = useState([]);
  const [events, setEvents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [destRes, eventRes, statusRes] = await Promise.all([
          axios.get('http://localhost:8080/api/destinations', config),
          axios.get('http://localhost:8080/api/events', config),
          axios.get('http://localhost:8080/api/tour-status', config)
        ]);

        setDestinations(destRes.data);
        setEvents(eventRes.data);
        setStatuses(statusRes.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load data.');
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxCard = (name, value) => {
    setFormData(prev => {
      const arr = prev[name];
      if (arr.includes(value)) {
        return { ...prev, [name]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [name]: [...arr, value] };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/tours/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Upload image failed:', error);
      throw new Error(error.response?.data || 'Upload image failed');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const imageUrl = await uploadImage(selectedFile);

      const submitData = {
        ...formData,
        imageUrl,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        maxParticipants: parseInt(formData.maxParticipants),
        statusId: parseInt(formData.statusId),
      };

      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:8080/api/tours', submitData, config);
      setShowSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create tour');
      console.error('Create tour error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/admin/tour');
  };

  if (loading) return <div className="addtour-loading">Loading...</div>;

  return (
    <div className="addtour-container">
      <div className="addtour-header">
        <h2 className="addtour-title">Create New Tour</h2>
        <p className="addtour-subtitle">Fill in the details to create a new tour package</p>
      </div>

      {error && (
        <div className="addtour-error-box">
          <span className="addtour-error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="addtour-form">
        {/* Card 1: Basic Info */}
        <div className="addtour-card">
          <div className="addtour-card-title">Basic Information</div>
          <div className="addtour-grid">
            <div className="addtour-group">
              <label htmlFor="name" className="addtour-label">Tour Name</label>
              <div className="addtour-input-wrapper">
                <span className="addtour-input-icon"><FaLink /></span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="addtour-input"
                  placeholder="Enter tour name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="addtour-group">
              <label htmlFor="price" className="addtour-label">Price</label>
              <div className="addtour-input-wrapper">
                <span className="addtour-input-icon"><FaDollarSign /></span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  className="addtour-input"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="addtour-group">
              <label htmlFor="duration" className="addtour-label">Duration</label>
              <div className="addtour-input-wrapper">
                <span className="addtour-input-icon"><FaCalendarAlt /></span>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  className="addtour-input"
                  placeholder="Enter duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="addtour-group">
              <label htmlFor="maxParticipants" className="addtour-label">Max Participants</label>
              <div className="addtour-input-wrapper">
                <span className="addtour-input-icon"><FaUsers /></span>
                <input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  className="addtour-input"
                  placeholder="Enter max participants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Description */}
        <div className="addtour-card">
          <div className="addtour-card-title">Tour Details</div>
          <div className="addtour-group">
            <label htmlFor="description" className="addtour-label">Description</label>
            <div className="addtour-textarea-wrapper">
              <textarea
                id="description"
                name="description"
                className="addtour-textarea"
                placeholder="Enter tour description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Card 3: Settings */}
        <div className="addtour-card">
          <div className="addtour-card-title">Tour Settings</div>
          <div className="addtour-group">
            <label htmlFor="statusId" className="addtour-label">Status</label>
            <div className="addtour-select-wrapper">
              <select
                id="statusId"
                name="statusId"
                className="addtour-select"
                value={formData.statusId}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                {statuses.map(s => (
                  <option key={s.tourStatusId} value={s.tourStatusId}>
                    {s.statusName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="addtour-checkbox-grid">
            <div className="addtour-checkbox-col">
              <div className="addtour-checkbox-title">Destinations</div>
              {destinations.map(d => (
                <label key={d.destinationId} className="addtour-checkbox-card">
                  <input
                    type="checkbox"
                    checked={formData.destinationIds.includes(d.destinationId)}
                    onChange={() => handleCheckboxCard('destinationIds', d.destinationId)}
                  />
                  <span className="addtour-checkbox-custom"></span>
                  <span className="addtour-checkbox-label">{d.name}</span>
                </label>
              ))}
            </div>
            <div className="addtour-checkbox-col">
              <div className="addtour-checkbox-title">Places</div>
              {events.map(ev => (
                <label key={ev.eventId} className="addtour-checkbox-card">
                  <input
                    type="checkbox"
                    checked={formData.eventIds.includes(ev.eventId)}
                    onChange={() => handleCheckboxCard('eventIds', ev.eventId)}
                  />
                  <span className="addtour-checkbox-custom"></span>
                  <span className="addtour-checkbox-label">{ev.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Image Upload */}
        <div className="addtour-card">
          <div className="addtour-card-title">Tour Image</div>
          <div className="addtour-group">
            <div className="addtour-upload">
              <label className="addtour-upload-area">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <div className="addtour-upload-placeholder">
                  <span className="addtour-upload-icon"><FaCamera /></span>
                  <p>Click to upload tour image</p>
                  <p className="addtour-upload-hint">PNG, JPG up to 5MB</p>
                </div>
              </label>
              {previewUrl && (
                <div className="addtour-preview">
                  <img src={previewUrl} alt="Preview" />
                  <button type="button" className="addtour-remove-image" onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}>
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 5: Submit */}
        <div className="addtour-actions">
          <button type="submit" className="addtour-submit-btn">
            Create Tour
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="tour-success-overlay">
          <div className="tour-success-dialog">
            <FaCheckCircle className="tour-success-icon" />
            <h2 className="tour-success-title">Tạo tour thành công!</h2>
            <p className="tour-success-message">
              Tour mới đã được tạo thành công. Bạn có thể xem danh sách tour hoặc tiếp tục tạo tour mới.
            </p>
            <button 
              className="tour-success-button"
              onClick={handleSuccessClose}
            >
              Xem danh sách tour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
