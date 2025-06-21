import React, { useState } from 'react';
import GuideDashboard from './GuideDashboard';
import './GuideDemo.css';

const GuideDemo = () => {
    const [isDemoMode, setIsDemoMode] = useState(true);

    // Mock data cho demo
    const mockAssignments = [
        {
            assignmentId: 1,
            tourId: 1,
            guideId: 1,
            role: 'main_guide',
            startDate: '2024-01-15',
            endDate: '2024-01-20',
            status: 'completed',
            tourName: 'Tour Hà Nội - Sapa 5 ngày 4 đêm',
            tourDescription: 'Khám phá vẻ đẹp của thủ đô Hà Nội và núi rừng Sapa với những trải nghiệm tuyệt vời.',
            tourImage: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=500',
            tourPrice: 2500000,
            tourDuration: 5,
            guideName: 'Nguyễn Văn A',
            guideSpecialization: 'Văn hóa miền Bắc',
            guideLanguages: 'Tiếng Việt, Tiếng Anh',
            guideRating: 4.8,
            category: 'completed'
        },
        {
            assignmentId: 2,
            tourId: 2,
            guideId: 1,
            role: 'main_guide',
            startDate: '2024-02-01',
            endDate: '2024-02-05',
            status: 'inprogress',
            tourName: 'Tour Huế - Đà Nẵng - Hội An',
            tourDescription: 'Hành trình khám phá di sản văn hóa thế giới với những điểm đến nổi tiếng.',
            tourImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=500',
            tourPrice: 3200000,
            tourDuration: 5,
            guideName: 'Nguyễn Văn A',
            guideSpecialization: 'Văn hóa miền Trung',
            guideLanguages: 'Tiếng Việt, Tiếng Anh, Tiếng Pháp',
            guideRating: 4.8,
            category: 'ongoing'
        },
        {
            assignmentId: 3,
            tourId: 3,
            guideId: 1,
            role: 'assistant_guide',
            startDate: '2024-03-10',
            endDate: '2024-03-15',
            status: 'assigned',
            tourName: 'Tour TP.HCM - Cần Thơ - Cà Mau',
            tourDescription: 'Khám phá vùng đất phương Nam với những nét văn hóa độc đáo và ẩm thực phong phú.',
            tourImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
            tourPrice: 2800000,
            tourDuration: 6,
            guideName: 'Nguyễn Văn A',
            guideSpecialization: 'Văn hóa miền Nam',
            guideLanguages: 'Tiếng Việt, Tiếng Anh',
            guideRating: 4.8,
            category: 'upcoming'
        },
        {
            assignmentId: 4,
            tourId: 4,
            guideId: 1,
            role: 'specialist',
            startDate: '2024-04-01',
            endDate: '2024-04-07',
            status: 'assigned',
            tourName: 'Tour Phú Quốc - Đảo ngọc Việt Nam',
            tourDescription: 'Trải nghiệm thiên đường biển đảo với những bãi biển đẹp nhất Việt Nam.',
            tourImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
            tourPrice: 4500000,
            tourDuration: 7,
            guideName: 'Nguyễn Văn A',
            guideSpecialization: 'Du lịch biển đảo',
            guideLanguages: 'Tiếng Việt, Tiếng Anh, Tiếng Trung',
            guideRating: 4.8,
            category: 'upcoming'
        }
    ];

    if (isDemoMode) {
        return (
            <div className="guide-demo">
                <div className="demo-header">
                    <h1>Demo - Trang Hướng dẫn viên</h1>
                    <p>Đây là phiên bản demo với dữ liệu mẫu</p>
                    <button 
                        className="demo-toggle-btn"
                        onClick={() => setIsDemoMode(false)}
                    >
                        Chuyển sang chế độ thực
                    </button>
                </div>
                
                <GuideDashboard demoData={mockAssignments} />
            </div>
        );
    }

    return (
        <div className="guide-demo">
            <div className="demo-header">
                <h1>Trang Hướng dẫn viên</h1>
                <p>Chế độ thực - Yêu cầu đăng nhập với role GUIDE</p>
                <button 
                    className="demo-toggle-btn"
                    onClick={() => setIsDemoMode(true)}
                >
                    Chuyển sang chế độ demo
                </button>
            </div>
            
            <GuideDashboard />
        </div>
    );
};

export default GuideDemo; 