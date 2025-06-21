import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TourDetailForGuide.css';
import { X, Info, Calendar, Users, Briefcase, User, Phone, Mail, MapPin } from 'lucide-react';

const TourDetailForGuide = ({ tourId, startDate, onClose }) => {
    const [tourDetail, setTourDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchTourDetail();
    }, [tourId, startDate]);

    const fetchTourDetail = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/api/tour-guide-assignments/tour-detail/${tourId}?startDate=${startDate}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setTourDetail(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching tour detail:', err);
            setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatPrice = (price) => {
        if (!price) return '';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatPhone = (phone) => {
        if (!phone) return '';
        return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab tour={tourDetail} />;
            case 'itinerary': return <ItineraryTab itinerary={tourDetail.itineraries} />;
            case 'passengers': return <PassengersTab passengers={tourDetail.passengers} />;
            default: return null;
        }
    };

    if (loading) return <div className="modal-overlay"><div className="modal-container"><div className="loading-spinner"></div></div></div>;
    if (error) return <div className="modal-overlay"><div className="modal-container"><div className="error-message">{error}</div></div></div>;
    if (!tourDetail) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <div className="modal-header-content">
                        <Briefcase size={24} className="header-icon" />
                        <div>
                            <h2 className="modal-title">Chi tiết Tour</h2>
                            <p className="modal-subtitle">{tourDetail.tourName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="close-button"><X size={24} /></button>
                </header>

                <nav className="modal-tabs">
                    <TabButton icon={<Info size={18} />} label="Tổng quan" tabName="overview" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton icon={<Calendar size={18} />} label={`Lịch trình (${tourDetail.itineraries?.length || 0})`} tabName="itinerary" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton icon={<Users size={18} />} label={`Hành khách (${tourDetail.passengers?.length || 0})`} tabName="passengers" activeTab={activeTab} onClick={setActiveTab} />
                </nav>

                <main className="modal-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const TabButton = ({ icon, label, tabName, activeTab, onClick }) => (
    <button
        className={`tab-button ${activeTab === tabName ? 'active' : ''}`}
        onClick={() => onClick(tabName)}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const OverviewTab = ({ tour }) => (
    <div className="overview-tab">
        <InfoRow icon={<MapPin size={16} />} label="Điểm đến" value={tour.destinationName} />
        <InfoRow icon={<Calendar size={16} />} label="Ngày bắt đầu" value={new Date(tour.startDate).toLocaleDateString()} />
        <InfoRow icon={<Calendar size={16} />} label="Ngày kết thúc" value={new Date(tour.endDate).toLocaleDateString()} />
        <InfoRow icon={<Users size={16} />} label="Số lượng hành khách" value={tour.passengers?.length || 0} />
        <InfoRow icon={<Info size={16} />} label="Trạng thái lịch trình" value={<span className={`status-badge status-${tour.scheduleStatus?.toLowerCase()}`}>{tour.scheduleStatus}</span>} />
    </div>
);

const ItineraryTab = ({ itinerary }) => (
    <div className="itinerary-tab">
        {(itinerary || []).map((item, index) => (
            <div key={index} className="itinerary-item">
                <div className="itinerary-day">
                    <Calendar size={20} />
                    <span>Ngày {item.dayNumber}</span>
                </div>
                <div className="itinerary-content">
                    <h4 className="itinerary-title">{item.title}</h4>
                    <p className="itinerary-description">{item.description}</p>
                </div>
            </div>
        ))}
    </div>
);

const PassengersTab = ({ passengers }) => (
    <div className="passengers-tab">
        {(passengers || []).map((passenger) => (
            <div key={passenger.passengerId} className="passenger-card">
                <div className="passenger-info">
                    <User size={24} className="passenger-icon" />
                    <div className="passenger-details">
                        <span className="passenger-name">{passenger.fullName}</span>
                        <span className="passenger-gender">{passenger.gender}</span>
                    </div>
                </div>
                <div className="passenger-contact">
                    <InfoRow icon={<Mail size={14} />} value={passenger.email} />
                    <InfoRow icon={<Phone size={14} />} value={passenger.phone} />
                </div>
            </div>
        ))}
    </div>
);

const InfoRow = ({ icon, label, value }) => (
    <div className="info-row">
        <div className="info-label">
            {icon}
            <span>{label}:</span>
        </div>
        <div className="info-value">{value}</div>
    </div>
);

export default TourDetailForGuide; 