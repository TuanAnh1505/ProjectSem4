import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ItineraryIndex() {
  const [itineraries, setItineraries] = useState([]);
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();
  const tourId = localStorage.getItem("selectedTourId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/tours")
      .then(res => setTours(res.data))
      .catch(err => {
        console.error("Error loading tours:", err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      });
  }, [navigate]);

  useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/itineraries`);
        console.log('Raw itineraries data:', res.data);
        setItineraries(res.data);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
        setError(err.message);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [navigate, reload]); // Add reload dependency

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch trình này?')) {
      try {
        await axios.delete(`http://localhost:8080/api/itineraries/${id}`);
        setReload(prev => prev + 1); // Trigger reload after delete
      } catch (err) {
        console.error(err);
        alert('Không thể xóa lịch trình này');
      }
    }
  };

  const getTourName = (tourId) => {
    const tour = tours.find(t => t.tourId === tourId);
    return tour ? tour.name : "Unknown Tour";
  };

  if (loading) return <div className="text-center py-4">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lịch trình Tour</h2>
        <Link 
          to="/admin/itinerary/add" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thêm lịch trình
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left">Tour</th>
             
              <th className="px-6 py-3 border-b text-left">Tiêu đề</th>
              <th className="px-6 py-3 border-b text-left">Mô tả</th>
              <th className="px-6 py-3 border-b text-left">Điểm đến</th>
              <th className="px-6 py-3 border-b text-left">Sự kiện</th>
              <th className="px-6 py-3 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {itineraries.map(item => (
              <tr key={item.itineraryId} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{getTourName(item.tourId)}</td>
                <td className="px-6 py-4 border-b">{item.title || 'N/A'}</td>
                <td className="px-6 py-4 border-b">
                  {item.description?.length > 50 
                    ? `${item.description.substring(0, 50)}...` 
                    : item.description || 'N/A'}
                </td>
                <td className="px-6 py-4 border-b">
                  {Array.isArray(item.destinations) ? item.destinations.length : 0} điểm đến
                </td>
                <td className="px-6 py-4 border-b">
                  {Array.isArray(item.events) ? item.events.length : 0} sự kiện
                </td>
                <td className="px-6 py-4 border-b text-center">
                  <div className="flex justify-center gap-2">
                    <Link 
                      to={`/admin/itinerary/detail/${item.itineraryId}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Chi tiết
                    </Link>
                    <span>|</span>
                    <Link 
                      to={`/admin/itinerary/edit/${item.itineraryId}`}
                      className="text-green-500 hover:text-green-700"
                    >
                      Sửa
                    </Link>
                    <span>|</span>
                    <button 
                      onClick={() => handleDelete(item.itineraryId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
