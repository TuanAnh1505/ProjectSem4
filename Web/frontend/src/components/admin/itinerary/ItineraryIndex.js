import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEye, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/itinerary/ItineraryIndex.css';

const API_URL = 'http://localhost:8080';

const ItineraryIndex = () => {
    const [itineraries, setItineraries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({ show: false, itineraryId: null, itineraryTitle: '' });

    useEffect(() => {
        fetchItineraries();
    }, []);

    const fetchItineraries = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/itineraries`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Fetched itineraries:', response.data);
            setItineraries(response.data);
        } catch (error) {
            console.error('Error fetching itineraries:', error);
            setError('Failed to fetch itineraries. Please try again later.');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id, title) => {
        setDeleteDialog({ show: true, itineraryId: id, itineraryTitle: title });
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/itineraries/${deleteDialog.itineraryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchItineraries();
        } catch (error) {
            console.error('Error deleting itinerary:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setDeleteDialog({ show: false, itineraryId: null, itineraryTitle: '' });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ show: false, itineraryId: null, itineraryTitle: '' });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        try {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            console.error('Error formatting time:', error);
            return timeString;
        }
    };

    if (loading) {
        return <div className="itinerary-loading">Loading itineraries...</div>;
    }

    return (
        <div className="itinerary-container">
            <div className="itinerary-header">
                <h2 className="itinerary-title">Tour Itineraries</h2>
                <Link to="/admin/itineraries/add" className="itinerary-add-btn">
                    <FaPlus /> Tạo lịch trình chi tiết
                </Link>
            </div>

            {error && (
                <div className="itinerary-form-error" role="alert">
                    {error}
                </div>
            )}

            {itineraries.length === 0 ? (
                <div className="itinerary-form-info" role="alert">
                    No itineraries found.
                </div>
            ) : (
                <div className="itinerary-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Schedule ID</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itineraries.map((itinerary) => (
                                <tr key={itinerary.itineraryId}>
                                    <td>{itinerary.itineraryId}</td>
                                    <td>{itinerary.scheduleId}</td>
                                    <td>{itinerary.title}</td>
                                    <td>{itinerary.type}</td>
                                    <td>{formatTime(itinerary.startTime)}</td>
                                    <td>{formatTime(itinerary.endTime)}</td>
                                    <td>
                                        <div className="itinerary-actions" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                            <Link
                                                to={`/admin/itineraries/detail/${itinerary.itineraryId}`}
                                                className="action-link"
                                                title="Xem chi tiết"
                                                style={{ color: '#4a90e2', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                to={`/admin/itineraries/edit/${itinerary.itineraryId}`}
                                                className="action-link"
                                                title="Chỉnh sửa"
                                                style={{ color: '#ffc107', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(itinerary.itineraryId, itinerary.title)}
                                                className="delete-button"
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
                </div>
            )}

            {deleteDialog.show && (
                <div className="itinerary-delete-overlay">
                    <div className="itinerary-delete-dialog">
                        <FaExclamationTriangle className="itinerary-delete-icon" />
                        <h3 className="itinerary-delete-title">Xóa Lịch Trình Tour</h3>
                        <p className="itinerary-delete-message">
                            Bạn có chắc chắn muốn xóa lịch trình "{deleteDialog.itineraryTitle}"? Hành động này không thể hoàn tác.
                        </p>
                        <div className="itinerary-delete-actions">
                            <button
                                className="itinerary-delete-cancel"
                                onClick={handleDeleteCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className="itinerary-delete-confirm"
                                onClick={handleDeleteConfirm}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItineraryIndex; 