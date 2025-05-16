import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItineraryIndex.css';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function ItineraryIndex() {
  const [itineraries, setItineraries] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);

  const navigate = useNavigate();

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
        if (err.response?.status === 401) navigate('/login');
      });
  }, [navigate]);

  useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/itineraries`);
        setItineraries(res.data);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
        setError(err.message);
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, [navigate, reload]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch trình này?')) {
      try {
        await axios.delete(`http://localhost:8080/api/itineraries/${id}`);
        setReload(prev => prev + 1);
      } catch (err) {
        console.error(err);
        alert('Không thể xóa lịch trình này');
      }
    }
  };

  const getTourName = (tourId) => {
    const tour = tours.find(t => t.tourId === tourId);
    return tour ? tour.name : "Không rõ";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return '';
    }
  };

  if (loading) return <div className="loading-text">Đang tải...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="itinerary-container">
      <div className="itinerary-header">
        <h2 className="itinerary-title">Danh sách lịch trình tour</h2>
        <Link to="/admin/itinerary/add" className="add-itinerary-btn">
          + Thêm lịch trình
        </Link>
      </div>

      <div className="itinerary-table-container">
        <table className="itinerary-table">
          <thead className="itinerary-table-header">
            <tr>
              <th>Tour</th>
              <th>Tiêu đề</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Điểm đến</th>
              <th>Sự kiện</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {itineraries.map(item => (
              <tr key={item.itineraryId} className="itinerary-table-row">
                <td className="itinerary-table-cell">{getTourName(item.tourId)}</td>
                <td className="itinerary-table-cell">{item.title || 'N/A'}</td>
                <td className="itinerary-table-cell">{formatDate(item.startDate)}</td>
                <td className="itinerary-table-cell">{formatDate(item.endDate)}</td>
                <td className="itinerary-table-cell">
                  {Array.isArray(item.destinations) ? item.destinations.length : 0} điểm
                </td>
                <td className="itinerary-table-cell">
                  {Array.isArray(item.events) ? item.events.length : 0} sự kiện
                </td>
                <td className="itinerary-table-cell">
                  <div className="itinerary-actions">
                    <Link
                      to={`/admin/itinerary/detail/${item.itineraryId}`}
                      className="itinerary-action-link"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      to={`/admin/itinerary/edit/${item.itineraryId}`}
                      className="itinerary-action-edit"
                      title="Chỉnh sửa"
                    >
                      <Pencil size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.itineraryId)}
                      className="itinerary-action-delete"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {itineraries.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  Không có lịch trình nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
