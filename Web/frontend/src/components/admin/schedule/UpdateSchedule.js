import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkedAlt, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import '../../styles/schedule/UpdateSchedule.css';

const UpdateSchedule = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tourId: '',
        startDate: '',
        endDate: '',
        status: ''
    });
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchTours();
    }, []);

    useEffect(() => {
        if (scheduleId && tours.length > 0) {
            fetchSchedule();
        } else if (!scheduleId) {
            setError('Schedule ID is missing');
            setLoading(false);
        }
        // eslint-disable-next-line
    }, [scheduleId, tours]);

    const fetchTours = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/tours', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTours(response.data);
        } catch (error) {
            setError('Không thể tải danh sách tour');
        }
    };

    const fetchSchedule = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/schedules/${scheduleId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const schedule = response.data;
            setFormData({
                tourId: schedule.tourId,
                startDate: new Date(schedule.startDate).toISOString().split('T')[0],
                endDate: new Date(schedule.endDate).toISOString().split('T')[0],
                status: schedule.status
            });
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch schedule');
            setLoading(false);
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
            const token = localStorage.getItem('token');
            const submitData = {
                ...formData,
                startDate: `${formData.startDate}T00:00:00`,
                endDate: `${formData.endDate}T23:59:59`
            };
            await axios.put(`/api/schedules/${scheduleId}`, submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setShowSuccess(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update schedule');
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/admin/schedules');
    };

    if (loading) {
        return <div className="schedule-update-container">Loading...</div>;
    }

    if (error) {
        return (
            <div className="schedule-update-container">
                <div className="schedule-update-error"><FaInfoCircle /> {error}</div>
                <button 
                    className="schedule-update-btn"
                    onClick={() => navigate('/admin/schedules')}
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="schedule-update-container">
            <div className="schedule-update-header">
                <h2 className="schedule-update-title">Cập Nhật Lịch Trình</h2>
                <p className="schedule-update-subtitle">Chỉnh sửa thông tin lịch trình tour du lịch</p>
            </div>
            {error && <div className="schedule-update-error"><FaInfoCircle /> {error}</div>}
            <form onSubmit={handleSubmit} className="schedule-update-form">
                <div className="schedule-update-group">
                    <label className="schedule-update-label">
                        <FaMapMarkedAlt />
                        Chọn Tour
                    </label>
                    <select
                        className="schedule-update-select"
                        name="tourId"
                        value={formData.tourId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Chọn Tour --</option>
                        {tours.map(tour => (
                            <option key={tour.tourId} value={tour.tourId}>
                                {tour.name} - ${tour.price}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="schedule-update-group">
                    <label className="schedule-update-label">
                        <FaCalendarAlt />
                        Ngày Bắt Đầu
                    </label>
                    <input
                        type="date"
                        className="schedule-update-input"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="schedule-update-group">
                    <label className="schedule-update-label">
                        <FaCalendarAlt />
                        Ngày Kết Thúc
                    </label>
                    <input
                        type="date"
                        className="schedule-update-input"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="schedule-update-group">
                    <label className="schedule-update-label">
                        <FaInfoCircle />
                        Trạng Thái
                    </label>
                    <select
                        className="schedule-update-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="available">Available</option>
                        <option value="full">Full</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className="schedule-update-actions-row">
                    <button type="submit" className="schedule-update-btn">Cập Nhật</button>
                    <button 
                        type="button" 
                        className="schedule-update-btn schedule-update-btn-cancel"
                        onClick={() => navigate('/admin/schedules')}
                    >
                        Hủy
                    </button>
                </div>
            </form>
            {showSuccess && (
                <div className="schedule-success-overlay">
                    <div className="schedule-success-dialog">
                        <FaCheckCircle className="schedule-success-icon" />
                        <h3 className="schedule-success-title">Cập Nhật Thành Công!</h3>
                        <p className="schedule-success-message">
                            Lịch trình đã được cập nhật thành công. Bạn có thể xem danh sách lịch trình ngay bây giờ.
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

export default UpdateSchedule; 