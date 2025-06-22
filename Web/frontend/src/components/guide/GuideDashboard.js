import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GuideDashboard.css';
import { CalendarCheck, Users, Star, Map, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import TourDetailForGuide from './TourDetailForGuide';
import AuthenticatedImage from './AuthenticatedImage';

const GuideDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedTour, setSelectedTour] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [guideRating, setGuideRating] = useState(0.0);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const [assignmentsRes, profileRes] = await Promise.all([
                axios.get("http://localhost:8080/api/tour-guide-assignments/my-assignments-details", {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get("http://localhost:8080/api/tour-guides/me", {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const assignmentsWithDetails = assignmentsRes.data.map(a => ({
                ...a,
                category: new Date(a.startDate) >= new Date() ? 'upcoming' : 'completed'
            }));
            setAssignments(assignmentsWithDetails);
            setFilteredAssignments(assignmentsWithDetails);

            if (profileRes.data) {
                setGuideRating(profileRes.data.rating || 0.0);
            }
            setError('');
        } catch (err) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại.');
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const handleFilter = (type) => {
        setFilter(type);
        if (type === 'all') {
            setFilteredAssignments(assignments);
        } else {
            setFilteredAssignments(assignments.filter(a => a.category === type));
        }
    };

    const handleViewDetails = (tourId, startDate) => {
        setSelectedTour({ tourId, startDate });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedTour(null);
        setIsModalOpen(false);
    };

    const upcomingToursCount = assignments.filter(a => new Date(a.startDate) >= new Date()).length;
    const completedToursCount = assignments.length - upcomingToursCount;

    const StatCard = ({ icon, label, value, color }) => (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="stat-info">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );

    const AssignmentCard = ({ assignment }) => {
        const statusConfig = {
            'Sắp diễn ra': {
                className: 'status-upcoming',
                icon: <Clock size={16} />
            },
            'Đã hoàn thành': {
                className: 'status-completed',
                icon: <CheckCircle size={16} />
            }
        };
        const status = new Date(assignment.startDate) >= new Date() ? 'Sắp diễn ra' : 'Đã hoàn thành';
        const config = statusConfig[status];

        return (
            <div className="assignment-card">
                <div className="card-image-container">
                    <AuthenticatedImage 
                        src={assignment.tourImage} 
                        alt={assignment.tourName} 
                        className="card-image" 
                    />
                    <div className="card-image-overlay"></div>
                    <span className={`card-status-badge ${config.className}`}>
                        {config.icon} {status}
                    </span>
                </div>
                <div className="card-content">
                    <h3 className="card-title">{assignment.tourName}</h3>
                    <div className="card-info-grid">
                        <div className="info-item">
                            <CalendarCheck size={16} />
                            <span>{new Date(assignment.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="info-item">
                            <Map size={16} />
                            <span>{assignment.destinationName || 'N/A'}</span>
                        </div>
                    </div>
                    <p className="card-description">{assignment.tourDescription}</p>
                    <button className="card-action-button" onClick={() => handleViewDetails(assignment.tourId, assignment.startDate)}>
                        Xem chi tiết
                    </button>
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading-spinner"></div>;
    if (error) return (
        <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchData} className="card-action-button">Thử lại</button>
        </div>
    );

    return (
        <div className="guide-dashboard">
            <header className="dashboard-header">
                <h1>Bảng điều khiển</h1>
                <p>Chào mừng trở lại! Dưới đây là tổng quan về các tour của bạn.</p>
            </header>

            <section className="stats-grid">
                <StatCard icon={<CalendarCheck size={24} color="white" />} label="Tour sắp diễn ra" value={upcomingToursCount} color="#3b82f6" />
                <StatCard icon={<CheckCircle size={24} color="white" />} label="Tour đã hoàn thành" value={completedToursCount} color="#16a34a" />
                <StatCard icon={<Users size={24} color="white" />} label="Tổng khách đã dẫn" value={assignments.reduce((acc, a) => acc + (a.numberOfPassengers || 0), 0)} color="#f97316" />
                <StatCard icon={<Star size={24} color="white" />} label="Đánh giá trung bình" value={guideRating.toFixed(1)} color="#f59e0b" />
            </section>
            
            <section className="assignments-section">
                <div className="section-header">
                    <h2>Tour được phân công</h2>
                    <div className="filter-buttons">
                        <button onClick={() => handleFilter('upcoming')} className={filter === 'upcoming' ? 'active' : ''}>Sắp diễn ra</button>
                        <button onClick={() => handleFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Đã hoàn thành</button>
                        <button onClick={() => handleFilter('all')} className={filter === 'all' ? 'active' : ''}>Tất cả</button>
                    </div>
                </div>

                <div className="assignments-grid">
                    {filteredAssignments.length > 0 ? (
                        filteredAssignments.map(assignment => (
                            <AssignmentCard key={`${assignment.tourId}-${assignment.startDate}`} assignment={assignment} />
                        ))
                    ) : (
                        <div className="no-assignments">
                            <AlertTriangle size={48} className="no-assignments-icon" />
                            <h3>Không có tour nào</h3>
                            <p>Hiện tại không có tour nào phù hợp với bộ lọc đã chọn.</p>
                        </div>
                    )}
                </div>
            </section>

            {isModalOpen && selectedTour && (
                <TourDetailForGuide
                    tourId={selectedTour.tourId}
                    startDate={selectedTour.startDate}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default GuideDashboard; 