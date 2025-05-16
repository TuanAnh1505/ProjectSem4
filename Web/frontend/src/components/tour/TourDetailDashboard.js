import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/tour/TourDetailDashboard.css';
import '../styles/booking/BookingDashboard.css';

export default function TourDetailDashboard() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [message, setMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [relatedTours, setRelatedTours] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [expandedDestinations, setExpandedDestinations] = useState({});
  const [expandedEvents, setExpandedEvents] = useState({});
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);

  const toggleDestination = (destId) => {
    setExpandedDestinations(prev => ({
      ...prev,
      [destId]: !prev[destId]
    }));
  };

  const toggleEvent = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axios.get(`http://localhost:8080/api/tours/${tourId}`, config);
        if (!res.data) throw new Error('Tour not found');
        setTour(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please login to view tour details');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load tour details.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (tourId) fetchTour();
    else {
      setError('Invalid tour ID');
      setLoading(false);
    }
  }, [tourId, navigate]);

  useEffect(() => {
    const fetchRelatedTours = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token 
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
          
        const res = await axios.get(
          `http://localhost:8080/api/tours/random?count=3&excludeTourId=${tourId}`,
          config
        );
        setRelatedTours(res.data);
      } catch (err) {
        console.error('Failed to fetch related tours:', err);
      }
    };

    if (tourId) fetchRelatedTours();
  }, [tourId]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token 
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axios.get(
          `http://localhost:8080/api/itineraries/tour/${tourId}`,
          config
        );
        
        const itinerariesWithDetails = await Promise.all(
          res.data.map(async (itinerary) => {
            let destinationsWithNames = [];
            if (itinerary.destinations) {
              destinationsWithNames = await Promise.all(
                itinerary.destinations.map(async (dest) => {
                  try {
                    const destRes = await axios.get(
                      `http://localhost:8080/api/destinations/${dest.destinationId}`,
                      config
                    );
                    return { ...dest, name: destRes.data.name };
                  } catch {
                    return { ...dest, name: "Unknown Destination" };
                  }
                })
              );
            }

            let eventsWithNames = [];
            if (itinerary.events) {
              eventsWithNames = await Promise.all(
                itinerary.events.map(async (event) => {
                  try {
                    const eventRes = await axios.get(
                      `http://localhost:8080/api/events/${event.eventId}`,
                      config
                    );
                    return { ...event, name: eventRes.data.name };
                  } catch {
                    return { ...event, name: "Unknown Event" };
                  }
                })
              );
            }

            return { 
              ...itinerary, 
              destinations: destinationsWithNames,
              events: eventsWithNames 
            };
          })
        );
        
        setItineraries(itinerariesWithDetails);
      } catch (err) {
        console.error('Failed to fetch itineraries:', err);
      }
    };

    if (tourId) fetchItineraries();
  }, [tourId]);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setMessage('Please login to book this tour');
        return navigate('/login');
      }
      if (!selectedItineraryId) {
        setMessage('Vui lòng chọn lịch trình muốn đặt!');
        return;
      }

      setBookingLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const bookingRequest = {
        userId: parseInt(userId),
        tourId: parseInt(tourId),
        itineraryId: selectedItineraryId,
        discountCode: discountCode.trim() || null
      };

      const res = await axios.post('http://localhost:8080/api/bookings', bookingRequest, config);
      if (res.data && res.data.bookingId) {
        setMessage(`✅ ${res.data.message || 'Booking successful!'}`);
        navigate('/booking-passenger', { 
          state: { 
            bookingId: res.data.bookingId,
            tourInfo: tour,
            discountCode: discountCode,
            itinerary: itineraries.find(i => i.itineraryId === selectedItineraryId)
          }
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '❌ Booking failed. Please try again.';
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading tour details...</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!tour) return <div className="error-box">Tour not found</div>;

  return (
    <div className="tour-detail-client">
      <div className="tour-detail-top">
        {tour.imageUrl && (
          <img
            src={`http://localhost:8080${tour.imageUrl}`}
            alt={tour.name}
            className="tour-detail-banner"
          />
        )}
        <div className="tour-detail-info">
          <h2>{tour.name}</h2>
          <div className="info-row"><label>Price:</label><span>${tour.price}</span></div>
          <div className="info-row"><label>Duration:</label><span>{tour.duration} days</span></div>
          <div className="info-row"><label>Max Participants:</label><span>{tour.maxParticipants}</span></div>
        </div>
      </div>

      <div className="tour-detail-body">
        <div className="info-section">
          <div className="info-row">
            <label>Description:</label>
            <span>{tour.description || 'No description provided.'}</span>
          </div>
        </div>

        <div className="itinerary-section">
          <h2 className="itinerary-title">LỊCH TRÌNH TOUR</h2>
          {itineraries.length > 0 ? (
            <div className="space-y-4">
              {itineraries.sort((a, b) => a.dayNumber - b.dayNumber).map((itinerary, idx) => (
                <div key={itinerary.itineraryId} className="itinerary-card">
                  <div className="itinerary-header">
                    <input
                      type="radio"
                      name="selectedItinerary"
                      value={itinerary.itineraryId}
                      checked={selectedItineraryId === itinerary.itineraryId}
                      onChange={() => setSelectedItineraryId(itinerary.itineraryId)}
                      style={{ accentColor: '#1976d2', width: 18, height: 18 }}
                      className="mr-2"
                    />
                    <h3>{itinerary.name ? itinerary.name : `Lịch trình ${idx + 1}`}</h3>
                  </div>
                  {(itinerary.startDate || itinerary.endDate) && (
                    <div className="itinerary-date">
                      {itinerary.startDate && (
                        <span className="start">Bắt đầu: {new Date(itinerary.startDate).toLocaleDateString('vi-VN')}</span>
                      )}
                      {itinerary.startDate && itinerary.endDate && <span> - </span>}
                      {itinerary.endDate && (
                        <span className="end">Kết thúc: {new Date(itinerary.endDate).toLocaleDateString('vi-VN')}</span>
                      )}
                    </div>
                  )}
                  {itinerary.destinations && itinerary.destinations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-2 text-blue-700">🗺️ Điểm đến:</h4>
                      <div>
                        {itinerary.destinations
                          .sort((a, b) => a.visitOrder - b.visitOrder)
                          .map((dest) => (
                            <div
                              key={dest.destinationId}
                              className="itinerary-destination"
                              onClick={() => toggleDestination(dest.destinationId)}
                            >
                              <span className="day-label">📅 Ngày {dest.visitOrder}</span>
                              <span className="dest-name">- {dest.name}</span>
                              {expandedDestinations[dest.destinationId] && (
                                <div className="itinerary-note">
                                  {dest.note || <span className="note-empty">Không có chi tiết</span>}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  {itinerary.events && itinerary.events.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-red-700">🎉 Sự kiện:</h4>
                      <div>
                        {itinerary.events.map((event) => (
                          <div
                            key={event.eventId}
                            className="itinerary-event"
                            onClick={() => toggleEvent(event.eventId)}
                          >
                            <span className="event-label">🎈 Sự kiện: {event.name}</span>
                            {expandedEvents[event.eventId] && (
                              <div className="itinerary-note">
                                <div>
                                  <span className="font-medium">Thời gian: </span>
                                  {event.attendTime
                                    ? new Date(event.attendTime).toLocaleString('vi-VN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    : <span className="note-empty">Chưa có thời gian cụ thể</span>
                                  }
                                </div>
                                <div className="mt-1">
                                  <span className="font-medium">Chi tiết: </span>
                                  {event.note || <span className="note-empty">Không có chi tiết</span>}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Chưa có lịch trình cho tour này</p>
          )}
        </div>

        <div className="booking-form">
          <h3>🧾 Book This Tour</h3>
          <div className="form-group discount">
            <label>Mã giảm giá (nếu có):</label>
            <input
              type="text"
              placeholder="VD: NEWUSER10"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </div>

          <button
            className="btn submit-btn"
            onClick={handleBooking}
            disabled={bookingLoading}
          >
            {bookingLoading ? 'Đang xử lý...' : '✅ Đặt ngay'}
          </button>

          {message && <div className="message-box">{message}</div>}
        </div>

        <div className="related-tours-section">
          <h2>CÁC CHƯƠNG TRÌNH KHÁC</h2>
          <div className="related-tours-grid">
            {relatedTours.map(tour => (
              <div key={tour.tourId} className="tour-card">
                <div className="tour-image">
                  <img src={`http://localhost:8080${tour.imageUrl}`} alt={tour.name} />
                  <button 
                    className="favorite-btn"
                    onClick={() => navigate(`/tours/${tour.tourId}`)}
                  >
                    ♥
                  </button>
                </div>
                <div className="tour-info">
                  <h3>{tour.name}</h3>
                  <div className="price-section">
                    <span className="price">Giá từ {tour.price.toLocaleString()}đ</span>
                    <button 
                      className="btn-tour-detail-dashboard"
                      onClick={() => navigate(`/tour-dashboard/detail/${tour.tourId}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
