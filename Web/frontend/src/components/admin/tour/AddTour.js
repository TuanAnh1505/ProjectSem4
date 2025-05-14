import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/tour/AddTour.css';

export default function AddTour() {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', duration: '', maxParticipants: '', statusId: '', imageUrl: '', destinationIds: [], eventIds: []
  });
  const [destinations, setDestinations] = useState([]);
  const [events, setEvents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleMultiSelect = (name, values) => {
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
      alert('Tour created successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create tour');
      console.error('Create tour error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="add-tour-container">
      <h2>Add New Tour</h2>
      {error && <div className="error-box">{error}</div>}
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
        <select multiple value={formData.destinationIds} onChange={e => handleMultiSelect('destinationIds', Array.from(e.target.selectedOptions, o => parseInt(o.value)))}>
          {destinations.map(d => (
            <option key={d.destinationId} value={d.destinationId}>{d.name}</option>
          ))}
        </select>

        <label>Events:</label>
        <select multiple value={formData.eventIds} onChange={e => handleMultiSelect('eventIds', Array.from(e.target.selectedOptions, o => parseInt(o.value)))}>
          {events.map(ev => (
            <option key={ev.eventId} value={ev.eventId}>{ev.name}</option>
          ))}
        </select>

        <label>Image:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit" className="submit-button-add-tour">Create Tour</button>
      </form>
    </div>
  );
}
