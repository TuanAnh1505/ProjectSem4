import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UpdateItinerary() {
  const { itineraryId } = useParams();
  const navigate = useNavigate();

  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    itineraryId: '',
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
    const fetchData = async () => {
      try {
        const tourList = await axios.get("http://localhost:8080/api/tours");
        setTours(tourList.data);

        const itineraryRes = await axios.get(`http://localhost:8080/api/itineraries/${itineraryId}`);
        const itinerary = itineraryRes.data;

        setForm({
          ...itinerary,
          startDate: itinerary.startDate || '',
          endDate: itinerary.endDate || '',
          destinations: itinerary.destinations || [],
          events: itinerary.events || []
        });

        const [destRes, eventRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/tours/${itinerary.tourId}/destinations`),
          axios.get(`http://localhost:8080/api/tours/${itinerary.tourId}/events`)
        ]);

        setDestinations(destRes.data || []);
        setEvents(eventRes.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    };

    fetchData();
  }, [itineraryId]);

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
      const truncateNote = (note) => (note || '').substring(0, 255);

      const formattedData = {
        itineraryId: parseInt(itineraryId),
        tourId: parseInt(form.tourId),
        title: form.title,
        description: form.description,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        destinations: form.destinations.map(dest => ({
          destinationId: parseInt(dest.destinationId),
          visitOrder: parseInt(dest.visitOrder) || 1,
          note: truncateNote(dest.note)
        })),
        events: form.events.map(event => ({
          eventId: parseInt(event.eventId),
          attendTime: event.attendTime || null,
          note: truncateNote(event.note)
        }))
      };

      console.log("Submitting update:", formattedData);
      await axios.put(`http://localhost:8080/api/itineraries/${itineraryId}`, formattedData);
      navigate("/admin/itinerary");
    } catch (err) {
      console.error("Update failed:", err.response?.data);
      alert("Cập nhật thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cập nhật lịch trình</h2>

      <div className="mb-4">
        <label className="block mb-2">Tour:</label>
        <select className="w-full p-2 border rounded" value={form.tourId} disabled>
          {tours.map(tour => (
            <option key={tour.tourId} value={tour.tourId}>{tour.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Tiêu đề:</label>
        <input className="w-full p-2 border rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Mô tả:</label>
        <textarea className="w-full p-2 border rounded" value={form.description} rows="3" onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Ngày bắt đầu:</label>
        <input type="date" className="w-full p-2 border rounded" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Ngày kết thúc:</label>
        <input type="date" className="w-full p-2 border rounded" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Điểm đến:</h3>
        {destinations.map(dest => (
          <div key={dest.destinationId} className="border p-4 rounded mb-4">
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

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Sự kiện:</h3>
        {events.map(event => (
          <div key={event.eventId} className="border p-4 rounded mb-4">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={form.events.some(e => e.eventId === event.eventId)}
                onChange={() => handleEventToggle(event)}
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

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Cập nhật
      </button>
    </form>
  );
}
