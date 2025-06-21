import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourDetail from './TourDetail';
import './GuideDashboard.css';

const GuideDashboard = ({ demoData }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedTourId, setSelectedTourId] = useState(null);

    useEffect(() => {
        if (demoData) {
            // Sử dụng demo data nếu được truyền vào
            setAssignments(demoData);
            setLoading(false);
        } else {
            // Gọi API thực tế
            fetchAssignments();
        }
    }, [demoData]);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/tour-guide-assignments/my-assignments-details', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setAssignments(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'assigned':
                return 'status-assigned';
            case 'completed':
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
            case 'inprogress':
                return 'status-inprogress';
            default:
                return 'status-assigned';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'assigned':
                return 'Đã phân công';
            case 'completed':
                return 'Hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            case 'inprogress':
                return 'Đang thực hiện';
            default:
                return 'Đã phân công';
        }
    };

    const getRoleText = (role) => {
        switch (role?.toLowerCase()) {
            case 'main_guide':
                return 'Hướng dẫn viên chính';
            case 'assistant_guide':
                return 'Hướng dẫn viên phụ';
            case 'specialist':
                return 'Chuyên gia';
            default:
                return role;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getFilteredAssignments = () => {
        if (activeFilter === 'all') {
            return assignments;
        }
        return assignments.filter(assignment => assignment.category === activeFilter);
    };

    const getStats = () => {
        const stats = {
            completed: assignments.filter(a => a.category === 'completed').length,
            upcoming: assignments.filter(a => a.category === 'upcoming').length,
            ongoing: assignments.filter(a => a.category === 'ongoing').length,
            total: assignments.length
        };
        return stats;
    };

    const handleStatusUpdate = async (assignmentId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/tour-guide-assignments/${assignmentId}/status`, 
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            // Refresh data
            fetchAssignments();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
        }
    };

    const handleViewTourDetail = (tourId) => {
        setSelectedTourId(tourId);
    };

    const handleCloseTourDetail = () => {
        setSelectedTourId(null);
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="guide-dashboard">
                <div className="empty-state">
                    <div className="empty-state-icon">⚠️</div>
                    <h3>Lỗi tải dữ liệu</h3>
                    <p>{error}</p>
                    <button onClick={fetchAssignments} className="action-btn btn-primary">
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    const stats = getStats();
    const filteredAssignments = getFilteredAssignments();

    return (
        <div className="guide-dashboard">
            {/* Header */}
            <div className="guide-dashboard-header">
                <h1>Bảng điều khiển Hướng dẫn viên</h1>
                <p>Quản lý và theo dõi các tour đã được phân công</p>
            </div>

            {/* Statistics */}
            <div className="dashboard-stats">
                <div className="stat-card completed">
                    <div className="stat-number">{stats.completed}</div>
                    <div className="stat-label">Tour đã hoàn thành</div>
                </div>
                <div className="stat-card ongoing">
                    <div className="stat-number">{stats.ongoing}</div>
                    <div className="stat-label">Tour đang thực hiện</div>
                </div>
                <div className="stat-card upcoming">
                    <div className="stat-number">{stats.upcoming}</div>
                    <div className="stat-label">Tour sắp tới</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.total}</div>
                    <div className="stat-label">Tổng số tour</div>
                </div>
            </div>

            {/* Assignments Section */}
            <div className="assignments-section">
                <div className="section-header">
                    <h2 className="section-title">Danh sách tour được phân công</h2>
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            Tất cả
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('upcoming')}
                        >
                            Sắp tới
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'ongoing' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('ongoing')}
                        >
                            Đang thực hiện
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('completed')}
                        >
                            Đã hoàn thành
                        </button>
                    </div>
                </div>

                {filteredAssignments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>Chưa có tour nào</h3>
                        <p>
                            {activeFilter === 'all' 
                                ? 'Bạn chưa được phân công tour nào.' 
                                : `Không có tour nào trong danh mục "${activeFilter === 'upcoming' ? 'Sắp tới' : activeFilter === 'ongoing' ? 'Đang thực hiện' : 'Đã hoàn thành'}"`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="assignments-grid">
                        {filteredAssignments.map((assignment) => (
                            <div key={assignment.assignmentId} className="assignment-card">
                                <img 
                                    src={assignment.tourImage || '/default-tour-image.jpg'} 
                                    alt={assignment.tourName}
                                    className="assignment-image"
                                    onError={(e) => {
                                        e.target.src = '/default-tour-image.jpg';
                                    }}
                                />
                                <div className="assignment-content">
                                    <div className="assignment-header">
                                        <h3 className="assignment-title">{assignment.tourName}</h3>
                                        <span className={`assignment-status ${getStatusClass(assignment.status)}`}>
                                            {getStatusText(assignment.status)}
                                        </span>
                                    </div>

                                    <div className="assignment-role">
                                        {getRoleText(assignment.role)}
                                    </div>

                                    <div className="assignment-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Ngày bắt đầu:</span>
                                            <span className="detail-value">{formatDate(assignment.startDate)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Ngày kết thúc:</span>
                                            <span className="detail-value">{formatDate(assignment.endDate)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Giá tour:</span>
                                            <span className="detail-value">{formatPrice(assignment.tourPrice)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Thời gian:</span>
                                            <span className="detail-value">{assignment.tourDuration || 'N/A'} ngày</span>
                                        </div>
                                    </div>

                                    {assignment.tourDescription && (
                                        <div className="assignment-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Mô tả:</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0 0 0' }}>
                                                {assignment.tourDescription.length > 100 
                                                    ? `${assignment.tourDescription.substring(0, 100)}...` 
                                                    : assignment.tourDescription
                                                }
                                            </p>
                                        </div>
                                    )}

                                    <div className="assignment-actions">
                                        <button 
                                            className="action-btn btn-primary"
                                            onClick={() => handleViewTourDetail(assignment.tourId)}
                                        >
                                            Xem chi tiết
                                        </button>
                                        {assignment.role === 'main_guide' && assignment.status === 'inprogress' && (
                                            <button 
                                                className="action-btn btn-success"
                                                onClick={() => handleStatusUpdate(assignment.assignmentId, 'completed')}
                                            >
                                                Hoàn thành
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tour Detail Modal */}
            {selectedTourId && (
                <TourDetail 
                    tourId={selectedTourId} 
                    onClose={handleCloseTourDetail} 
                />
            )}
        </div>
    );
};

export default GuideDashboard; 