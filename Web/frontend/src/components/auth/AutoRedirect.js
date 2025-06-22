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
                navigate('/guide');
            } else if (role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
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