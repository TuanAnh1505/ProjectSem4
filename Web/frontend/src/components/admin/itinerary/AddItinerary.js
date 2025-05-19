import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

const AddItinerary = () => {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [selectedTour, setSelectedTour] = useState('');
    const [tourSchedules, setTourSchedules] = useState([]);
    const [formData, setFormData] = useState({
        scheduleId: '',
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        type: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/tours`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTours(response.data);
        } catch (error) {
            console.error('Error fetching tours:', error);
            setError('Failed to load tours');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchTourSchedules = async (tourId) => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/schedules/tour/${tourId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTourSchedules(response.data);
        } catch (error) {
            console.error('Error fetching tour schedules:', error);
            setError('Failed to load tour schedules');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTourChange = async (e) => {
        const tourId = e.target.value;
        setSelectedTour(tourId);
        if (tourId) {
            await fetchTourSchedules(tourId);
        } else {
            setTourSchedules([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            
            // Validate form data
            if (!formData.scheduleId || !formData.title || !formData.startTime || !formData.endTime || !formData.type) {
                throw new Error('Please fill in all required fields');
            }

            // Validate time
            const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
            const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
            
            const startTotalMinutes = startHours * 60 + startMinutes;
            const endTotalMinutes = endHours * 60 + endMinutes;
            
            if (endTotalMinutes <= startTotalMinutes) {
                throw new Error('End time must be after start time');
            }

            const response = await axios.post(`${API_URL}/api/itineraries`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Created itinerary:', response.data);
            navigate('/admin/itineraries');
        } catch (error) {
            console.error('Error adding itinerary:', error);
            setError(error.response?.data?.message || error.message || 'Failed to add itinerary');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
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
            <h2>Add New Itinerary</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Select Tour</label>
                        <select
                            className="form-select"
                            value={selectedTour}
                            onChange={handleTourChange}
                            required
                        >
                            <option value="">Select a Tour</option>
                            {tours.map(tour => (
                                <option key={tour.tourId} value={tour.tourId}>
                                    {tour.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedTour && tourSchedules.length > 0 && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <h4>Available Schedules for this Tour</h4>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Schedule ID</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tourSchedules.map(schedule => (
                                            <tr key={schedule.scheduleId}>
                                                <td>{schedule.scheduleId}</td>
                                                <td>{new Date(schedule.startDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</td>
                                                <td>{new Date(schedule.endDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</td>
                                                <td>{schedule.status}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            scheduleId: schedule.scheduleId
                                                        }))}
                                                    >
                                                        Select
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {formData.scheduleId && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Start Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">End Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="DESTINATION">Destination</option>
                                    <option value="EVENT">Event</option>
                                    <option value="ACTIVITY">Activity</option>
                                    <option value="MEAL">Meal</option>
                                    <option value="TRANSPORT">Transport</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-4">
                    <button 
                        type="submit" 
                        className="btn btn-primary me-2"
                        disabled={!formData.scheduleId || loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin/itineraries')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddItinerary; 