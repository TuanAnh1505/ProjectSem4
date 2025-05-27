import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeading, FaRegClock, FaListAlt, FaTag, FaCheckCircle } from 'react-icons/fa';
import '../../styles/itinerary/AddItinerary.css';

const API_URL = 'http://localhost:8080';

const AddItinerary = () => {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [selectedTour, setSelectedTour] = useState('');
    const [tourSchedules, setTourSchedules] = useState([]);
    const [formData, setFormData] = useState({
        scheduleId: '',
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        type: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/tours`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTours(response.data);
        } catch (error) {
            setError('Failed to load tours');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchTourSchedules = async (tourId) => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/schedules/tour/${tourId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTourSchedules(response.data);
        } catch (error) {
            setError('Failed to load tour schedules');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTourChange = async (e) => {
        const tourId = e.target.value;
        setSelectedTour(tourId);
        if (tourId) {
            await fetchTourSchedules(tourId);
        } else {
            setTourSchedules([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!formData.scheduleId || !formData.title || !formData.startTime || !formData.endTime || !formData.type) {
                throw new Error('Please fill in all required fields');
            }
            const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
            const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
            const startTotalMinutes = startHours * 60 + startMinutes;
            const endTotalMinutes = endHours * 60 + endMinutes;
            if (endTotalMinutes <= startTotalMinutes) {
                throw new Error('End time must be after start time');
            }
            await axios.post(`${API_URL}/api/itineraries`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setShowSuccess(true);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to add itinerary');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/admin/itineraries');
    };

    if (loading) {
        return <div className="itinerary-add-container">Đang tải...</div>;
    }

    return (
        <div className="itinerary-add-container">
            <div className="itinerary-add-header">
                <h2 className="itinerary-add-title">Thêm Lịch Trình Tour Mới</h2>
            </div>
            {error && <div className="itinerary-form-error">{error}</div>}
            <form onSubmit={handleSubmit} className="itinerary-add-form">
                <div className="itinerary-form-group">
                    <label className="itinerary-form-label">Chọn Tour</label>
                    <select
                        className="itinerary-form-select"
                        value={selectedTour}
                        onChange={handleTourChange}
                        required
                    >
                        <option value="">Chọn tour</option>
                        {tours.map(tour => (
                            <option key={tour.tourId} value={tour.tourId}>
                                {tour.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedTour && tourSchedules.length > 0 && (
                    <div className="itinerary-form-group">
                        <label className="itinerary-form-label">Chọn Lịch Trình</label>
                        <table className="itinerary-schedule-table">
                            <thead>
                                <tr>
                                    <th>Schedule ID</th>
                                    <th>Ngày Bắt Đầu</th>
                                    <th>Ngày Kết Thúc</th>
                                    <th>Trạng Thái</th>
                                    <th>Chọn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tourSchedules.map(schedule => (
                                    <tr key={schedule.scheduleId}>
                                        <td>{schedule.scheduleId}</td>
                                        <td>{new Date(schedule.startDate).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</td>
                                        <td>{new Date(schedule.endDate).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</td>
                                        <td>{schedule.status}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="itinerary-submit-btn"
                                                style={{padding: '0.5rem 1rem', fontSize: '0.95rem', minWidth: 0}}
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    scheduleId: schedule.scheduleId
                                                }))}
                                            >
                                                Chọn
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {formData.scheduleId && (
                    <>
                        <div className="itinerary-form-group">
                            <label className="itinerary-form-label">
                                <FaHeading style={{ marginRight: 8 }} />Title
                                <span className="itinerary-form-desc">Enter a short, descriptive title for this itinerary.</span>
                            </label>
                            <input
                                type="text"
                                className={`itinerary-form-input${error && !formData.title ? ' itinerary-form-input-error' : ''}`}
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Visit Sapa Market"
                                required
                            />
                        </div>

                        <div className="itinerary-form-group">
                            <label className="itinerary-form-label">
                                <FaListAlt style={{ marginRight: 8 }} />Description
                                <span className="itinerary-form-desc">(Optional) Add more details for this itinerary.</span>
                            </label>
                            <textarea
                                className="itinerary-form-textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="e.g. Explore the local market, try street food, buy souvenirs..."
                            />
                        </div>

                        <div className="itinerary-form-group itinerary-form-row">
                            <div className="itinerary-form-col">
                                <label className="itinerary-form-label">
                                    <FaRegClock style={{ marginRight: 8 }} />Start Time
                                    <span className="itinerary-form-desc">When does this activity begin?</span>
                                </label>
                                <input
                                    type="time"
                                    className={`itinerary-form-input${error && !formData.startTime ? ' itinerary-form-input-error' : ''}`}
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="itinerary-form-col">
                                <label className="itinerary-form-label">
                                    <FaRegClock style={{ marginRight: 8 }} />End Time
                                    <span className="itinerary-form-desc">When does this activity end?</span>
                                </label>
                                <input
                                    type="time"
                                    className={`itinerary-form-input${error && !formData.endTime ? ' itinerary-form-input-error' : ''}`}
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="itinerary-form-group">
                            <label className="itinerary-form-label">
                                <FaTag style={{ marginRight: 8 }} />Type
                                <span className="itinerary-form-desc">Select the type of this itinerary item.</span>
                            </label>
                            <select
                                className={`itinerary-form-select${error && !formData.type ? ' itinerary-form-input-error' : ''}`}
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="DESTINATION">Destination</option>
                                <option value="EVENT">Event</option>
                                <option value="ACTIVITY">Activity</option>
                                <option value="MEAL">Meal</option>
                                <option value="TRANSPORT">Transport</option>
                            </select>
                        </div>
                    </>
                )}

                <div className="itinerary-submit-row">
                    <button
                        type="submit"
                        className="itinerary-submit-btn"
                        disabled={!formData.scheduleId || loading}
                    >
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button
                        type="button"
                        className="itinerary-submit-btn itinerary-cancel-btn"
                        onClick={() => navigate('/admin/itineraries')}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                </div>
            </form>
            {showSuccess && (
                <div className="schedule-success-overlay">
                    <div className="schedule-success-dialog">
                        <FaCheckCircle className="schedule-success-icon" />
                        <h3 className="schedule-success-title">Thêm Lịch Trình Thành Công!</h3>
                        <p className="schedule-success-message">
                            Lịch trình đã được thêm thành công. Bạn có thể xem danh sách lịch trình ngay bây giờ.
                        </p>
                        <button
                            className="schedule-success-button"
                            onClick={handleSuccessClose}
                        >
                            Xem Danh Sách
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddItinerary; 