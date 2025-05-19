import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateSchedule = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tourId: '',
        startDate: '',
        endDate: '',
        status: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (scheduleId) {
            fetchSchedule();
        } else {
            setError('Schedule ID is missing');
            setLoading(false);
        }
    }, [scheduleId]);

    const fetchSchedule = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/schedules/${scheduleId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const schedule = response.data;
            setFormData({
                tourId: schedule.tourId,
                startDate: new Date(schedule.startDate).toISOString().split('T')[0],
                endDate: new Date(schedule.endDate).toISOString().split('T')[0],
                status: schedule.status
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setError(error.response?.data?.message || 'Failed to fetch schedule');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            setLoading(false);
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
            const token = localStorage.getItem('token');
            const submitData = {
                ...formData,
                startDate: `${formData.startDate}T00:00:00`,
                endDate: `${formData.endDate}T23:59:59`
            };
            await axios.put(`/api/schedules/${scheduleId}`, submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/admin/schedules');
        } catch (error) {
            console.error('Error updating schedule:', error);
            setError(error.response?.data?.message || 'Failed to update schedule');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    };

    if (loading) {
        return <div className="container mt-4">Loading...</div>;
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
                <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/schedules')}
                >
                    Back to Schedules
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Edit Schedule</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Tour ID</label>
                        <input
                            type="number"
                            className="form-control"
                            name="tourId"
                            value={formData.tourId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="available">Available</option>
                            <option value="full">Full</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <button type="submit" className="btn btn-primary me-2">Update</button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin/schedules')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateSchedule; 