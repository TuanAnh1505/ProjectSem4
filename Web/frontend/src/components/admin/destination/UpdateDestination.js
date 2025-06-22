import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
                <Link to="/admin/destination" className="back-button" style={{ marginBottom: 24, display: 'inline-block' }}>
                    Quay lại
                </Link>
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="section-title">Thông tin tour</div>
                        <div className="form-row">
                            <div>
                                <label className="form-label">Tên tour</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="name"
                                    value={destination.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Giá</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="category"
                                    value={destination.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div>
                                <label className="form-label">Thời gian</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="location"
                                    value={destination.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Số lượng người tham gia</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    name="rating"
                                    value={destination.rating}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-title">Thông tin chi tiết</div>
                        <label className="form-label">Mô tả</label>
                        <textarea
                            className="description-form-input"
                            name="description"
                            value={destination.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-section-status">
                        <div className="section-title">Cài đặt</div>
                        <div className="form-row">
                            <div>
                                <label className="form-label">Trạng thái</label>
                                <input
                                    type="text"
                                    className="form-input-status"
                                    name="status"
                                    value={destination.status || 'Published'}
                                    readOnly
                                />
                            </div>
                        </div>
                        {/* Thêm các mục điểm đến, sự kiện nếu có */}
                    </div>
                    <div className="form-section file-upload-section">
                        <div className="section-title">Hình ảnh tour</div>
                        <label htmlFor="files" className="upload-box">
                            <span className="upload-icon">📷</span>
                            <div className="upload-text">Click to upload tour image</div>
                            <div className="upload-note">PNG, JPG up to 5MB</div>
                            <input
                                id="files"
                                type="file"
                                className="form-input"
                                onChange={handleFileChange}
                                multiple
                                accept="image/jpeg,image/jpg,image/png"
                                style={{ display: 'none' }}
                            />
                        </label>
                        <div className="preview-list">
                            {previewUrls.map((url, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <button type="button" className="delete-preview" onClick={() => handleDeleteFile(index)}>
                                        ×
                                    </button>
                                    <img src={url} alt={`Preview ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'right', marginTop: 8 }}>
                            <span style={{ color: '#6366f1', cursor: 'pointer', fontSize: 14 }}>+ Add more</span>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                Updating...
                                <span className="loading-spinner"></span>
                            </>
                        ) : (
                            'Update Tour'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateDestination;
