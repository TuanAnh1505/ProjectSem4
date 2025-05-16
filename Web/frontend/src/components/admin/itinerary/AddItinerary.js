import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddItinerary.css';

export default function AddItinerary() {
  const navigate = useNavigate();

  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    tourId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    destinations: [],
    events: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/tours");
        setTours(res.data);
      } catch (err) {
        console.error("Error loading tours:", err);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    if (selectedTour) {
      const fetchData = async () => {
        try {
          const tourId = parseInt(selectedTour);
          const [destRes, eventRes] = await Promise.all([
            axios.get(`http://localhost:8080/api/tours/${tourId}/destinations`),
            axios.get(`http://localhost:8080/api/tours/${tourId}/events`)
          ]);
          setDestinations(destRes.data || []);
          setEvents(eventRes.data || []);
          setForm(prev => ({ ...prev, tourId: tourId }));
        } catch (err) {
          console.error("Error loading destinations/events:", err);
          setDestinations([]);
          setEvents([]);
        }
      };
      fetchData();
    }
  }, [selectedTour]);

  const handleTourChange = (e) => {
    const tourId = e.target.value;
    setSelectedTour(tourId);
    setForm(prev => ({
      ...prev,
      tourId: tourId,
      destinations: [],
      events: []
    }));
  };

  const handleDestinationToggle = (dest) => {
    setForm(prev => {
      const exists = prev.destinations.some(d => d.destinationId === dest.destinationId);
      const destinations = exists
        ? prev.destinations.filter(d => d.destinationId !== dest.destinationId)
        : [...prev.destinations, {
            destinationId: dest.destinationId,
            name: dest.name,
            visitOrder: '',
            note: ''
          }];
      return { ...prev, destinations };
    });
  };

  const handleDestinationDetail = (destId, field, value) => {
    setForm(prev => ({
      ...prev,
      destinations: prev.destinations.map(d =>
        d.destinationId === destId
          ? { ...d, [field]: value }
          : d
      )
    }));
  };

  const handleEventToggle = (event) => {
    setForm(prev => {
      const exists = prev.events.some(e => e.eventId === event.eventId);
      const events = exists
        ? prev.events.filter(e => e.eventId !== event.eventId)
        : [...prev.events, {
            eventId: event.eventId,
            name: event.name,
            attendTime: '',
            note: ''
          }];
      return { ...prev, events };
    });
  };

  const handleEventChange = (eventId, field, value) => {
    setForm(prev => ({
      ...prev,
      events: prev.events.map(e =>
        e.eventId === eventId
          ? { ...e, [field]: value }
          : e
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedTour || !form.title) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const truncateNote = (note) => (note || '').substring(0, 255);

      const formattedData = {
        tourId: parseInt(selectedTour),
        title: form.title,
        description: form.description || '',
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        destinations: form.destinations.map(dest => ({
          destinationId: parseInt(dest.destinationId),
          visitOrder: parseInt(dest.visitOrder) || 1,
          note: truncateNote(dest.note)
        })).sort((a, b) => a.visitOrder - b.visitOrder),
        events: form.events.map(event => ({
          eventId: parseInt(event.eventId),
          attendTime: event.attendTime || null,
          note: truncateNote(event.note)
        }))
      };

      console.log('Submitting data:', formattedData);
      const response = await axios.post("http://localhost:8080/api/itineraries", formattedData);
      console.log('Response:', response.data);
      navigate("/admin/itinerary");
    } catch (err) {
      console.error("Error details:", err.response?.data);
      alert("Lưu lịch trình thất bại: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="itinerary-form">
      <h2 className="itinerary-title">Thêm lịch trình</h2>

      <div className="form-group">
        <label>Chọn Tour:</label>
        <select className="form-select" onChange={handleTourChange} value={selectedTour || ''} required>
          <option value="">-- Chọn tour --</option>
          {tours.map(tour => (
            <option key={tour.tourId} value={tour.tourId}>{tour.name}</option>
          ))}
        </select>
      </div>

      {selectedTour && (
        <>
          <div className="form-group">
            <label>Tiêu đề:</label>
            <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Nhập tiêu đề lịch trình" />
          </div>

          <div className="form-group">
            <label>Mô tả:</label>
            <textarea className="form-textarea" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
          </div>

          <div className="form-group">
            <label>Ngày bắt đầu:</label>
            <input type="date" className="form-input" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Ngày kết thúc:</label>
            <input type="date" className="form-input" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          </div>

          <div className="form-group">
            <h3>Điểm đến:</h3>
            {destinations.map(dest => (
              <div key={dest.destinationId} className="destination-card">
                <div>
                  <input type="checkbox" checked={form.destinations.some(d => d.destinationId === dest.destinationId)} onChange={() => handleDestinationToggle(dest)} />
                  <span>{dest.name}</span>
                </div>
                {form.destinations.some(d => d.destinationId === dest.destinationId) && (
                  <>
                    <input type="number" placeholder="Thứ tự thăm quan" className="form-input"
                      value={form.destinations.find(d => d.destinationId === dest.destinationId)?.visitOrder || ''}
                      onChange={e => handleDestinationDetail(dest.destinationId, 'visitOrder', e.target.value)} />
                    <textarea placeholder="Ghi chú điểm đến..." className="form-textarea"
                      value={form.destinations.find(d => d.destinationId === dest.destinationId)?.note || ''}
                      onChange={e => handleDestinationDetail(dest.destinationId, 'note', e.target.value)} />
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="form-group">
            <h3>Sự kiện:</h3>
            {events.map(event => (
              <div key={event.eventId} className="event-card">
                <div>
                  <input type="checkbox" checked={form.events.some(e => e.eventId === event.eventId)} onChange={() => handleEventToggle(event)} />
                  <span>{event.name}</span>
                </div>
                {form.events.some(e => e.eventId === event.eventId) && (
                  <>
                    <input type="datetime-local" className="form-input"
                      value={form.events.find(e => e.eventId === event.eventId)?.attendTime || ''}
                      onChange={e => handleEventChange(event.eventId, 'attendTime', e.target.value)} />
                    <textarea placeholder="Ghi chú sự kiện..." className="form-textarea"
                      value={form.events.find(e => e.eventId === event.eventId)?.note || ''}
                      onChange={e => handleEventChange(event.eventId, 'note', e.target.value)} />
                  </>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="submit-button-add-itinerary">Lưu lịch trình</button>
        </>
      )}
    </form>
  );
}
