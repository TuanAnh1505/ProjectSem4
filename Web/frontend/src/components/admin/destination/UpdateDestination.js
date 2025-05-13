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
        <div className="add-destination-container">
            <h2 className="form-title">Update Destination</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="update-destination-form-row">
                    <div className="update-destination-form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className={`update-destination-form-input ${fieldErrors.name ? 'error' : ''}`}
                            name="name"
                            value={destination.name}
                            onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="update-destination-form-group">
                        <label className="form-label">Category</label>
                        <input
                            type="text"
                            className="update-destination-form-control"
                            name="category"
                            value={destination.category}
                            onChange={(e) => setDestination({ ...destination, category: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="update-destination-form-row">
                    <div className="update-destination-form-group">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            className="update-destination-form-control"
                            name="location"
                            value={destination.location}
                            onChange={(e) => setDestination({ ...destination, location: e.target.value })}
                            required
                        />
                    </div>
                    <div className="update-destination-form-group">
                        <label className="form-label">Rating</label>
                        <input
                            type="number"
                            className="update-destination-form-control"
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

                <div className="update-destination-form-group full-width">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        className={`update-destination-form-input ${fieldErrors.description ? 'error' : ''}`}
                        name="description"
                        value={destination.description}
                        onChange={handleChange}
                        required
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
                        'Update Destination'
                    )}
                </button>
            </form>
        </div>
    );
};

export default UpdateDestination;
