import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeading, FaRegClock, FaListAlt, FaTag, FaCheckCircle } from 'react-icons/fa';
import '../../styles/itinerary/UpdateItinerary.css';

const UpdateItinerary = () => {
    const { itineraryId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        scheduleId: '',
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        type: ''
    });
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchItinerary();
    }, [itineraryId]);

    const fetchItinerary = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/itineraries/${itineraryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const itinerary = response.data;
            const extractTime = (val) => val ? val.substring(0, 5) : '';
            setFormData({
                scheduleId: itinerary.scheduleId,
                title: itinerary.title,
                description: itinerary.description || '',
                startTime: extractTime(itinerary.startTime),
                endTime: extractTime(itinerary.endTime),
                type: itinerary.type || ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching itinerary:', error);
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
            await axios.put(`/api/itineraries/${itineraryId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setShowSuccess(true);
        } catch (error) {
            console.error('Error updating itinerary:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/admin/itineraries');
    };

    if (loading) {
        return <div className="itinerary-update-container">Loading...</div>;
    }

    return (
        <div className="itinerary-update-container">
            <div className="itinerary-update-header">
                <h2 className="itinerary-update-title">Edit Itinerary</h2>
            </div>
            <form onSubmit={handleSubmit} className="itinerary-update-form">
                
                <div className="itinerary-form-group">
                    <label className="itinerary-form-label">
                        <FaTag style={{ marginRight: 8 }} />Schedule ID
                    </label>
                    <div style={{
                        padding: '0.875rem 1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        color: '#1e293b',
                        fontWeight: 600,
                        fontSize: '1.05rem',
                        letterSpacing: '0.5px',
                        marginBottom: '0.5rem'
                    }}>{formData.scheduleId}</div>
                </div>
                
                <div className="itinerary-form-group">
                    <label className="itinerary-form-label">
                        <FaHeading style={{ marginRight: 8 }} />Title
                        <span className="itinerary-form-desc">Edit the title for this itinerary.</span>
                    </label>
                    <input
                        type="text"
                        className="itinerary-form-input"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Visit Sapa Market"
                        required
                    />
                </div>

                <div className="itinerary-form-group">
                    <label className="itinerary-form-label">
                        <FaListAlt style={{ marginRight: 8 }} />Description
                        <span className="itinerary-form-desc">(Optional) Add more details for this itinerary.</span>
                    </label>
                    <textarea
                        className="itinerary-form-textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="e.g. Explore the local market, try street food, buy souvenirs..."
                    />
                </div>

                <div className="itinerary-form-group itinerary-form-row">
                    <div className="itinerary-form-col">
                        <label className="itinerary-form-label">
                            <FaRegClock style={{ marginRight: 8 }} />Start Time
                            <span className="itinerary-form-desc">When does this activity begin?</span>
                        </label>
                        <input
                            type="time"
                            className="itinerary-form-input"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="itinerary-form-col">
                        <label className="itinerary-form-label">
                            <FaRegClock style={{ marginRight: 8 }} />End Time
                            <span className="itinerary-form-desc">When does this activity end?</span>
                        </label>
                        <input
                            type="time"
                            className="itinerary-form-input"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="itinerary-form-group">
                    <label className="itinerary-form-label">
                        <FaTag style={{ marginRight: 8 }} />Type
                        <span className="itinerary-form-desc">Select the type of this itinerary item.</span>
                    </label>
                    <select
                        className="itinerary-form-select"
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

                <div className="itinerary-submit-row">
                    <button type="submit" className="itinerary-submit-btn">Update</button>
                    <button
                        type="button"
                        className="itinerary-submit-btn itinerary-cancel-btn"
                        onClick={() => navigate('/admin/itineraries')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            {showSuccess && (
                <div className="schedule-success-overlay">
                    <div className="schedule-success-dialog">
                        <FaCheckCircle className="schedule-success-icon" />
                        <h3 className="schedule-success-title">Update Successful!</h3>
                        <p className="schedule-success-message">
                            The itinerary has been updated successfully. You can now view the itinerary list.
                        </p>
                        <button
                            className="schedule-success-button"
                            onClick={handleSuccessClose}
                        >
                            View List
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateItinerary; 