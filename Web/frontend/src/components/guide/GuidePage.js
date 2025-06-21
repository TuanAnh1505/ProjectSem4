import React, { useState } from 'react';
import GuideDashboard from './GuideDashboard';
import GuideProfile from './GuideProfile';
import './GuidePage.css';
import { useNavigate } from 'react-router-dom';

const GuidePage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <GuideDashboard />;
            case 'profile':
                return <GuideProfile />;
            case 'reports':
                return <div className="guide-content">Báo cáo và thống kê (đang phát triển)</div>;
            default:
                return <GuideDashboard />;
        }
    };

    return (
        <div className="guide-page">
            <div className="guide-sidebar">
                <div className="guide-sidebar-header">
                    <h2>Hướng dẫn viên</h2>
                    <p>Quản lý tour</p>
                </div>
                
                <nav className="guide-nav">
                    <button 
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <span className="nav-icon">📊</span>
                        <span className="nav-text">Bảng điều khiển</span>
                    </button>
                    
                    <button 
                        className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        <span className="nav-icon">📈</span>
                        <span className="nav-text">Báo cáo</span>
                    </button>
                    
                    <button 
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="nav-icon">👤</span>
                        <span className="nav-text">Thông tin cá nhân</span>
                    </button>
                </nav>

                <div className="guide-sidebar-footer">
                    <button className="nav-item logout-button" onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        <span className="nav-text">Đăng xuất</span>
                    </button>
                </div>
            </div>
            
            <div className="guide-main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default GuidePage; 