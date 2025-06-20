import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/tour/UpdateTour.css';
// FontAwesome icons
import { FaLink, FaDollarSign, FaCalendarAlt, FaUsers, FaCamera, FaCheckCircle } from 'react-icons/fa';

export default function UpdateTour() {
  const { tourId } = useParams();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    if (!tourId) {
      setError('Tour ID is required');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [destRes, eventRes, tourRes, statusRes] = await Promise.all([
          axios.get('http://localhost:8080/api/destinations', config),
          axios.get('http://localhost:8080/api/events', config),
          axios.get(`http://localhost:8080/api/tours/${tourId}`, config),
          axios.get('http://localhost:8080/api/tour-status', config)
        ]);

        const tour = tourRes.data;
        if (!tour) throw new Error('Tour not found');

        tour.destinationIds = tour.destinations?.map(d => d.destinationId) || [];
        tour.eventIds = tour.events?.map(e => e.eventId) || [];

        setDestinations(destRes.data);
        setEvents(eventRes.data);
        setStatuses(statusRes.data);
        setFormData(tour);
        setExistingImages(tour.imageUrls || []);
        setNewFiles([]);
        setNewPreviews([]);
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Failed to load tour data';
        setError(message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tourId]);

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
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
  };

  const handleRemoveNewImage = (idx) => {
    setNewFiles(newFiles.filter((_, i) => i !== idx));
    setNewPreviews(newPreviews.filter((_, i) => i !== idx));
  };

  const uploadImages = async (files) => {
    const token = localStorage.getItem('token');
    const uploadedUrls = [];
    for (let file of files) {
      const formDataImage = new FormData();
      formDataImage.append('file', file);
      const response = await axios.post(
        'http://localhost:8080/api/tours/upload',
        formDataImage,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      uploadedUrls.push(response.data);
    }
    return uploadedUrls;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let uploadedUrls = [];
      if (newFiles.length > 0) {
        uploadedUrls = await uploadImages(newFiles);
      }

      const finalImageUrls = [...existingImages, ...uploadedUrls];
      const submitData = {
        ...formData,
        imageUrls: finalImageUrls,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        maxParticipants: parseInt(formData.maxParticipants),
        statusId: parseInt(formData.statusId),
      };

      await axios.put(`http://localhost:8080/api/tours/${tourId}`, submitData, config);
      setShowSuccess(true);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update tour';
      setError(message);
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/admin/tour');
  };

  if (loading) return <div className="update-tour-loading">Loading...</div>;

  return (
    <div className="update-tour-form-container">
      <div className="update-tour-header">
        <h2 className="update-tour-title">Cập nhật tour</h2>
        <p className="update-tour-subtitle">Cập nhật thông tin tour</p>
      </div>

      {error && (
        <div className="update-tour-error-box">
          <span className="update-tour-error-icon">⚠️</span>
          <span>{error}</span>
          {error !== 'Tour ID is required' && (
            <button className="update-tour-retry-btn" onClick={() => window.location.reload()}>🔄 Retry</button>
          )}
        </div>
      )}

      {!error && (
        <form onSubmit={handleSubmit} className="update-tour-form">
          {/* Card 1: Basic Info */}
          <div className="update-tour-card">
            <div className="update-tour-card-title">Thông tin tour</div>
            <div className="update-tour-grid">
              <div className="update-tour-group">
                <label htmlFor="name" className="update-tour-label">Tên tour</label>
                <div className="update-tour-input-wrapper">
                  <span className="update-tour-input-icon"><FaLink /></span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="update-tour-input"
                    placeholder="Enter tour name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="update-tour-group">
                <label htmlFor="price" className="update-tour-label">Giá</label>
                <div className="update-tour-input-wrapper">
                  <span className="update-tour-input-icon"><FaDollarSign /></span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    className="update-tour-input"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="update-tour-group">
                <label htmlFor="duration" className="update-tour-label">Thời gian</label>
                <div className="update-tour-input-wrapper">
                  <span className="update-tour-input-icon"><FaCalendarAlt /></span>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    className="update-tour-input"
                    placeholder="Enter duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="update-tour-group">
                <label htmlFor="maxParticipants" className="update-tour-label">Số lượng người tham gia</label>
                <div className="update-tour-input-wrapper">
                  <span className="update-tour-input-icon"><FaUsers /></span>
                  <input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    className="update-tour-input"
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
          <div className="update-tour-card">
            <div className="update-tour-card-title">Thông tin chi tiết</div>
            <div className="update-tour-group">
              <label htmlFor="description" className="update-tour-label">Mô tả</label>
              <div className="update-tour-textarea-wrapper">
                <textarea
                  id="description"
                  name="description"
                  className="update-tour-textarea"
                  placeholder="Enter tour description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Card 3: Settings */}
          <div className="update-tour-card">
            <div className="update-tour-card-title">Cài đặt</div>
            <div className="update-tour-group">
              <label htmlFor="statusId" className="update-tour-label">Trạng thái</label>
              <div className="update-tour-select-wrapper">
                <select
                  id="statusId"
                  name="statusId"
                  className="update-tour-select"
                  value={formData.statusId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn trạng thái</option>
                  {statuses.map(s => (
                    <option key={s.tourStatusId} value={s.tourStatusId}>
                      {s.statusName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="update-tour-checkbox-grid">
              <div className="update-tour-checkbox-col">
                <div className="update-tour-checkbox-title">Điểm đến</div>
                {destinations.map(d => (
                  <label key={d.destinationId} className="update-tour-checkbox-card">
                    <input
                      type="checkbox"
                      checked={formData.destinationIds.includes(d.destinationId)}
                      onChange={() => handleCheckboxCard('destinationIds', d.destinationId)}
                    />
                    <span className="update-tour-checkbox-custom"></span>
                    <span className="update-tour-checkbox-label">{d.name}</span>
                  </label>
                ))}
              </div>
              <div className="update-tour-checkbox-col">
                <div className="update-tour-checkbox-title">Sự kiện</div>
                {events.map(ev => (
                  <label key={ev.eventId} className="update-tour-checkbox-card">
                    <input
                      type="checkbox"
                      checked={formData.eventIds.includes(ev.eventId)}
                      onChange={() => handleCheckboxCard('eventIds', ev.eventId)}
                    />
                    <span className="update-tour-checkbox-custom"></span>
                    <span className="update-tour-checkbox-label">{ev.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Image Upload */}
          <div className="update-tour-card">
            <div className="update-tour-card-title">Hình ảnh tour</div>
            <div className="update-tour-group">
              <div className="update-tour-upload">
                <label className="update-tour-upload-area">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  <div className="update-tour-upload-placeholder">
                    <span className="update-tour-upload-icon"><FaCamera /></span>
                    <p>Click để upload thêm ảnh tour</p>
                    <p className="update-tour-upload-hint">PNG, JPG up to 5MB. Có thể chọn nhiều ảnh.</p>
                  </div>
                </label>
                {existingImages.length > 0 && (
                  <div className="update-tour-preview-multi">
                    {existingImages.map((url, idx) => (
                      <div key={idx} className="update-tour-preview">
                        <img src={`http://localhost:8080${url}`} alt={`Old ${idx + 1}`} />
                        <button type="button" className="update-tour-remove-image" onClick={() => handleRemoveExistingImage(idx)}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {newPreviews.length > 0 && (
                  <div className="update-tour-preview-multi">
                    {newPreviews.map((url, idx) => (
                      <div key={idx} className="update-tour-preview">
                        <img src={url} alt={`New ${idx + 1}`} />
                        <button type="button" className="update-tour-remove-image" onClick={() => handleRemoveNewImage(idx)}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 5: Submit */}
          <div className="update-tour-actions">
            <button type="submit" className="update-tour-submit-btn">
              Update Tour
            </button>
          </div>
        </form>
      )}

      {showSuccess && (
        <div className="tour-success-overlay">
          <div className="tour-success-dialog">
            <FaCheckCircle className="tour-success-icon" />
            <h2 className="tour-success-title">Cập nhật tour thành công!</h2>
            <p className="tour-success-message">
              Tour đã được cập nhật thành công. Bạn có thể xem danh sách tour hoặc tiếp tục chỉnh sửa tour khác.
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
