import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/schedule/ScheduleIndex.css';
import { FaPlus, FaEye, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const ScheduleIndex = () => {
    const [schedules, setSchedules] = useState([]);
    const [tours, setTours] = useState({});
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({
        show: false,
        scheduleId: null,
        tourName: ''
    });

    useEffect(() => {
        fetchSchedules();
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/tours', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const tourMap = response.data.reduce((acc, tour) => {
                acc[tour.tourId] = tour.name;
                return acc;
            }, {});
            setTours(tourMap);
        } catch (error) {
            console.error('Error fetching tours:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    };

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/schedules', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (scheduleId, tourName) => {
        setDeleteDialog({
            show: true,
            scheduleId,
            tourName
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/schedules/${deleteDialog.scheduleId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchSchedules();
        } catch (error) {
            console.error('Error deleting schedule:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setDeleteDialog({ show: false, scheduleId: null, tourName: '' });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ show: false, scheduleId: null, tourName: '' });
    };

    if (loading) {
        return <div className="schedule-loading">Loading schedules...</div>;
    }

    return (
        <div className="schedule-container">
            <div className="schedule-header">
                <h2 className="schedule-title">Lịch trình tour</h2>
                <Link to="/admin/schedules/add" className="schedule-add-btn">
                    <FaPlus /> Tạo lịch trình
                </Link>
            </div>

            <div className="schedule-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tour Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule) => (
                            <tr key={schedule.scheduleId}>
                                <td>{schedule.scheduleId}</td>
                                <td>{tours[schedule.tourId] || 'Loading...'}</td>
                                <td>{new Date(schedule.startDate).toLocaleDateString()}</td>
                                <td>{new Date(schedule.endDate).toLocaleDateString()}</td>
                                <td>{schedule.status}</td>
                                <td>
                                    <div className="schedule-actions">
                                        <Link 
                                            to={`/admin/schedules/detail/${schedule.scheduleId}`}
                                            className="action-link"
                                        >🔍
                                            
                                        </Link>
                                        <Link 
                                            to={`/admin/schedules/edit/${schedule.scheduleId}`}
                                            className="action-link"
                                        >
                                           ✏️
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(schedule.scheduleId, tours[schedule.tourId])}
                                            className="delete-button"
                                            
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

            {deleteDialog.show && (
                <div className="schedule-delete-overlay">
                    <div className="schedule-delete-dialog">
                        <FaExclamationTriangle className="schedule-delete-icon" />
                        <h3 className="schedule-delete-title">Xóa Lịch Trình</h3>
                        <p className="schedule-delete-message">
                            Bạn có chắc chắn muốn xóa lịch trình cho tour "{deleteDialog.tourName}"? 
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className="schedule-delete-actions">
                            <button 
                                className="schedule-delete-cancel"
                                onClick={handleDeleteCancel}
                            >
                                Hủy
                            </button>
                            <button 
                                className="schedule-delete-confirm"
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

export default ScheduleIndex; 