import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

const ItineraryIndex = () => {
    const [itineraries, setItineraries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this itinerary?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/api/itineraries/${id}`, {
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
            }
        }
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
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Tour Itineraries</h2>
                <Link to="/admin/itineraries/add" className="btn btn-primary">
                    Add New Itinerary
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {itineraries.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    No itineraries found.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
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
                                        <Link 
                                            to={`/admin/itineraries/detail/${itinerary.itineraryId}`}
                                            className="btn btn-info btn-sm me-2"
                                        >
                                            View
                                        </Link>
                                        <Link 
                                            to={`/admin/itineraries/edit/${itinerary.itineraryId}`}
                                            className="btn btn-warning btn-sm me-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(itinerary.itineraryId)}
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
            )}
        </div>
    );
};

export default ItineraryIndex; 