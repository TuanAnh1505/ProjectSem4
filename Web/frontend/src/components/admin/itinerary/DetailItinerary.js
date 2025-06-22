import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/itinerary/DetailItinerary.css';
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaHourglassHalf } from 'react-icons/fa';

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
}

const DetailItinerary = () => {
    const { itineraryId } = useParams();
    const navigate = useNavigate();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItinerary();
    }, [itineraryId]);

    const fetchItinerary = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/itineraries/${itineraryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setItinerary(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching itinerary:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="detail-container">Loading...</div>;
    }

    if (!itinerary) {
        return <div className="detail-container">Itinerary not found</div>;
    }

    return (
        <div className="detail-container">
            <div className="detail-header">
                <h2>Chi Tiết Lịch Trình</h2>
                <div>
                    <button className="btn-edit" onClick={() => navigate(`/admin/itineraries/edit/${itineraryId}`)}>
                        <span><FaCalendarAlt style={{marginRight: 6}}/>Chỉnh Sửa</span>
                    </button>
                    <button className="btn-back" onClick={() => navigate('/admin/itineraries')}>
                        <span style={{fontWeight: 500}}>&larr;</span> Quay Lại Danh Sách
                    </button>
                </div>
            </div>
            <div className="detail-section detail-basic-info detail-basic-info-bg">
                <div className="section-title">Thông Tin Cơ Bản</div>
                <div className="basic-info-grid">
                    <div><span className="label">ID:</span> <b>{itinerary.itineraryId}</b></div>
                    <div><span className="label">Mã Lịch Trình:</span> <b>{itinerary.scheduleId}</b></div>
                    <div><span className="label">Tiêu Đề:</span> <b>{itinerary.title}</b></div>
                    <div><span className="label">Loại:</span> <span className="badge badge-type">Điểm đến</span></div>
                    <div><span className="label">Trạng Thái:</span> <span className="badge badge-status">Đã xác nhận</span></div>
                    <div><span className="label">Ngày Tạo:</span> <b>{itinerary.createdAt ? itinerary.createdAt.split('T')[0] : ''}</b></div>
                </div>
            </div>
            <div className="detail-section detail-time-info">
                <div className="section-title">Thời Gian</div>
                <div className="time-info-grid">
                    <div><FaClock className="icon"/> <span className="label">Giờ Bắt Đầu:</span> <b>{formatTime(itinerary.startTime)}</b></div>
                    <div><FaClock className="icon"/> <span className="label">Giờ Kết Thúc:</span> <b>{formatTime(itinerary.endTime)}</b></div>
                    <div><FaCalendarAlt className="icon"/> <span className="label">Ngày:</span> <b>{itinerary.date ? itinerary.date.split('T')[0] : ''}</b></div>
                    <div><FaHourglassHalf className="icon"/> <span className="label">Thời Lượng:</span> <b>{itinerary.duration || '2 giờ'}</b></div>
                </div>
            </div>
            <div className="detail-section detail-description">
                <div className="section-title">Mô Tả</div>
                <div className="description-box">{itinerary.description}</div>
            </div>
            <div className="detail-section detail-location">
                <div className="section-title">Địa Điểm</div>
                <div className="location-box">
                    <div className="location-title">
                        <FaMapMarkerAlt className="icon-location"/>
                        <b>{itinerary.location || 'Đèo Mã Pí Lèng, Hà Giang, Việt Nam'}</b>
                    </div>
                    {Array.isArray(itinerary.imageUrls) && itinerary.imageUrls.length > 0 ? (
                        <div className="location-img-list">
                            {itinerary.imageUrls.map((url, idx) => (
                                <img key={idx} className="location-img" src={url} alt={`location-${idx+1}`} />
                            ))}
                        </div>
                    ) : (
                        <img className="location-img" src={itinerary.imageUrl || 'https://media.vneconomy.vn/w800/images/upload/2023/10/10/ma-pi-leng-1.jpg'} alt="location" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailItinerary;