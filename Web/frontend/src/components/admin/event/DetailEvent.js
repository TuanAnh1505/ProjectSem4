import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        <div className="container">
            <Link to="/admin/event" className="back-button">
                Quay lại
            </Link>
            
            <div className="event-detail">
                
                
                <div className="media-section-detail">
                    {event.filePaths && event.filePaths.length > 0 && (
                        <div className="preview-container-detail">
                            <MediaPreview
                                filePath={event.filePaths[currentImageIndex]}
                                onClick={() => setSelectedMedia(event.filePaths)}
                            />
                            {event.filePaths.length > 1 && (
                                <div className="image-navigation">
                                    <button onClick={handlePrevImage} className="nav-button prev">
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                    <button onClick={handleNextImage} className="nav-button next">
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Name:</label>
                        <span>{event.name}</span>
                    </div>
                    <div className="info-item">
                        <label>Ticket Price:</label>
                        <span>{event.ticketPrice}</span>
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Location:</label>
                        <span>{event.location}</span>
                    </div>
                    <div className="info-item">
                        <label>Status Name:</label>
                        <span>{event.statusName}</span>
                    </div>
                </div>

                <div className="info-item-description">
                    <label>Description:</label>
                    <span>{event.description}</span>
                </div>
                
            </div>

            {selectedMedia && (
                <MediaModal
                    media={selectedMedia}
                    onClose={() => setSelectedMedia(null)}
                />
            )}
        </div>
    );
};

export default DetailEvent;
