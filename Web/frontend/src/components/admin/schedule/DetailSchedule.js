import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetailSchedule = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, [scheduleId]);

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
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="container mt-4">Loading...</div>;
    }

    if (!schedule) {
        return <div className="container mt-4">Schedule not found</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Schedule Details</h2>
                <div>
                    <button 
                        className="btn btn-warning me-2"
                        onClick={() => navigate(`/admin/schedules/edit/${scheduleId}`)}
                    >
                        Edit
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin/schedules')}
                    >
                        Back to List
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <h5 className="card-title">Basic Information</h5>
                            <p><strong>ID:</strong> {schedule.scheduleId}</p>
                            <p><strong>Tour ID:</strong> {schedule.tourId}</p>
                            <p><strong>Status:</strong> <span className="text-capitalize">{schedule.status}</span></p>
                        </div>
                        <div className="col-md-6">
                            <h5 className="card-title">Timing</h5>
                            <p><strong>Start Date:</strong> {formatDate(schedule.startDate)}</p>
                            <p><strong>End Date:</strong> {formatDate(schedule.endDate)}</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <h5 className="card-title">Itineraries</h5>
                            {schedule.itineraries && schedule.itineraries.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Start Time</th>
                                                <th>End Time</th>
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
                                <p>No itineraries found for this schedule.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailSchedule; 