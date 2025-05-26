import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkedAlt, FaInfoCircle } from 'react-icons/fa';
import '../../styles/schedule/AddSchedule.css';

const AddSchedule = () => {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [formData, setFormData] = useState({
        tourId: '',
        startDate: '',
        endDate: '',
        status: 'available'
    });
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/tours', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTours(response.data);
            } catch (error) {
                console.error('Error fetching tours:', error);
                setError('Không thể tải danh sách tour. Vui lòng thử lại sau.');
            }
        };
        fetchTours();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate dates
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        if (endDate <= startDate) {
            setError('Ngày kết thúc phải sau ngày bắt đầu');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            const submitData = {
                tourId: parseInt(formData.tourId),
                startDate: `${formData.startDate}T00:00:00`,
                endDate: `${formData.endDate}T23:59:59`,
                status: formData.status.toLowerCase()
            };

            await axios.post('http://localhost:8080/api/schedules', submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setShowSuccess(true);
        } catch (error) {
            console.error('Error creating schedule:', error);
            setError(error.response?.data?.message || 'Không thể tạo lịch trình. Vui lòng thử lại sau.');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/admin/schedules');
    };

    return (
        <div className="schedule-add-container">
            <div className="schedule-add-header">
                <h2 className="schedule-add-title">Thêm Lịch Trình Mới</h2>
                <p className="schedule-add-subtitle">Tạo lịch trình mới cho tour du lịch của bạn</p>
            </div>
            
            {error && (
                <div className="schedule-form-error">
                    <FaInfoCircle />
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="schedule-add-form">
                <div className="schedule-form-group">
                    <label className="schedule-form-label">
                        <FaMapMarkedAlt />
                        Chọn Tour
                    </label>
                    <select
                        className="schedule-form-select"
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

                <div className="schedule-form-group">
                    <label className="schedule-form-label">
                        <FaCalendarAlt />
                        Ngày Bắt Đầu
                    </label>
                    <input
                        type="date"
                        className="schedule-form-input"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="schedule-form-group">
                    <label className="schedule-form-label">
                        <FaCalendarAlt />
                        Ngày Kết Thúc
                    </label>
                    <input
                        type="date"
                        className="schedule-form-input"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="schedule-form-group">
                    <label className="schedule-form-label">
                        <FaInfoCircle />
                        Trạng Thái
                    </label>
                    <select
                        className="schedule-form-select"
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

                <button type="submit" className="schedule-submit-btn">Tạo Lịch Trình</button>
            </form>

            {showSuccess && (
                <div className="schedule-success-overlay">
                    <div className="schedule-success-dialog">
                        <FaCheckCircle className="schedule-success-icon" />
                        <h3 className="schedule-success-title">Thành Công!</h3>
                        <p className="schedule-success-message">
                            Lịch trình đã được tạo thành công. Bạn có thể xem danh sách lịch trình ngay bây giờ.
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

export default AddSchedule; 