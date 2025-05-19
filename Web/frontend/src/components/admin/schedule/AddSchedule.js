import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddSchedule = () => {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [formData, setFormData] = useState({
        tourId: '',
        startDate: '',
        endDate: '',
        status: 'available'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/tours', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTours(response.data);
            } catch (error) {
                console.error('Error fetching tours:', error);
                setError('Failed to load tours');
            }
        };
        fetchTours();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate dates
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        if (endDate <= startDate) {
            setError('End date must be after start date');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            // Set time to start of day for start date and end of day for end date
            const submitData = {
                tourId: parseInt(formData.tourId),
                startDate: `${formData.startDate}T00:00:00`,
                endDate: `${formData.endDate}T23:59:59`,
                status: formData.status.toLowerCase()
            };

            console.log('Submitting data:', submitData);

            const response = await axios.post('/api/schedules', submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Server response:', response.data);
            navigate('/admin/schedules');
        } catch (error) {
            console.error('Error creating schedule:', error);
            console.error('Error details:', error.response?.data);
            setError(error.response?.data?.message || 'Failed to create schedule');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Add New Schedule</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Select Tour</label>
                    <select
                        className="form-select"
                        name="tourId"
                        value={formData.tourId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select a Tour --</option>
                        {tours.map(tour => (
                            <option key={tour.tourId} value={tour.tourId}>
                                {tour.name} - ${tour.price}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-3">
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

                <button type="submit" className="btn btn-primary">Create Schedule</button>
            </form>
        </div>
    );
};

export default AddSchedule; 