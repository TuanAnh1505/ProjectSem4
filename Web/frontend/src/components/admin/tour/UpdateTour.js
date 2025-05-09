import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/tour/UpdateTour.css';

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

  const handleMultiSelect = (name, values) => {
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!selectedFile) return formData.imageUrl;
    const formDataImage = new FormData();
    formDataImage.append('file', selectedFile);

    try {
      const res = await axios.post('http://localhost:8080/api/tours/upload', formDataImage);
      return res.data; // return imageUrl
    } catch (err) {
      console.error('Upload failed:', err);
      throw new Error('Image upload failed');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const imageUrl = await uploadImage();

      const submitData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        maxParticipants: parseInt(formData.maxParticipants),
        statusId: parseInt(formData.statusId),
        imageUrl: imageUrl,
        destinationIds: formData.destinationIds,
        eventIds: formData.eventIds
      };

      await axios.put(`http://localhost:8080/api/tours/${tourId}`, submitData, config);
      alert('Tour updated successfully');
      navigate('/admin/tour');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update tour';
      setError(message);
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="update-tour-form">
      <h2>✏️ Edit Tour</h2>

      {error && (
        <div className="error-message">
          {error}
          {error !== 'Tour ID is required' && (
            <button className="retry-button-update-tour" onClick={() => window.location.reload()}>🔄 Retry</button>
          )}
        </div>
      )}

      {!error && (
        <form onSubmit={handleSubmit} className="tour-form">
          <div className="form-row">
            <div className="form-col">
              <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-col">
              <input name="duration" type="number" placeholder="Duration (days)" value={formData.duration} onChange={handleChange} />
              <input name="maxParticipants" type="number" placeholder="Max Participants" value={formData.maxParticipants} onChange={handleChange} />
            </div>
          </div>

          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

          <label>Status:</label>
          <select name="statusId" value={formData.statusId} onChange={handleChange} required>
            <option value="">-- Select Status --</option>
            {statuses.map(s => (
              <option key={s.tourStatusId} value={s.tourStatusId}>{s.statusName}</option>
            ))}
          </select>

          <label>Destinations:</label>
          <select
            multiple
            value={formData.destinationIds}
            onChange={e => handleMultiSelect('destinationIds', Array.from(e.target.selectedOptions, o => parseInt(o.value)))}
          >
            {destinations.map(d => (
              <option key={d.destinationId} value={d.destinationId}>{d.name}</option>
            ))}
          </select>

          <label>Events:</label>
          <select
            multiple
            value={formData.eventIds}
            onChange={e => handleMultiSelect('eventIds', Array.from(e.target.selectedOptions, o => parseInt(o.value)))}
          >
            {events.map(ev => (
              <option key={ev.eventId} value={ev.eventId}>{ev.name}</option>
            ))}
          </select>

          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit" className="submit-button-update-tour">Update Tour</button>
        </form>
      )}
    </div>
  );
}
