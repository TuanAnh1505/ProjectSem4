import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthenticatedImage = ({ src, alt, className }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            const token = localStorage.getItem('token');
            if (!src) {
                setError(true);
                return;
            }

            try {
                const response = await axios.get(src, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    responseType: 'blob' 
                });
                
                const imageUrl = URL.createObjectURL(response.data);
                setImageSrc(imageUrl);

            } catch (err) {
                console.error("Failed to load authenticated image:", err);
                setError(true);
            }
        };

        fetchImage();

        // Cleanup function to revoke the object URL
        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [src]);

    if (error || !imageSrc) {
        // Fallback image if there's an error or src is not provided
        return <img src={'https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found'} alt={alt} className={className} />;
    }

    return <img src={imageSrc} alt={alt} className={className} />;
};

export default AuthenticatedImage; 