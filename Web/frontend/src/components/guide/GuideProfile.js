import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GuideProfile.css';

const GuideProfile = () => {
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        fetchGuideDetails();
    }, []);

    const fetchGuideDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/tour-guides/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setGuide(response.data);
        } catch (err) {
            setError('Không thể tải thông tin cá nhân. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('Mật khẩu mới không khớp.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8080/api/users/me/change-password', 
                { oldPassword, newPassword },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setPasswordSuccess('Đổi mật khẩu thành công!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordError(err.response?.data?.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
            console.error(err);
        }
    };
    
    if (loading) return <div className="loading-spinner-container"><div className="loading-spinner"></div></div>;
    if (error) return <div className="error-message-container">{error}</div>;
    if (!guide) return null;

    return (
        <div className="guide-profile-page">
            <h1 className="profile-header">Thông tin cá nhân</h1>
            <div className="profile-grid">
                <div className="profile-card info-card">
                    <h2>Thông tin Hướng dẫn viên</h2>
                    <div className="info-row">
                        <span className="info-label">Họ và tên:</span>
                        <span className="info-value">{guide.userFullName}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{guide.userEmail}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Số năm kinh nghiệm:</span>
                        <span className="info-value">{guide.experienceYears} năm</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Chuyên môn:</span>
                        <span className="info-value">{guide.specialization}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Ngôn ngữ:</span>
                        <span className="info-value">{guide.languages}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Đánh giá:</span>
                        <span className="info-value">{guide.rating} / 5.0</span>
                    </div>
                </div>

                <div className="profile-card password-card">
                    <h2>Đổi mật khẩu</h2>
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label htmlFor="oldPassword">Mật khẩu cũ</label>
                            <input
                                type="password"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {passwordError && <p className="password-error">{passwordError}</p>}
                        {passwordSuccess && <p className="password-success">{passwordSuccess}</p>}
                        <button type="submit" className="submit-btn">Cập nhật mật khẩu</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GuideProfile; 