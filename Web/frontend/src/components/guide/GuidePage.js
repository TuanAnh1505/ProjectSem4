import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, User, LogOut } from 'lucide-react';
import GuideDashboard from './GuideDashboard';
import GuideProfile from './GuideProfile';
import './GuidePage.css';

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
                return (
                    <div className="guide-content-placeholder">
                        <h2>Báo cáo và Thống kê</h2>
                        <p>Tính năng này đang được phát triển.</p>
                    </div>
                );
            default:
                return <GuideDashboard />;
        }
    };

    const NavItem = ({ icon, text, tabName }) => (
        <button
            className={`nav-item ${activeTab === tabName ? 'active' : ''}`}
            onClick={() => setActiveTab(tabName)}
        >
            {icon}
            <span className="nav-text">{text}</span>
        </button>
    );

    return (
        <div className="guide-page-container">
            <aside className="guide-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">T</div>
                    <h2 className="sidebar-title">TourManager</h2>
                </div>
                
                <nav className="guide-nav">
                    <NavItem icon={<LayoutDashboard size={20} />} text="Bảng điều khiển" tabName="dashboard" />
                    <NavItem icon={<BarChart3 size={20} />} text="Báo cáo" tabName="reports" />
                    <NavItem icon={<User size={20} />} text="Hồ sơ" tabName="profile" />
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item logout-button" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span className="nav-text">Đăng xuất</span>
                    </button>
                </div>
            </aside>
            
            <main className="guide-main-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default GuidePage; 