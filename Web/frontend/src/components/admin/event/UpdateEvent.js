import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/event/AddEvent.css';
import { FaArrowLeft } from 'react-icons/fa';

const UpdateEvent = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [event, setEvent] = useState({
        name: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        ticketPrice: '',
        statusName: '',
        filePaths: []
    });
    const [statusOptions, setStatusOptions] = useState([]);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'];
    // const maxFileSize = 10 * 1024 * 1024; // 10MB
    // const maxFiles = 5;

    const loadEventData = useCallback(async () => {
        if (!eventId) {
            setError('No event ID provided');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            // Fetch event statuses
            const statusResponse = await axios.get('http://localhost:8080/api/events/event-statuses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStatusOptions(statusResponse.data);

            // Fetch event details
            const eventResponse = await axios.get(`http://localhost:8080/api/events/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const eventData = eventResponse.data;
            
            // Format dates for datetime-local input
            setEvent({
                ...eventData,
                startDate: eventData.startDate.slice(0, 16),
                endDate: eventData.endDate.slice(0, 16)
            });

            // Set preview URLs for existing files
            if (eventData.filePaths) {
                setPreviewUrls(eventData.filePaths.map(path => 
                    path.startsWith('http') ? path : `http://localhost:8080${path}`
                ));
            }
        } catch (error) {
            console.error('Error loading event:', error);
            setError(error.response?.data?.message || 'Failed to load event');
            navigate('/admin/event');
        }
    }, [eventId, navigate]);

    useEffect(() => {   
        loadEventData();
    }, [loadEventData]);

    // ... rest of utility functions from UpdateDestination ...

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setError(null);
        setFieldErrors({});
        

        // Generate preview URLs
        const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setFiles(selectedFiles);
        setPreviewUrls(newPreviewUrls);
    };

    const handleDeleteFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            
            // Append all event data
            Object.keys(event).forEach(key => {
                if (key !== 'filePaths') {
                    formData.append(key, event[key]);
                }
            });

            // Append new files if any
            if (files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }

            await axios.put(`http://localhost:8080/api/events/${eventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/admin/event');
        } catch (error) {
            console.error('Error updating event:', error);
            setError(error.response?.data?.message || 'Failed to update event');
            setFieldErrors(error.response?.data || {});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ background: '#f6f7fb', minHeight: '100vh', padding: '32px 0' }}>
            <button
                className="back-button-green"
                onClick={() => navigate('/admin/event')}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 600, fontSize: 18, margin: '0 0 24px 48px', boxShadow: '0 2px 8px rgba(25,118,210,0.10)', cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#1253a2'}
                onMouseOut={e => e.currentTarget.style.background = '#1976d2'}
            >
                <FaArrowLeft style={{ fontSize: 20 }} /> Quay lại
            </button>
            <div className="add-event-container">
                <h2 className="form-title">Update Event</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="event-form-row">
                        <div className="event-form-group">
                            <label className="form-label">Event Name</label>
                            <input
                                type="text"
                                className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                                name="name"
                                value={event.name}
                                onChange={(e) => setEvent({ ...event, name: e.target.value })}
                                required
                            />
                            {fieldErrors.name && <div className="error-message">{fieldErrors.name}</div>}
                        </div>

                        <div className="event-form-group">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                className={`form-input ${fieldErrors.location ? 'error' : ''}`}
                                name="location"
                                value={event.location}
                                onChange={(e) => setEvent({ ...event, location: e.target.value })}
                                required
                            />
                            {fieldErrors.location && <div className="error-message">{fieldErrors.location}</div>}
                        </div>
                    </div>

                    <div className="event-form-row">
                        <div className="event-form-group">
                            <label className="form-label">Start Date</label>
                            <input
                                type="datetime-local"
                                className={`form-input ${fieldErrors.startDate ? 'error' : ''}`}
                                name="startDate"
                                value={event.startDate}
                                onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
                                required
                            />
                            {fieldErrors.startDate && <div className="error-message">{fieldErrors.startDate}</div>}
                        </div>

                        <div className="event-form-group">
                            <label className="form-label">End Date</label>
                            <input
                                type="datetime-local"
                                className={`form-input ${fieldErrors.endDate ? 'error' : ''}`}
                                name="endDate"
                                value={event.endDate}
                                onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
                                required
                            />
                            {fieldErrors.endDate && <div className="error-message">{fieldErrors.endDate}</div>}
                        </div>
                    </div>

                    <div className="event-form-row">
                        <div className="event-form-group">
                            <label className="form-label">Ticket Price</label>
                            <input
                                type="number"
                                className={`form-input ${fieldErrors.ticketPrice ? 'error' : ''}`}
                                name="ticketPrice"
                                value={event.ticketPrice}
                                onChange={(e) => setEvent({ ...event, ticketPrice: e.target.value })}
                                min="0"
                                step="0.01"
                            />
                            {fieldErrors.ticketPrice && <div className="error-message">{fieldErrors.ticketPrice}</div>}
                        </div>

                        <div className="event-form-group">
                            <label className="form-label">Status</label>
                            <select
                                className={`form-input ${fieldErrors.statusName ? 'error' : ''}`}
                                name="statusName"
                                value={event.statusName}
                                onChange={(e) => setEvent({ ...event, statusName: e.target.value })}
                                required
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map(status => (
                                    <option key={status.eventStatusId} value={status.statusName}>
                                        {status.statusName}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.statusName && <div className="error-message">{fieldErrors.statusName}</div>}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Description</label>
                        <textarea
                            className={`event-form-input ${fieldErrors.description ? 'error' : ''}`}
                            name="description"
                            value={event.description}
                            onChange={(e) => setEvent({ ...event, description: e.target.value })}
                            rows="4"
                            style={{
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word'
                            }}
                        />
                        {fieldErrors.description && <div className="error-message">{fieldErrors.description}</div>}
                    </div>

                    <div className="update-destination-form-group">
                        <div className="file-input-container">
                            <label htmlFor="files" className="file-input-label">
                                Choose Images/Videos
                            </label>
                            <input
                                id="files"
                                type="file"
                                className="file-input"
                                onChange={handleFileChange}
                                multiple
                                accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime"
                            />
                        </div>
                    </div>

                    {previewUrls.length > 0 && (
                        <div className="preview-container-add">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="preview-item">
                                    <button 
                                        type="button"
                                        className="delete-preview"
                                        onClick={() => handleDeleteFile(index)}
                                    >
                                        ×
                                    </button>
                                    {files[index]?.type.startsWith('image/') || url.match(/\.(jpg|jpeg|png)$/i) ? (
                                        <img src={url} alt={`Preview ${index + 1}`} />
                                    ) : (
                                        <video src={url} controls />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}


                    {/* New Files Preview */}
                    {previewUrls.length > 0 && (
                        <div className="preview-container">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="preview-item">
                                    <button 
                                        type="button"
                                        className="delete-preview"
                                        onClick={() => {
                                            setFiles(prev => prev.filter((_, i) => i !== index));
                                            setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                                            URL.revokeObjectURL(url);
                                        }}
                                    >
                                        ×
                                    </button>
                                    {files[index]?.type.startsWith('image/') ? (
                                        <img src={url} alt={`Preview ${index + 1}`} />
                                    ) : (
                                        <video src={url} controls />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                Updating...
                                <span className="loading-spinner"></span>
                            </>
                        ) : (
                            'Update Event'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateEvent;
