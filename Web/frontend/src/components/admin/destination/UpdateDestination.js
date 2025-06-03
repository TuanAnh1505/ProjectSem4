import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/destination/UpdateDestination.css';

const UpdateDestination = () => {
    const navigate = useNavigate();
    const { destinationId } = useParams();
    const [destination, setDestination] = useState({
        name: '',
        category: '',
        description: '',
        location: '',
        rating: '',
        filePaths: []
    });
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const loadDestination = useCallback(async () => {
        if (!destinationId) {
            setError('No destination ID provided');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/destinations/${destinationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data) {
                setDestination(response.data);
                // Set initial preview URLs from existing files
                if (response.data.filePaths) {
                    setPreviewUrls(response.data.filePaths.map(path => 
                        path.startsWith('http') ? path : `http://localhost:8080${path}`
                    ));
                }
            }
        } catch (error) {
            console.error('Error loading destination:', error);
            setError(error.response?.data?.message || 'Failed to load destination');
            navigate('/admin/destination');
        }
    }, [destinationId, navigate]);

    useEffect(() => {
        loadDestination();
    }, [loadDestination]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setDestination(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: null })); // Clear field error on change
    };



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
            
            // Append all destination data
            Object.keys(destination).forEach(key => {
                if (key !== 'filePaths') {
                    formData.append(key, destination[key]);
                }
            });

            // Append new files if any
            if (files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }

            await axios.put(`http://localhost:8080/api/destinations/${destinationId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/admin/destination');
        } catch (error) {
            console.error('Error updating destination:', error);
            setError(error.response?.data?.message || 'Failed to update destination');
            setFieldErrors(error.response?.data || {});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="update-destination-wrapper">
            <div className="update-destination-card">
                <h2 className="section-title">Update Destination</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="form-row">
                            <div>
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className={`form-input${fieldErrors.name ? ' error' : ''}`}
                                    name="name"
                                    value={destination.name}
                                    onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="category"
                                    value={destination.category}
                                    onChange={(e) => setDestination({ ...destination, category: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div>
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="location"
                                    value={destination.location}
                                    onChange={(e) => setDestination({ ...destination, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Rating</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    name="rating"
                                    value={destination.rating}
                                    onChange={(e) => setDestination({ ...destination, rating: e.target.value })}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            className={`description-form-input${fieldErrors.description ? ' error' : ''}`}
                            name="description"
                            value={destination.description}
                            onChange={handleChange}
                            required
                            style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}
                        />
                        {fieldErrors.description && <div className="error-message">{fieldErrors.description}</div>}
                    </div>
                    <div className="form-section file-upload-section">
                        <div className="upload-box" onClick={() => document.getElementById('files').click()}>
                            <div className="upload-icon">
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-2.586-2.586A2 2 0 0 0 11.172 4H8a2 2 0 0 0-2 2v2m0 0H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1M6 6v2m0 0h12" /></svg>
                            </div>
                            <div className="upload-text">Click to upload images/videos</div>
                            <div className="upload-note">PNG, JPG, MP4 up to 5MB</div>
                            <input
                                id="files"
                                type="file"
                                className="form-input"
                                onChange={handleFileChange}
                                multiple
                                accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    {previewUrls.length > 0 && (
                        <div className="preview-list">
                            {previewUrls.map((url, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <button
                                        type="button"
                                        className="delete-preview"
                                        onClick={() => handleDeleteFile(index)}
                                    >
                                        ×
                                    </button>
                                    {files[index]?.type?.startsWith('image/') || url.match(/\.(jpg|jpeg|png)$/i) ? (
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
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                Updating...
                                <span className="loading-spinner"></span>
                            </>
                        ) : (
                            'Update Destination'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateDestination;
