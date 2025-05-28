import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    Alert,
    CircularProgress,
    Container,
    Avatar,
    IconButton,
    InputAdornment,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaEdit, FaCheck, FaTimes, FaUserCircle } from 'react-icons/fa';

const UpdateInfoUser = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const publicId = localStorage.getItem('publicId');

        if (!token || !publicId) {
            setError('Vui lòng đăng nhập để xem thông tin');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        fetchUserInfo(publicId, token);
    }, [navigate]);

    const fetchUserInfo = async (publicId, token) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/auth/user-info?publicId=${publicId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data) {
                setFormData({
                    fullName: response.data.fullName || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    address: response.data.address || ''
                });
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            if (error.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('publicId');
                    navigate('/login');
                }, 2000);
            } else {
                setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const publicId = localStorage.getItem('publicId');

            if (!token || !publicId) {
                throw new Error('Không tìm thấy thông tin xác thực');
            }

            await axios.put(`/api/auth/update-info?publicId=${publicId}`, {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setSuccess('Cập nhật thông tin thành công!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user info:', error);
            if (error.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('publicId');
                    navigate('/login');
                }, 2000);
            } else {
                setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
            }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#666' }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
            py: 4,
            px: 2
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Left Side - Profile Card */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ 
                            height: '100%',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <Avatar
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        margin: '0 auto 20px',
                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <FaUserCircle size={80} style={{ color: '#666' }} />
                                </Avatar>
                                <Typography variant="h5" sx={{ 
                                    fontWeight: 600,
                                    color: '#2c3e50',
                                    mb: 1
                                }}>
                                    {formData.fullName}
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: '#7f8c8d',
                                    mb: 3
                                }}>
                                    {formData.email}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => setIsEditing(!isEditing)}
                                        startIcon={isEditing ? <FaTimes /> : <FaEdit />}
                                        sx={{
                                            borderRadius: '25px',
                                            px: 4,
                                            py: 1,
                                            background: isEditing ? '#e74c3c' : '#34495e',
                                            '&:hover': {
                                                background: isEditing ? '#c0392b' : '#2c3e50'
                                            }
                                        }}
                                    >
                                        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Side - Form */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ 
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" sx={{ 
                                    fontWeight: 600,
                                    color: '#2c3e50',
                                    mb: 3
                                }}>
                                    Thông tin chi tiết
                                </Typography>

                                {error && (
                                    <Alert 
                                        severity="error" 
                                        sx={{ 
                                            mb: 3,
                                            borderRadius: '10px'
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert 
                                        severity="success" 
                                        sx={{ 
                                            mb: 3,
                                            borderRadius: '10px'
                                        }}
                                    >
                                        {success}
                                    </Alert>
                                )}

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <FaEnvelope style={{ color: '#666' }} />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    backgroundColor: '#f8f9fa'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Họ và tên"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <FaUser style={{ color: '#666' }} />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    backgroundColor: '#f8f9fa'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Số điện thoại"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <FaPhone style={{ color: '#666' }} />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    backgroundColor: '#f8f9fa'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Địa chỉ"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <FaMapMarkerAlt style={{ color: '#666', marginTop: 8 }} />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    backgroundColor: '#f8f9fa'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {isEditing && (
                                        <Grid item xs={12}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={handleSubmit}
                                                startIcon={<FaCheck />}
                                                sx={{
                                                    mt: 2,
                                                    py: 1.5,
                                                    borderRadius: '12px',
                                                    background: '#34495e',
                                                    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
                                                    '&:hover': {
                                                        background: '#2c3e50'
                                                    }
                                                }}
                                            >
                                                Lưu thay đổi
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default UpdateInfoUser;