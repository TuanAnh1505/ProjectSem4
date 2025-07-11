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
        <div className="add-event-admin-bg">
            <div className="add-event-admin-center">
                <button
                    type="button"
                    onClick={() => navigate('/admin/event')}
                    className="back-button-admin"
                >
                    Quay lại
                </button>
                <div className="add-event-container">
                    <h2 className="form-title-admin">Add New Event</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="event-form-row">
                            <div className="event-form-group">
                                <label htmlFor="name" className="label-admin">Event Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={event.name}
                                    onChange={handleChange}
                                    className={fieldErrors.name ? 'error input-admin' : 'input-admin'}
                                />
                                {fieldErrors.name && <div className="error-message">{fieldErrors.name}</div>}
                            </div>
                            <div className="event-form-group">
                                <label htmlFor="location" className="label-admin">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={event.location}
                                    onChange={handleChange}
                                    className={fieldErrors.location ? 'error input-admin' : 'input-admin'}
                                />
                                {fieldErrors.location && <div className="error-message">{fieldErrors.location}</div>}
                            </div>
                        </div>
                        <div className="event-form-row">
                            <div className="event-form-group">
                                <label htmlFor="startDate" className="label-admin">Start Date</label>
                                <input
                                    type="datetime-local"
                                    id="startDate"
                                    name="startDate"
                                    value={event.startDate}
                                    onChange={handleChange}
                                    className={fieldErrors.startDate ? 'error input-admin' : 'input-admin'}
                                />
                                {fieldErrors.startDate && <div className="error-message">{fieldErrors.startDate}</div>}
                            </div>
                            <div className="event-form-group">
                                <label htmlFor="endDate" className="label-admin">End Date</label>
                                <input
                                    type="datetime-local"
                                    id="endDate"
                                    name="endDate"
                                    value={event.endDate}
                                    onChange={handleChange}
                                    className={fieldErrors.endDate ? 'error input-admin' : 'input-admin'}
                                />
                                {fieldErrors.endDate && <div className="error-message">{fieldErrors.endDate}</div>}
                            </div>
                        </div>
                        <div className="event-form-row">
                            <div className="event-form-group">
                                <label htmlFor="ticketPrice" className="label-admin">Ticket Price</label>
                                <input
                                    type="number"
                                    id="ticketPrice"
                                    name="ticketPrice"
                                    value={event.ticketPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className={fieldErrors.ticketPrice ? 'error input-admin' : 'input-admin'}
                                />
                                {fieldErrors.ticketPrice && <div className="error-message">{fieldErrors.ticketPrice}</div>}
                            </div>
                            <div className="event-form-group">
                                <label htmlFor="statusName" className="label-admin">Status</label>
                                <select
                                    id="statusName"
                                    name="statusName"
                                    value={event.statusName}
                                    onChange={handleChange}
                                    className={fieldErrors.statusName ? 'error input-admin' : 'input-admin'}
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions.map((status) => (
                                        <option key={status.eventStatusId} value={status.statusName}>
                                            {status.statusName}
                                        </option>
                                    ))}
                                </select>
                                {fieldErrors.statusName && <div className="error-message">{fieldErrors.statusName}</div>}
                            </div>
                        </div>
                        <div className="event-form-row">
                            <div className="event-form-group full-width">
                                <label htmlFor="description" className="label-admin">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={event.description}
                                    onChange={handleChange}
                                    className={fieldErrors.description ? 'error input-admin' : 'input-admin'}
                                    rows={3}
                                />
                                {fieldErrors.description && <div className="error-message">{fieldErrors.description}</div>}
                            </div>
                        </div>
                        <div className="file-input-container">
                            <label className="label-admin">Choose Images/Videos</label>
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg,image/jpg,image/png,video/mp4"
                                onChange={handleFileChange}
                                className="input-admin"
                            />
                        </div>
                        <div className="preview-container-admin">
                            {previewUrls.map((url, idx) => (
                                <div className="preview-item-admin" key={idx}>
                                    {url.match(/\.mp4$/) ? (
                                        <video src={url} controls className="preview-media-admin" />
                                    ) : (
                                        <img src={url} alt="preview" className="preview-media-admin" />
                                    )}
                                    <button type="button" className="delete-preview" onClick={() => handleDeleteFile(idx)}>×</button>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="submit-button-admin" disabled={isLoading}>
                            {isLoading ? 'Đang tạo...' : 'Create Event'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEvent;
