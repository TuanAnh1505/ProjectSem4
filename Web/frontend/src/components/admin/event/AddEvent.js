import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/event/AddEvent.css';

const AddEvent = () => {
    const navigate = useNavigate();
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
    const [showModal, setShowModal] = useState(false);
    const [modalMedia, setModalMedia] = useState([]);
    const [modalIndex, setModalIndex] = useState(0);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    useEffect(() => {
        fetchEventStatuses();
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const fetchEventStatuses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/events/event-statuses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStatusOptions(response.data);
        } catch (error) {
            console.error('Error fetching event statuses:', error);
            setError('Failed to load event statuses');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setError(null);
        setFieldErrors({});

        // Validate files
        const validFiles = selectedFiles.filter(file => {
            const isValidType = allowedTypes.includes(file.type);
            const isValidSize = file.size <= maxFileSize;
            if (!isValidType) {
                setError(`Invalid file type for ${file.name}. Allowed: jpg, jpeg, png, mp4`);
                return false;
            }
            if (!isValidSize) {
                setError(`File ${file.name} exceeds 10MB limit`);
                return false;
            }
            return true;
        });

        if (validFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        setFiles(validFiles);
        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(newPreviewUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsLoading(true);

        // Validation
        if (!event.name.trim()) {
            setFieldErrors(prev => ({ ...prev, name: 'Name is required' }));
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            Object.keys(event).forEach(key => {
                if (key !== 'filePaths') {
                    formData.append(key, event[key]);
                }
            });

            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post(
                'http://localhost:8080/api/events',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201 || response.status === 200) {
                navigate('/admin/event');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.data) {
                setFieldErrors(error.response.data);
            } else {
                setError('Failed to create event');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#fafbfc' }}>
            <button
                type="button"
                onClick={() => navigate('/admin/event')}
                style={{
                    margin: '32px 0 0 32px',
                    padding: '8px 22px',
                    background: '#1976d2',
                    color: '#fff',
                    borderRadius: 6,
                    fontWeight: 500,
                    border: 'none',
                    fontSize: 16,
                    boxShadow: '0 1px 4px rgba(25, 118, 210, 0.08)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#1251a3'}
                onMouseOut={e => e.currentTarget.style.background = '#1976d2'}
            >
                Quay lại
            </button>
            <div className="add-event-container">
                <h2 className="form-title">Add New Event</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="event-form-row">
                        <div className="event-form-group">
                            <label htmlFor="name">Event Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={event.name}
                                onChange={handleChange}
                                className={fieldErrors.name ? 'error' : ''}
                            />
                            {fieldErrors.name && <div className="error-message">{fieldErrors.name}</div>}
                        </div>

                        <div className="event-form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={event.location}
                                onChange={handleChange}
                                className={fieldErrors.location ? 'error' : ''}
                            />
                            {fieldErrors.location && <div className="error-message">{fieldErrors.location}</div>}
                        </div>
                    </div>

                    <div className="event-form-row">
                        <div className="event-form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="datetime-local"
                                id="startDate"
                                name="startDate"
                                value={event.startDate}
                                onChange={handleChange}
                                className={fieldErrors.startDate ? 'error' : ''}
                            />
                            {fieldErrors.startDate && <div className="error-message">{fieldErrors.startDate}</div>}
                        </div>

                        <div className="event-form-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="datetime-local"
                                id="endDate"
                                name="endDate"
                                value={event.endDate}
                                onChange={handleChange}
                                className={fieldErrors.endDate ? 'error' : ''}
                            />
                            {fieldErrors.endDate && <div className="error-message">{fieldErrors.endDate}</div>}
                        </div>
                    </div>

                    <div className="event-form-row">
                        <div className="event-form-group">
                            <label htmlFor="ticketPrice">Ticket Price</label>
                            <input
                                type="number"
                                id="ticketPrice"
                                name="ticketPrice"
                                value={event.ticketPrice}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className={fieldErrors.ticketPrice ? 'error' : ''}
                            />
                            {fieldErrors.ticketPrice && <div className="error-message">{fieldErrors.ticketPrice}</div>}
                        </div>

                        <div className="event-form-group">
                            <label htmlFor="statusName">Status</label>
                            <select
                                id="statusName"
                                name="statusName"
                                value={event.statusName}
                                onChange={handleChange}
                                className={fieldErrors.statusName ? 'error' : ''}
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
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            className={`event-form-input ${fieldErrors.description ? 'error' : ''}`}
                            name="description"
                            value={event.description}
                            onChange={handleChange}
                            required
                            style={{
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word'
                            }}
                        />
                        {fieldErrors.description && <div className="error-message">{fieldErrors.description}</div>}
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <label className="form-label" style={{ fontWeight: 600, marginBottom: 6 }}>Choose Images/Videos</label>
                        <div
                            style={{
                                border: '2px dashed #43a047',
                                borderRadius: 12,
                                padding: '28px 0',
                                textAlign: 'center',
                                color: '#234',
                                fontWeight: 600,
                                fontSize: 20,
                                cursor: 'pointer',
                                marginBottom: 18,
                                background: '#fafdff',
                                transition: 'border 0.2s',
                            }}
                            onClick={() => document.getElementById('files').click()}
                        >
                            Choose Images/Videos
                            <input
                                id="files"
                                type="file"
                                className="file-input"
                                onChange={handleFileChange}
                                multiple
                                accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime"
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {previewUrls.map((url, index) => (
                                <div key={index} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1.5px solid #e0e0e0', background: '#fafafa', cursor: 'pointer' }}>
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); handleDeleteFile(index); }}
                                        style={{ position: 'absolute', top: 2, right: 2, background: '#e53935', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, zIndex: 2 }}
                                    >×</button>
                                    <div onClick={() => { setModalMedia(previewUrls); setModalIndex(index); setShowModal(true); }} style={{ width: '100%', height: '100%' }}>
                                        {files[index]?.type?.startsWith('image/') || url.match(/\.(jpg|jpeg|png)$/i) ? (
                                            <img src={url} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <video src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showModal && (
                            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
                                <div style={{ position: 'relative', background: '#fff', borderRadius: 10, padding: 16, maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                                    <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 32, color: '#333', cursor: 'pointer' }}>×</button>
                                    {modalMedia[modalIndex]?.match(/\.(mp4|mov)$/i) ? (
                                        <video src={modalMedia[modalIndex]} controls autoPlay style={{ maxWidth: '80vw', maxHeight: '70vh', borderRadius: 8 }} />
                                    ) : (
                                        <img src={modalMedia[modalIndex]} alt="Preview" style={{ maxWidth: '80vw', maxHeight: '70vh', borderRadius: 8 }} />
                                    )}
                                    {modalMedia.length > 1 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                                            <button onClick={() => setModalIndex((modalIndex - 1 + modalMedia.length) % modalMedia.length)} style={{ fontSize: 28, background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer' }}>‹</button>
                                            <button onClick={() => setModalIndex((modalIndex + 1) % modalMedia.length)} style={{ fontSize: 28, background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer' }}>›</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEvent;
