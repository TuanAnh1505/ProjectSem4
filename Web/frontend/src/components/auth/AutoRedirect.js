import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role) {
            // User đã đăng nhập, redirect dựa trên role
            if (role === 'GUIDE') {
                // Guide có thể truy cập trang chính, không redirect ngay lập tức
                // navigate('/guide');
                navigate('/');
            } else {
                // Admin và user thường đều có thể truy cập trang chính
                navigate('/');
            }
        } else {
            // User chưa đăng nhập, redirect về trang chính
            navigate('/');
        }
    }, [navigate]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '1.2rem',
            color: '#666'
        }}>
            Đang chuyển hướng...
        </div>
    );
};

export default AutoRedirect; 