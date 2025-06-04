import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

import '../../styles/destination/DetailDestination.css';

// Reuse MediaPreview and MediaModal components from DestinationIndex
const MediaPreview = ({ filePath, onClick }) => {
    const isVideo = filePath.match(/\.(mp4|mov)$/i);
    return isVideo ? (
        <video
            src={`http://localhost:8080${filePath}`}
            className="media-preview"
            onClick={onClick}
        />
    ) : (
        <img
            src={`http://localhost:8080${filePath}`}
            alt="Preview"
            className="media-preview"
            onClick={onClick}
        />
    );
};

const MediaModal = ({ media, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    const currentMedia = media[currentIndex];
    const isVideo = currentMedia?.match(/\.(mp4|mov)$/i);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                {isVideo ? (
                    <video
                        src={`http://localhost:8080${currentMedia}`}
                        className="modal-media"
                        controls
                        autoPlay
                    />
                ) : (
                    <img
                        src={`http://localhost:8080${currentMedia}`}
                        alt={`Media ${currentIndex + 1}`}
                        className="modal-media"
                    />
                )}
                {media.length > 1 && (
                    <>
                        <button className="modal-nav-button prev" onClick={handlePrev}>‹</button>
                        <button className="modal-nav-button next" onClick={handleNext}>›</button>
                    </>
                )}
            </div>
        </div>
    );
};

const DetailEvent = () => {
    
    const [event, setEvent] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [error, setError] = useState(null);
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        if (event?.filePaths) {
            setCurrentImageIndex((prev) => 
                (prev + 1) % event.filePaths.length
            );
        }
    };

    const handlePrevImage = () => {
        if (event?.filePaths) {
            setCurrentImageIndex((prev) => 
                (prev - 1 + event.filePaths.length) % event.filePaths.length
            );
        }
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(`http://localhost:8080/api/events/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEvent(response.data);
            } catch (error) {
                console.error('Error details:', error);
                setError('Error loading destination. Please try again.');
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId, navigate]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!event) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div style={{ background: '#f6f7fb', minHeight: '100vh', padding: '32px 0' }}>
            <button
                className="back-button-green"
                onClick={() => navigate('/admin/event')}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 600, fontSize: 18, margin: '0 0 24px 48px', boxShadow: '0 2px 8px rgba(25,118,210,0.10)', cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#1253a2'}
                onMouseOut={e => e.currentTarget.style.background = '#1976d2'}
            >
                <FaArrowLeft style={{ fontSize: 20 }} /> Quay lại
            </button>
            <div className="event-detail-container" style={{ maxWidth: 600, margin: '32px auto', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', overflow: 'hidden' }}>
                {/* Ảnh lớn trên cùng */}
                {event.filePaths && event.filePaths.length > 0 && (
                    <div style={{ width: '100%', height: 260, overflow: 'hidden', background: '#eee' }}>
                        <MediaPreview
                            filePath={event.filePaths[0]}
                            onClick={() => setSelectedMedia(event.filePaths)}
                        />
                    </div>
                )}
                <div style={{ padding: '32px 32px 20px 32px' }}>
                    <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 8, fontFamily: 'serif', color: '#222' }}>Event Detail</h2>
                    <hr style={{ margin: '0 0 18px 0', border: 0, borderTop: '1.5px solid #eee' }} />
                    <h3 style={{ fontWeight: 700, fontSize: 26, marginBottom: 24, fontFamily: 'serif', color: '#222' }}>{event.name}</h3>
                    {/* Thông tin 2 cột */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 18 }}>
                        <div style={{ flex: 1, minWidth: 220 }}>
                            <div style={{ display: 'flex', marginBottom: 10 }}>
                                <span style={{ minWidth: 110, fontWeight: 600, color: '#555' }}>Name:</span>
                                <span style={{ color: '#222' }}>{event.name}</span>
                            </div>
                            <div style={{ display: 'flex', marginBottom: 10 }}>
                                <span style={{ minWidth: 110, fontWeight: 600, color: '#555' }}>Location:</span>
                                <span style={{ color: '#222' }}>{event.location}</span>
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: 220 }}>
                            <div style={{ display: 'flex', marginBottom: 10 }}>
                                <span style={{ minWidth: 110, fontWeight: 600, color: '#555' }}>Ticket Price:</span>
                                <span style={{ color: '#222' }}>{event.ticketPrice}</span>
                            </div>
                            <div style={{ display: 'flex', marginBottom: 10 }}>
                                <span style={{ minWidth: 110, fontWeight: 600, color: '#555' }}>Status Name:</span>
                                <span style={{ color: event.statusName === 'Active' ? '#388e3c' : '#bfa700', fontWeight: 600 }}>{event.statusName}</span>
                            </div>
                        </div>
                    </div>
                    <hr style={{ margin: '0 0 18px 0', border: 0, borderTop: '1.5px solid #eee' }} />
                    {/* Mô tả */}
                    <div>
                        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 18, color: '#222' }}>Description:</div>
                        <div style={{ color: '#222', lineHeight: 1.7 }}>{event.description}</div>
                    </div>
                </div>
                {selectedMedia && (
                    <MediaModal
                        media={selectedMedia}
                        onClose={() => setSelectedMedia(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default DetailEvent;
