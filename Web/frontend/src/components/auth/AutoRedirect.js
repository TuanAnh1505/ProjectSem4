import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role) {
           
            if (role === 'GUIDE') {
                
                navigate('/');
            } else {
                
                navigate('/');
            }
        } else {
            
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