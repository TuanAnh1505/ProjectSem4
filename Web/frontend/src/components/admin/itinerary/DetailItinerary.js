import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DetailItinerary() {
  const { itineraryId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [tourName, setTourName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Fetch itinerary and populate destinations/events names
    axios.get(`http://localhost:8080/api/itineraries/${itineraryId}`)
      .then(async res => {
        const itineraryData = res.data;
        
        // Fetch tour name
        try {
          const tourRes = await axios.get(`http://localhost:8080/api/tours/${itineraryData.tourId}`);
          setTourName(tourRes.data.name);
        } catch (err) {
          console.error("Error loading tour:", err);
        }

        // Fetch destinations names
        if (itineraryData.destinations) {
          const destinationsWithNames = await Promise.all(
            itineraryData.destinations.map(async dest => {
              try {
                const destRes = await axios.get(`http://localhost:8080/api/destinations/${dest.destinationId}`);
                return { ...dest, name: destRes.data.name };
              } catch (err) {
                console.error("Error loading destination:", err);
                return { ...dest, name: "Unknown Destination" };
              }
            })
          );
          itineraryData.destinations = destinationsWithNames;
        }

        // Fetch events names
        if (itineraryData.events) {
          const eventsWithNames = await Promise.all(
            itineraryData.events.map(async event => {
              try {
                const eventRes = await axios.get(`http://localhost:8080/api/events/${event.eventId}`);
                return { ...event, name: eventRes.data.name };
              } catch (err) {
                console.error("Error loading event:", err);
                return { ...event, name: "Unknown Event" };
              }
            })
          );
          itineraryData.events = eventsWithNames;
        }

        setItinerary(itineraryData);
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      });
  }, [itineraryId, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc muốn xóa lịch trình này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/itineraries/${itineraryId}`);
        navigate("/admin/itinerary");
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!itinerary) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl">Đang tải...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Chi tiết lịch trình</h2>
        <div className="space-x-2">
          <Link 
            to="/admin/itinerary" 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Quay lại
          </Link>
          <Link 
            to={`/admin/itinerary/edit/${itineraryId}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            ✎ Sửa
          </Link>
          <button 
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            🗑 Xóa
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Thông tin chung</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Tour:</p>
                  <p className="font-medium">{tourName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Tiêu đề:</p>
                  <p className="font-medium">{itinerary.title}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Mô tả:</p>
                  <p className="font-medium">{itinerary.description}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Điểm đến</h3>
              {itinerary.destinations && itinerary.destinations.length > 0 ? (
                <div className="space-y-4">
                  {itinerary.destinations.map((dest, index) => (
                    <div key={dest.destinationId} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{dest.name}</p>
                          <p className="text-sm text-gray-600">Thứ tự thăm quan: {dest.visitOrder}</p>
                        </div>
                      </div>
                      {dest.note && (
                        <p className="mt-2 text-gray-600">
                          Chi tiết: {dest.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Chưa có điểm đến nào</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Sự kiện</h3>
              {itinerary.events && itinerary.events.length > 0 ? (
                <div className="space-y-4">
                  {itinerary.events.map((event, index) => (
                    <div key={event.eventId} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-gray-600">
                            Thời gian: {new Date(event.attendTime).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      {event.note && (
                        <p className="mt-2 text-gray-600">
                          Chi tiết: {event.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Chưa có sự kiện nào</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
