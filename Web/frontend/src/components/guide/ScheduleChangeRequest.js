import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Clock, MapPin, Calendar, FileText, Send } from 'lucide-react';
import './ScheduleChangeRequest.css';

const ScheduleChangeRequest = ({ scheduleId, guideId, tourName, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        scheduleId: scheduleId,
        guideId: guideId,
        requestType: 'itinerary_change',
        currentItineraryId: null,
        proposedChanges: '',
        reason: '',
        urgencyLevel: 'medium',
        effectiveDate: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [itineraries, setItineraries] = useState([]);

    useEffect(() => {
        fetchItineraries();
    }, [scheduleId]);

    const fetchItineraries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/itineraries/schedule/${scheduleId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setItineraries(response.data);
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/schedule-change-requests', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (onSuccess) {
                onSuccess(response.data);
            }
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    const urgencyLevels = [
        { value: 'low', label: 'Thấp', color: '#10b981' },
        { value: 'medium', label: 'Trung bình', color: '#f59e0b' },
        { value: 'high', label: 'Cao', color: '#ef4444' },
        { value: 'critical', label: 'Khẩn cấp', color: '#dc2626' }
    ];

    const requestTypes = [
        { value: 'itinerary_change', label: 'Thay đổi lịch trình chi tiết', icon: <Clock size={16} /> },
        { value: 'schedule_change', label: 'Thay đổi ngày giờ tour', icon: <Calendar size={16} /> },
        { value: 'emergency_change', label: 'Thay đổi khẩn cấp', icon: <AlertTriangle size={16} /> }
    ];

    return (
        <div className="schedule-change-modal">
            <div className="schedule-change-content">
                <div className="schedule-change-header">
                    <h2>Yêu cầu thay đổi lịch trình</h2>
                    <p>Tour: {tourName}</p>
                </div>

                {error && (
                    <div className="schedule-change-error">
                        <AlertTriangle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="schedule-change-form">
                    <div className="form-group">
                        <label>
                            <FileText size={16} />
                            Loại yêu cầu
                        </label>
                        <select
                            name="requestType"
                            value={formData.requestType}
                            onChange={handleChange}
                            required
                        >
                            {requestTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.requestType === 'itinerary_change' && (
                        <div className="form-group">
                            <label>
                                <MapPin size={16} />
                                Lịch trình cần thay đổi
                            </label>
                            <select
                                name="currentItineraryId"
                                value={formData.currentItineraryId || ''}
                                onChange={handleChange}
                            >
                                <option value="">Chọn lịch trình</option>
                                {itineraries.map((itinerary, index) => (
                                    <option key={itinerary.itineraryId} value={itinerary.itineraryId}>
                                        Ngày {index + 1}: {itinerary.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>
                            <AlertTriangle size={16} />
                            Mức độ khẩn cấp
                        </label>
                        <div className="urgency-levels">
                            {urgencyLevels.map(level => (
                                <label key={level.value} className="urgency-option">
                                    <input
                                        type="radio"
                                        name="urgencyLevel"
                                        value={level.value}
                                        checked={formData.urgencyLevel === level.value}
                                        onChange={handleChange}
                                    />
                                    <span 
                                        className="urgency-label"
                                        style={{ borderColor: level.color }}
                                    >
                                        {level.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            <Calendar size={16} />
                            Ngày hiệu lực
                        </label>
                        <input
                            type="date"
                            name="effectiveDate"
                            value={formData.effectiveDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <FileText size={16} />
                            Thay đổi đề xuất
                        </label>
                        <textarea
                            name="proposedChanges"
                            value={formData.proposedChanges}
                            onChange={handleChange}
                            placeholder="Mô tả chi tiết những thay đổi bạn muốn thực hiện..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <AlertTriangle size={16} />
                            Lý do thay đổi
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Giải thích lý do cần thay đổi lịch trình..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="schedule-change-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="loading-spinner" />
                            ) : (
                                <>
                                    <Send size={16} />
                                    Gửi yêu cầu
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleChangeRequest; 