import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaIdBadge, FaMapMarkedAlt, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import '../../styles/schedule/DetailSchedule.css';

const DetailSchedule = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState(null);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTours();
    }, []);

    useEffect(() => {
        if (scheduleId && tours.length > 0) {
            fetchSchedule();
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
            setTours([]);
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
            setSchedule(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTourName = (tourId) => {
        const tour = tours.find(t => t.tourId === tourId);
        return tour ? `${tour.name} - $${tour.price}` : `ID: ${tourId}`;
    };

    if (loading) {
        return <div className="schedule-detail-container">Đang tải...</div>;
    }

    if (!schedule) {
        return <div className="schedule-detail-container">Không tìm thấy lịch trình</div>;
    }

    return (
        <div className="schedule-detail-container">
            <div className="schedule-detail-header">
                <h2 className="schedule-detail-title">Chi Tiết Lịch Trình</h2>
                <div className="schedule-detail-actions">
                    <button 
                        className="schedule-detail-btn schedule-detail-btn-edit"
                        onClick={() => navigate(`/admin/schedules/edit/${scheduleId}`)}
                    >
                        Chỉnh Sửa
                    </button>
                    <button 
                        className="schedule-detail-btn schedule-detail-btn-back"
                        onClick={() => navigate('/admin/schedules')}
                    >
                        Quay Lại
                    </button>
                </div>
            </div>

            <div className="schedule-detail-card">
                <div className="schedule-detail-section">
                    <div className="schedule-detail-section-title">Thông Tin Cơ Bản</div>
                    <div className="schedule-detail-basicgrid">
                        <div className="schedule-detail-basicitem">
                            <FaIdBadge className="schedule-detail-basicicon" />
                            <div>
                                <div className="schedule-detail-basiclabel">Mã Lịch Trình</div>
                                <div className="schedule-detail-basicvalue">{schedule.scheduleId}</div>
                            </div>
                        </div>
                        <div className="schedule-detail-basicitem">
                            <FaMapMarkedAlt className="schedule-detail-basicicon" />
                            <div>
                                <div className="schedule-detail-basiclabel">Tour</div>
                                <div className="schedule-detail-basicvalue">{getTourName(schedule.tourId)}</div>
                            </div>
                        </div>
                        <div className="schedule-detail-basicitem">
                            <FaInfoCircle className="schedule-detail-basicicon" />
                            <div>
                                <div className="schedule-detail-basiclabel">Trạng Thái</div>
                                <div className="schedule-detail-basicvalue" style={{textTransform: 'capitalize'}}>{schedule.status}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="schedule-detail-section">
                    <div className="schedule-detail-section-title">Thời Gian</div>
                    <div className="schedule-detail-info">
                        <span className="schedule-detail-label">Ngày Bắt Đầu:</span> {formatDate(schedule.startDate)}
                    </div>
                    <div className="schedule-detail-info">
                        <span className="schedule-detail-label">Ngày Kết Thúc:</span> {formatDate(schedule.endDate)}
                    </div>
                </div>
                {/* <div className="schedule-detail-section">
                    <div className="schedule-detail-section-title">Lịch Trình Chi Tiết</div>
                    {schedule.itineraries && schedule.itineraries.length > 0 ? (
                        <div style={{overflowX: 'auto'}}>
                            <table className="schedule-detail-table">
                                <thead>
                                    <tr>
                                        <th>Tiêu Đề</th>
                                        <th>Giờ Bắt Đầu</th>
                                        <th>Giờ Kết Thúc</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedule.itineraries.map((itinerary) => (
                                        <tr key={itinerary.itineraryId}>
                                            <td>{itinerary.title}</td>
                                            <td>{formatTime(itinerary.startTime)}</td>
                                            <td>{formatTime(itinerary.endTime)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="schedule-detail-noitinerary">Không có lịch trình chi tiết cho lịch trình này.</div>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default DetailSchedule; 