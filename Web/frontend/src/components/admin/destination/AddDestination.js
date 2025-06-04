import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/destination/AddDestination.css';

const StarRating = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(null);

    return (
        <div className="star-rating">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <span
                        key={index}
                        className={`star ${ratingValue <= (hover || rating) ? 'active' : ''}`}
                        onClick={() => onRatingChange(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
};

const AddDestination = () => {
    const navigate = useNavigate();
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

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'video/quicktime'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        // Cleanup preview URLs on component unmount
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [navigate, previewUrls]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDestination(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: null })); // Clear field error on change
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
                setError(`Invalid file type for ${file.name}. Allowed: jpg, jpeg, png, mp4, mov`);
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

        // Reset filePaths, as they will be set by the backend
        setDestination(prev => ({
            ...prev,
            filePaths: []
        }));

        // Generate preview URLs
        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(newPreviewUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsLoading(true);

        // Client-side validation
        if (!destination.name.trim()) {
            setFieldErrors(prev => ({ ...prev, name: 'Name is required' }));
            setIsLoading(false);
            return;
        }
        if (!destination.category.trim()) {
            setFieldErrors(prev => ({ ...prev, category: 'Category is required' }));
            setIsLoading(false);
            return;
        }
        if (!destination.description.trim()) {
            setFieldErrors(prev => ({ ...prev, description: 'Description is required' }));
            setIsLoading(false);
            return;
        }
        if (!destination.location.trim()) {
            setFieldErrors(prev => ({ ...prev, location: 'Location is required' }));
            setIsLoading(false);
            return;
        }
        const rating = parseFloat(destination.rating);
        if (isNaN(rating) || rating < 0 || rating > 5) {
            setFieldErrors(prev => ({ ...prev, rating: 'Rating must be between 0 and 5' }));
            setIsLoading(false);
            return;
        }
        if (files.length === 0) {
            setFieldErrors(prev => ({ ...prev, filePaths: 'At least one image or video is required' }));
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('name', destination.name.trim());
            formData.append('category', destination.category.trim());
            formData.append('description', destination.description.trim());
            formData.append('location', destination.location.trim());
            formData.append('rating', rating.toString());
            files.forEach(file => {
                formData.append('files', file);
            });

            // Debug FormData contents
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value instanceof File ? value.name : value}`);
            }

            const response = await axios.post(
                'http://localhost:8080/api/destinations',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 201) {
                navigate('/admin/destination');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else if (error.response?.status === 400) {
                const errors = error.response.data;
                if (typeof errors === 'object' && !Array.isArray(errors)) {
                    setFieldErrors(errors); // e.g., { name: "Name cannot be blank" }
                } else {
                    setError(errors.message || 'Invalid input. Please check your data.');
                }
            } else {
                setError('Failed to add destination. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRatingChange = (value) => {
        setDestination(prev => ({ ...prev, rating: value }));
        setFieldErrors(prev => ({ ...prev, rating: null }));
    };

    const handleDeleteFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
    };

    return (
        <div className="add-destination-wrapper">
            <div className="add-destination-card">
                <h2 className="section-title">Add New Destination</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="section-subtitle">Basic Information</div>
                        <div className="form-row">
                            <div>
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    className={`form-input${fieldErrors.name ? ' error' : ''}`}
                                    name="name"
                                    value={destination.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter destination name"
                                />
                                {fieldErrors.name && <div className="error-message">{fieldErrors.name}</div>}
                            </div>
                            <div>
                                <label htmlFor="category" className="form-label">Category</label>
                                <input
                                    id="category"
                                    type="text"
                                    className={`form-input${fieldErrors.category ? ' error' : ''}`}
                                    name="category"
                                    value={destination.category}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter category"
                                />
                                {fieldErrors.category && <div className="error-message">{fieldErrors.category}</div>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div>
                                <label htmlFor="location" className="form-label">Location</label>
                                <input
                                    id="location"
                                    type="text"
                                    className={`form-input${fieldErrors.location ? ' error' : ''}`}
                                    name="location"
                                    value={destination.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter location"
                                />
                                {fieldErrors.location && <div className="error-message">{fieldErrors.location}</div>}
                            </div>
                            <div>
                                <label htmlFor="rating" className="form-label">Rating</label>
                                <StarRating 
                                    rating={Number(destination.rating)} 
                                    onRatingChange={handleRatingChange}
                                />
                                {fieldErrors.rating && <div className="error-message">{fieldErrors.rating}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-subtitle">Destination Details</div>
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            className={`description-form-input${fieldErrors.description ? ' error' : ''}`}
                            name="description"
                            value={destination.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter destination description"
                            style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}
                        />
                        {fieldErrors.description && <div className="error-message">{fieldErrors.description}</div>}
                    </div>
                    <div className="form-section file-upload-section">
                        <div className="section-subtitle">Destination Image/Video</div>
                        <div
                            className="upload-box"
                            onClick={() => document.getElementById('files').click()}
                        >
                            <div className="upload-icon">
                                {/* SVG camera icon */}
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-2.586-2.586A2 2 0 0 0 11.172 4H8a2 2 0 0 0-2 2v2m0 0H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1M6 6v2m0 0h12" /></svg>
                            </div>
                            <div className="upload-text">Click to upload tour image</div>
                            <div className="upload-note">PNG, JPG up to 5MB</div>
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
                        {fieldErrors.filePaths && <div className="error-message">{fieldErrors.filePaths}</div>}
                        {previewUrls.length > 0 && (
                            <div className="preview-list">
                                {previewUrls.map((url, index) => (
                                    <div key={index} style={{position: 'relative'}}>
                                        <button 
                                            type="button"
                                            className="delete-preview"
                                            onClick={() => handleDeleteFile(index)}
                                        >
                                            ×
                                        </button>
                                        {files[index].type.startsWith('image/') ? (
                                            <img src={url} alt={`Preview ${index + 1}`} />
                                        ) : (
                                            <video src={url} controls />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                Adding...
                                <span className="loading-spinner"></span>
                            </>
                        ) : (
                            'Add Destination'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDestination;