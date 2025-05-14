import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import vi from 'date-fns/locale/vi';
import 'react-calendar/dist/Calendar.css'
import '../styles/tour/TourDetailDashboard.css';
import '../styles/booking/BookingDashboard.css';

export default function TourDetailDashboard() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [message, setMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [relatedTours, setRelatedTours] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [expandedDestinations, setExpandedDestinations] = useState({});
  const [expandedEvents, setExpandedEvents] = useState({});

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

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
        
        // Fetch destination and event names for each itinerary
        const itinerariesWithDetails = await Promise.all(
          res.data.map(async (itinerary) => {
            // Handle destinations
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
                  } catch (err) {
                    console.error(`Error fetching destination ${dest.destinationId}:`, err);
                    return { ...dest, name: "Unknown Destination" };
                  }
                })
              );
            }

            // Handle events
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
                  } catch (err) {
                    console.error(`Error fetching event ${event.eventId}:`, err);
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

      if (!selectedDate) {
        setMessage('Vui lòng chọn ngày khởi hành');
        return;
      }

      const formattedDate = formatDate(selectedDate);
      if (!formattedDate) {
        setMessage('❌ Ngày không hợp lệ');
        return;
      }

      if (new Date(formattedDate) < new Date().setHours(0, 0, 0, 0)) {
        setMessage('❌ Không thể đặt tour cho ngày trong quá khứ');
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
        discountCode: discountCode.trim() || null,
        selectedDate: formattedDate
      };

      console.log('Sending booking request:', bookingRequest); // Add this for debugging

      const res = await axios.post('http://localhost:8080/api/bookings', bookingRequest, config);
      if (res.data && (res.data.bookingId || res.data.message)) {
        setMessage(`✅ ${res.data.message || 'Booking successful!'}`);
        // Navigate to BookingPassenger with necessary data
        navigate('/booking-passenger', { 
          state: { 
            bookingId: res.data.bookingId,
            tourInfo: tour,
            selectedDate: formattedDate,
            discountCode: discountCode,
            selectedDate: selectedDate
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
          <div className="info-row">
            <label>Destinations:</label>
            <span>{tour.destinations.map(dest => dest.name).join(', ')}</span>
          </div>
          <div className="info-row">
            <label>Events:</label>
            <span>{tour.events.map(ev => `${ev.name} (${new Date(ev.startDate).toLocaleDateString()})`).join(', ')}</span>
          </div>
        </div>


{/* Itinerary Section */}
        <div className="itinerary-section mb-8">
          <h2 className="text-2xl font-bold mb-4">LỊCH TRÌNH TOUR</h2>
          {itineraries.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6 text-center text-blue-700">Tour : {tour.name}</h3>
              {itineraries.sort((a, b) => a.dayNumber - b.dayNumber).map((itinerary) => (
                <div key={itinerary.itineraryId} className="bg-white shadow rounded-lg p-6">
                  
                  {/* Destinations */}
                  {itinerary.destinations && itinerary.destinations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-2">Điểm đến:</h4>
                      <div className="space-y-2">
                        {itinerary.destinations
                          .sort((a, b) => a.visitOrder - b.visitOrder)
                          .map((dest) => (
                            <div key={dest.destinationId} className="ml-4 p-3 border rounded-lg">
                              <div 
                                className="flex items-center gap-2 cursor-pointer" 
                                onClick={() => toggleDestination(dest.destinationId)}
                              >
                                <span className="text-blue-500 font-bold">Ngày : {dest.visitOrder}</span>
                                <span className="font-medium text-lg">  -   Điểm đến : {dest.name}</span>
                              </div>
                              {expandedDestinations[dest.destinationId] && (
                                <div className="mt-2 ml-6 text-gray-600">
                                  <p className="text-sm italic whitespace-pre-wrap" style={{marginLeft: '2rem'}}>
                                    {dest.note || "Không có chi tiết"}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Events */}
                  {itinerary.events && itinerary.events.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Sự kiện:</h4>
                      <div className="space-y-2">
                        {itinerary.events.map((event) => (
                          <div key={event.eventId} className="ml-4 p-3 border rounded-lg">
                            <div 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => toggleEvent(event.eventId)}
                             
                            >
                              <span className="text-green-500 font-bold"></span>
                              <span className="font-medium text-lg">    Sự kiện : {event.name}</span>
                            </div>
                            {expandedEvents[event.eventId] && (
                              <div className="mt-2 ml-6 text-gray-600">
                                <p className="text-sm">
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
                                    : "Chưa có thời gian cụ thể"
                                  }
                                </p>
                                <p className="text-sm mt-1 italic">
                                  <span className="font-medium"style={{marginLeft: '2rem'}}>Chi tiết: </span>
                                  {event.note || "Không có chi tiết"}
                                </p>
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


        {/* Booking Form */}
        <div className="booking-form">
          <h3>🧾 Book This Tour</h3>

          <div className="booking-row">
            <div className="form-group calendar">
              <label>Chọn ngày khởi hành:</label>
              <Calendar
                locale="vi"
                onChange={setSelectedDate}
                value={selectedDate}
                minDate={new Date()}
                tileClassName={({ date, view }) => {
                  if (view === 'month' && date.getDate() === 27 && date.getMonth() === 4) {
                    return 'highlight-price';
                  }
                }}
              />
            </div>

            <div className="form-group discount">
              <label>Mã giảm giá (nếu có):</label>
              <input
                type="text"
                placeholder="VD: NEWUSER10"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
            </div>
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

        

        {/* Related Tours Section */}
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
                  {/* <p>
                    <span className="location">🚩 Khởi hành: {tour.startLocation}</span>
                    <span className="code">Mã chương trình: {tour.tourCode}</span>
                  </p> */}
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
