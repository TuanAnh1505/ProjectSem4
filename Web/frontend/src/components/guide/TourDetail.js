import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TourDetail.css';

const TourDetail = ({ tourId, onClose }) => {
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTourDetails();
    }, [tourId]);

    const fetchTourDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/tours/${tourId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setTour(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching tour details:', err);
            setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="tour-detail-modal">
                <div className="tour-detail-content">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tour-detail-modal">
                <div className="tour-detail-content">
                    <div className="error-message">
                        <h3>Lỗi</h3>
                        <p>{error}</p>
                        <button onClick={fetchTourDetails} className="btn-primary">
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!tour) {
        return null;
    }

    return (
        <div className="tour-detail-modal" onClick={onClose}>
            <div className="tour-detail-content" onClick={e => e.stopPropagation()}>
                <div className="tour-detail-header">
                    <h2>{tour.name}</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="tour-detail-body">
                    <div className="tour-detail-main">
                        <div className="tour-detail-left">
                            {tour.imageUrls && tour.imageUrls.length > 0 ? (
                                <img 
                                    src={tour.imageUrls[0]} 
                                    alt={tour.name}
                                    className="tour-main-image"
                                    onError={(e) => { e.target.src = '/default-tour-image.jpg'; }}
                                />
                            ) : (
                                <div className="tour-no-image"><span>Không có hình ảnh</span></div>
                            )}
                        </div>

                        <div className="tour-detail-right">
                            <div className="info-card">
                                <div className="info-item">
                                    <span className="info-icon">💰</span>
                                    <div>
                                        <span className="info-label">Giá tour</span>
                                        <span className="info-value price">{formatPrice(tour.price)}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">⏳</span>
                                    <div>
                                        <span className="info-label">Thời gian</span>
                                        <span className="info-value">{tour.duration || 'N/A'} ngày</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">👥</span>
                                    <div>
                                        <span className="info-label">Số người tối đa</span>
                                        <span className="info-value">{tour.maxParticipants || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">📍</span>
                                    <div>
                                        <span className="info-label">Điểm khởi hành</span>
                                        <span className="info-value">{tour.departurePoint || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {tour.description && (
                                <div className="description-section">
                                    <h3>Mô tả chi tiết</h3>
                                    <p className="tour-description">{tour.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {(tour.destinations && tour.destinations.length > 0) || (tour.events && tour.events.length > 0) ? (
                        <div className="tour-detail-extra">
                            <h3>Hành trình & Sự kiện</h3>
                            <div className="extra-content">
                                {tour.destinations && tour.destinations.length > 0 && (
                                    <div className="destinations-list">
                                        <h4>Điểm đến nổi bật</h4>
                                        <ul>
                                            {tour.destinations.map((destination, index) => (
                                                <li key={index}>{destination.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {tour.events && tour.events.length > 0 && (
                                     <div className="events-list">
                                         <h4>Sự kiện đặc biệt</h4>
                                         <ul>
                                             {tour.events.map((event, index) => (
                                                 <li key={index}>{event.name}</li>
                                             ))}
                                         </ul>
                                     </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default TourDetail; 