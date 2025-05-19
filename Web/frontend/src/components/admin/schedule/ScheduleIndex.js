import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ScheduleIndex = () => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/schedules', {
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
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/schedules/${id}`, {
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
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Tour Schedules</h2>
                <Link to="/admin/schedules/add" className="btn btn-primary">
                    Add New Schedule
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tour ID</th>
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
                                <td>{schedule.tourId}</td>
                                <td>{new Date(schedule.startDate).toLocaleDateString()}</td>
                                <td>{new Date(schedule.endDate).toLocaleDateString()}</td>
                               
                                <td>{schedule.status}</td>
                                <td>
                                    <Link 
                                        to={`/admin/schedules/detail/${schedule.scheduleId}`}
                                        className="btn btn-info btn-sm me-2"
                                    >
                                        View
                                    </Link>
                                    <Link 
                                        to={`/admin/schedules/edit/${schedule.scheduleId}`}
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(schedule.scheduleId)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleIndex; 