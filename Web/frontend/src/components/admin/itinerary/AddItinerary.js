import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    destinations: [],
    events: []
  });

  // Add axios interceptor for authentication
  useEffect(() => {
    const token = localStorage.getItem('token'); // assuming you store JWT token in localStorage
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
            destinationId: dest.destinationId, // Changed from dest.id
            name: dest.name,
            visitOrder: '', // Remove default value
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
            eventId: event.eventId, // Changed from event.id
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

      // Truncate notes to maximum 255 characters
      const truncateNote = (note) => (note || '').substring(0, 255);

      const formattedData = {
        tourId: parseInt(selectedTour),
        title: form.title,
        description: form.description || '',
        destinations: form.destinations.map(dest => ({
          destinationId: parseInt(dest.destinationId),
          visitOrder: parseInt(dest.visitOrder) || 1,
          note: truncateNote(dest.note)
        })).sort((a, b) => a.visitOrder - b.visitOrder),
        events: form.events.map(event => ({
          eventId: parseInt(event.eventId),
          attendTime: event.attendTime || new Date().toISOString(),
          note: truncateNote(event.note)
        }))
      };

      console.log('Submitting data:', formattedData);
      const response = await axios.post("http://localhost:8080/api/itineraries", formattedData);
      console.log('Response:', response.data);
      navigate("/admin/itinerary");
    } catch (err) {
      console.error("Error details:", err.response?.data);
      alert("Failed to create itinerary: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Thêm lịch trình</h2>

      <div className="mb-4">
        <label className="block mb-2">Chọn Tour:</label>
        <select
          className="w-full p-2 border rounded"
          onChange={handleTourChange}
          value={selectedTour || ''}
          required
        >
          <option value="">-- Chọn tour --</option>
          {tours.map(tour => (
            <option key={tour.tourId} value={tour.tourId}>
              {tour.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTour && selectedTour !== '' && (
        <>
          {/* Basic Info */}
          

          {/* Title and Description */}
          <div className="mb-4">
            <label className="block mb-2">Tiêu đề:</label>
            <input
              name="title"
              className="w-full p-2 border rounded"
              placeholder="Tiêu đề"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Mô tả:</label>
            <textarea
              name="description"
              className="w-full p-2 border rounded"
              placeholder="Mô tả"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows="4"
            ></textarea>
          </div>

          {/* Destinations */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Điểm đến:</h3>
            {destinations.map(dest => (
              <div key={dest.destinationId} className="border p-4 rounded mb-4"> {/* Changed from dest.id */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={form.destinations.some(d => d.destinationId === dest.destinationId)}
                    onChange={() => handleDestinationToggle(dest)}
                  />
                  <span className="font-bold">{dest.name}</span>
                </div>
                {form.destinations.some(d => d.destinationId === dest.destinationId) && (
                  <div className="ml-6">
                    <input
                      type="number"
                      placeholder="Thứ tự thăm quan"
                      className="w-full p-2 border rounded mb-2"
                      value={form.destinations.find(d => d.destinationId === dest.destinationId)?.visitOrder || ''}
                      onChange={e => handleDestinationDetail(dest.destinationId, 'visitOrder', e.target.value)}
                    />
                    <textarea
                      placeholder="Chi tiết thăm quan..."
                      className="w-full p-2 border rounded"
                      value={form.destinations.find(d => d.destinationId === dest.destinationId)?.note || ''}
                      onChange={e => handleDestinationDetail(dest.destinationId, 'note', e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Events */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Sự kiện:</h3>
            {events.map(event => (
              <div key={event.eventId} className="border p-4 rounded mb-4"> {/* Changed from event.id */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    onChange={() => handleEventToggle(event)}
                    checked={form.events.some(e => e.eventId === event.eventId)}
                  />
                  <span className="font-bold">{event.name}</span>
                </div>
                {form.events.some(e => e.eventId === event.eventId) && (
                  <div className="ml-6">
                    <input
                      type="datetime-local"
                      className="w-full p-2 border rounded mb-2"
                      value={form.events.find(e => e.eventId === event.eventId)?.attendTime || ''}
                      onChange={e => handleEventChange(event.eventId, 'attendTime', e.target.value)}
                    />
                    <textarea
                      placeholder="Chi tiết sự kiện..."
                      className="w-full p-2 border rounded"
                      value={form.events.find(e => e.eventId === event.eventId)?.note || ''}
                      onChange={e => handleEventChange(event.eventId, 'note', e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Lưu
          </button>
        </>
      )}
    </form>
  );
}
