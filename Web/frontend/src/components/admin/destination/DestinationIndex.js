import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {FaPlus, FaTrash, FaExclamationTriangle, FaEye, FaEdit } from 'react-icons/fa';
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
    const [destinations, setDestinations] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [deleteAlert, setDeleteAlert] = useState({ show: false, destinationId: null, destinationName: '' });

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

    const showDeleteAlert = (destinationId, destinationName) => {
        setDeleteAlert({ show: true, destinationId, destinationName });
    };

    const hideDeleteAlert = () => {
        setDeleteAlert({ show: false, destinationId: null, destinationName: '' });
    };

    const deleteDestination = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/destinations/delete/${deleteAlert.destinationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            loadDestinations();
            hideDeleteAlert();
        } catch (error) {
            console.error('Error deleting destination:', error);
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
        <div className="destination-index-container">
            <div className="header">
                <h2>Điểm đến</h2>
                <Link to="/admin/destination/add" className="create-btn">
                    <FaPlus /> Thêm điểm đến
                </Link>
            </div>
            <table className="destination-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(destination => (
                        <tr key={destination.destinationId}>
                            <td>{destination.destinationId}</td>
                            <td>
                                {(destination.filePaths && destination.filePaths.length > 0) && (
                                    <div className="preview-container">
                                        <MediaPreview
                                            filePath={(destination.filePaths || [])[0]}
                                            onClick={() => setSelectedMedia(destination.filePaths || [])}
                                        />
                                        {(destination.filePaths && destination.filePaths.length > 1) && (
                                            <span className="preview-count">
                                                {(destination.filePaths || []).length - 1}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td>{destination.name}</td>
                            <td>{destination.category}</td>
                            <td class="truncate">{destination.description}</td>
                            <td>{destination.location}</td>
                            <td>{destination.rating}</td>
                            <td>
                                <div className="action-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                    <Link
                                        to={`/admin/destination/detail/${destination.destinationId}`}
                                        className="action-link"
                                        title="Xem chi tiết"
                                        style={{ color: '#4a90e2', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <FaEye />
                                    </Link>
                                    <Link
                                        to={`/admin/destination/edit/${destination.destinationId}`}
                                        className="action-link"
                                        title="Chỉnh sửa"
                                        style={{ color: '#ffc107', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        className="delete-button"
                                        onClick={() => showDeleteAlert(destination.destinationId, destination.name)}
                                        title="Xóa"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
};

export default DestinationIndex;