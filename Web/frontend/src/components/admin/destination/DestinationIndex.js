import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import '../../styles/destination/DestinationIndex.css';

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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <div className="pagination">
            <button 
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &laquo;
            </button>
            
            {pages.map(page => (
                <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            
            <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                &raquo;
            </button>
        </div>
    );
};

const DestinationIndex = () => {

    const { t } = useTranslation();
    const [destinations, setDestinations] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        loadDestinations();
    }, []);

    const loadDestinations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/destinations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDestinations(response.data);
        } catch (error) {
            console.error('Error loading destinations:', error);
        }
    };

    const deleteDestination = async (id) => {
        if (window.confirm('Are you sure you want to delete this destination?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/destinations/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                loadDestinations();
            } catch (error) {
                console.error('Error deleting destination:', error);
            }
        }
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = destinations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(destinations.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container">
            <div className="header">
                <h2>{t("destination_title")}</h2>
                <Link to="/admin/destination/add" className="create-btn">
                    {t("create_destination")}
                </Link>
            </div>
            <table className="table">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>{t("file_paths")}</th>
                        <th>{t("name")}</th>
                        <th>{t("category")}</th>
                        <th>{t("destinations")}</th>
                        <th>{t("location")}</th>
                        <th>{t("rating")}</th>
                        <th>{t("actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(destination => (
                        <tr key={destination.destinationId}>
                            <td>{destination.destinationId}</td>
                            <td>
                                {destination.filePaths.length > 0 && (
                                    <div className="preview-container">
                                        <MediaPreview
                                            filePath={destination.filePaths[0]}
                                            onClick={() => setSelectedMedia(destination.filePaths)}
                                        />
                                        {destination.filePaths.length > 1 && (
                                            <span className="preview-count">
                                                {destination.filePaths.length - 1}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td>{destination.name}</td>
                            <td>{destination.category}</td>
                            <td>{destination.description}</td>
                            <td>{destination.location}</td>
                            <td>{destination.rating}</td>
                            <td>
                                <Link
                                    to={`/admin/destination/edit/${destination.destinationId}`}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    <i className="bi bi-pencil text-white"></i>
                                </Link>

                                <button onClick={() => deleteDestination(destination.destinationId)}
                                    className="btn btn-danger btn-sm">
                                    <i class="bi bi-trash"></i>

                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            
            {selectedMedia && (
                <MediaModal
                    media={selectedMedia}
                    onClose={() => setSelectedMedia(null)}
                />
            )}
        </div>
    );
};

export default DestinationIndex;
