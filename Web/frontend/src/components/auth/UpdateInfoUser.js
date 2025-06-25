import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
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
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Card as MUICard,
    CardContent as MUICardContent,
    Chip,
    Stack
} from '@mui/material';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaEdit, FaCheck, FaTimes, FaUserCircle, FaHistory, FaEye, FaBan, FaRegCalendarAlt, FaUsers, FaMoneyBill, FaCheckCircle, FaTimesCircle, FaDownload, FaClock, FaInfoCircle } from 'react-icons/fa';

const UpdateInfoUser = () => {
    const navigate = useNavigate();
    const { publicId } = useParams();
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
    // Booking states
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showBookingDetail, setShowBookingDetail] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [createdAt, setCreatedAt] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 3;
    const totalPages = Math.ceil(bookings.length / bookingsPerPage);
    const pagedBookings = bookings.slice((currentPage - 1) * bookingsPerPage, currentPage * bookingsPerPage);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedPublicId = localStorage.getItem('publicId');

        if (!token || !storedPublicId) {
            setError('Vui lòng đăng nhập để xem thông tin');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        // Verify if the user is accessing their own profile
        if (publicId !== storedPublicId) {
            setError('Không có quyền truy cập thông tin này');
            setTimeout(() => navigate('/'), 2000);
            return;
        }

        fetchUserInfo(storedPublicId, token);
        fetchBookings(storedPublicId, token);
    }, [navigate, publicId]);

    const fetchUserInfo = async (publicId, token) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/users/${publicId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data) {
                setFormData({
                    fullName: response.data.fullName || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    address: response.data.address || ''
                });
                setCreatedAt(response.data.createdAt || response.data.created_at || '');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async (publicId, token) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/bookings/user/${publicId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const sortedBookings = Array.isArray(response.data) ? response.data : [];
            sortedBookings.sort((a, b) => (new Date(b.bookingDate) - new Date(a.bookingDate)));
            setBookings(sortedBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Không thể tải lịch sử đặt tour!');
        }
    };

    const handleApiError = (error) => {
        if (error.response?.status === 401) {
            setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('publicId');
                navigate('/login');
            }, 2000);
        } else {
            setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
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
            const storedPublicId = localStorage.getItem('publicId');

            if (!token || !storedPublicId) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                return;
            }

            await axios.put(`http://localhost:8080/api/users/${storedPublicId}`, {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Cập nhật thông tin thành công!');
            setSuccess('Cập nhật thông tin thành công!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user info:', error, error.response);
            if (error.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!');
            } else {
                setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
            }
        }
    };

    const handleShowBookingDetail = (booking) => {
        setSelectedBooking(booking);
        setShowBookingDetail(true);
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Bạn chắc chắn muốn hủy booking này?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Đã hủy booking!');
            setBookings(bookings => bookings.map(b => 
                b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b
            ));
        } catch (error) {
            toast.error('Hủy booking thất bại!');
        }
    };

    const handleRequestRefund = async (bookingId) => {
        if (!window.confirm('Bạn chắc chắn muốn yêu cầu hoàn tiền cho booking này?')) return;
        try {
            const token = localStorage.getItem('token');
            // TODO: Gọi API request refund khi backend đã có
            // await axios.put(`http://localhost:8080/api/payments/{paymentId}/status?statusId=7`, {}, {
            //     headers: { 'Authorization': `Bearer ${token}` }
            // });
            toast.success('Đã gửi yêu cầu hoàn tiền!');
            setBookings(bookings => bookings.map(b => 
                b.bookingId === bookingId ? { ...b, status: 'Request Refund' } : b
            ));
        } catch (error) {
            toast.error('Yêu cầu hoàn tiền thất bại!');
        }
    };

    // Helper function to format schedule info
    const formatScheduleInfo = (scheduleInfo) => {
        if (!scheduleInfo) return 'Chưa có lịch trình';
        
        try {
            const dateRange = scheduleInfo.split(' - ');
            if (dateRange.length >= 2) {
                const startDate = new Date(dateRange[0].trim());
                const endDate = new Date(dateRange[1].trim());
                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    return `${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}`;
                }
            }
            return scheduleInfo;
        } catch (error) {
            return scheduleInfo;
        }
    };

    // Thống kê booking
    const totalBooked = bookings.length;
    const totalCompleted = bookings.filter(b => b.status === 'COMPLETED').length;
    const totalPending = bookings.filter(b => b.status === 'CONFIRMED').length;
    const totalCancelled = bookings.filter(b => b.status === 'CANCELLED').length;

    // Hàm lấy paymentId chưa thanh toán cho booking
    const getUnpaidPaymentId = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8080/api/payments/booking/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Ưu tiên payment có status PENDING hoặc SUPPORT_CONTACT
            const unpaid = res.data.find(p => ['PENDING', 'SUPPORT_CONTACT'].includes((p.statusName || '').toUpperCase()));
            return unpaid ? unpaid.paymentId : null;
        } catch (e) {
            return null;
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
            background: '#fff',
            py: 4,
            px: 2,
            mt: '100px'
        }}>
            <Container maxWidth="xl" sx={{ px: { xs: 0, md: 2 } }}>
                <Grid container spacing={2}>
                    {/* Card trái */}
                    <Grid item xs={12} md={3} sx={{ pl: 0 }}>
                        <Card sx={{
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                            ml: 0,
                            maxWidth: 300,
                            minWidth: 220,
                            px: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start'
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 2, px: 1 }}>
                                <Avatar
                                    sx={{
                                        width: 90,
                                        height: 90,
                                        margin: '0 auto 12px',
                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <FaUserCircle size={60} style={{ color: '#666' }} />
                                </Avatar>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>
                                    {formData.fullName}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ textAlign: 'left', mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <FaEnvelope style={{ color: '#1976d2', marginRight: 8 }} />
                                        <Typography variant="body2">{formData.email}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <FaPhone style={{ color: '#1976d2', marginRight: 8 }} />
                                        <Typography variant="body2">{formData.phone}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <FaMapMarkerAlt style={{ color: '#1976d2', marginRight: 8 }} />
                                        <Typography variant="body2">{formData.address}</Typography>
                                    </Box>
                                </Box>
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
                                        },
                                        mb: 3
                                    }}
                                >
                                    {isEditing ? 'Hủy' : 'Chỉnh sửa thông tin'}
                                </Button>
                                {/* Thống kê */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>Thống kê</Typography>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Box sx={{ background: '#f0f4ff', borderRadius: 2, py: 1.5, textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>{totalBooked}</Typography>
                                                <Typography variant="caption" sx={{ color: '#1976d2' }}>Tour đã đặt</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ background: '#e8f5e9', borderRadius: 2, py: 1.5, textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ color: '#43a047', fontWeight: 700 }}>{totalCompleted}</Typography>
                                                <Typography variant="caption" sx={{ color: '#43a047' }}>Tour đã đi</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ background: '#fffde7', borderRadius: 2, py: 1.5, textAlign: 'center', mt: 1 }}>
                                                <Typography variant="h6" sx={{ color: '#fbc02d', fontWeight: 700 }}>{totalPending}</Typography>
                                                <Typography variant="caption" sx={{ color: '#fbc02d' }}>Đang chờ</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ background: '#ffebee', borderRadius: 2, py: 1.5, textAlign: 'center', mt: 1 }}>
                                                <Typography variant="h6" sx={{ color: '#e53935', fontWeight: 700 }}>{totalCancelled}</Typography>
                                                <Typography variant="caption" sx={{ color: '#e53935' }}>Đã huỷ</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Card phải */}
                    <Grid item xs={12} md={9}>
                        <Card sx={{ 
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Tabs
                                    value={tabIndex}
                                    onChange={(e, newValue) => setTabIndex(newValue)}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    sx={{ mb: 3 }}
                                >
                                    <Tab label="Lịch sử đặt tour" />
                                    <Tab label="Thông tin chi tiết" />
                                </Tabs>
                                {tabIndex === 0 && (
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FaHistory /> Lịch sử đặt tour
                                        </Typography>
                                        <Stack spacing={2}>
                                            {pagedBookings.length === 0 ? (
                                                <MUICard sx={{ p: 3, textAlign: 'center', color: '#888' }}>Chưa có booking nào</MUICard>
                                            ) : (
                                                pagedBookings.map((booking, idx) => {
                                                    // Tính thời gian còn lại để hủy tour
                                                    let cancelDeadline = null;
                                                    let daysLeft = null;
                                                    if (booking.scheduleInfo) {
                                                        // Parse scheduleInfo string "startDate - endDate" to get startDate
                                                        const dateRange = booking.scheduleInfo.split(' - ');
                                                        if (dateRange.length >= 1) {
                                                            const startDateStr = dateRange[0].trim();
                                                            try {
                                                                // Parse the date string (assuming format like "2024-01-15")
                                                                const startDate = new Date(startDateStr);
                                                                if (!isNaN(startDate.getTime())) {
                                                                    // Giả sử hạn chót hủy là 3 ngày trước ngày khởi hành
                                                                    cancelDeadline = new Date(startDate);
                                                                    cancelDeadline.setDate(cancelDeadline.getDate() - 3);
                                                                    const now = new Date();
                                                                    daysLeft = Math.ceil((cancelDeadline - now) / (1000 * 60 * 60 * 24));
                                                                }
                                                            } catch (error) {
                                                                console.error('Error parsing date:', startDateStr, error);
                                                            }
                                                        }
                                                    }
                                                    return (
                                                        <MUICard key={booking.bookingId} sx={{ p: 2, borderRadius: 3, boxShadow: '0 2px 12px #e3e8f0', border: '1px solid #e3e8f0' }}>
                                                            <MUICardContent sx={{ p: 0 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                                    <Box>
                                                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{booking.tourName || booking.tour?.name}</Typography>
                                                                        <Typography variant="body2" sx={{ color: '#888' }}>Mã đặt tour: {booking.bookingCode || booking.bookingId}</Typography>
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Chip label={booking.status === 'CONFIRMED' ? 'Đã xác nhận' : booking.status === 'CANCELLED' ? 'Đã hủy' : booking.status} color={booking.status === 'CONFIRMED' ? 'success' : booking.status === 'CANCELLED' ? 'error' : 'info'} size="small" sx={{ fontWeight: 600 }}/>
                                                                        <Button size="small" variant="text" startIcon={<FaInfoCircle />} onClick={() => handleShowBookingDetail(booking)} sx={{ color: '#1976d2', fontWeight: 600 }}>Xem chi tiết</Button>
                                                                    </Box>
                                                                </Box>
                                                                <Grid container spacing={2} sx={{ mb: 1 }}>
                                                                    <Grid item xs={12} sm={6} md={3}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <FaRegCalendarAlt style={{ color: '#1976d2' }} />
                                                                            <Typography variant="body2">
                                                                                {formatScheduleInfo(booking.scheduleInfo)}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6} md={3}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <FaUsers style={{ color: '#1976d2' }} />
                                                                            <Typography variant="body2">{booking.passengerCount || booking.numPassengers || booking.totalPassengers || 1} khách</Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6} md={3}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <FaMoneyBill style={{ color: '#1976d2' }} />
                                                                            <Typography variant="body2">{(booking.totalPrice || booking.totalAmount || 0).toLocaleString()} VNĐ</Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6} md={3}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            {(booking.paymentStatus || '').trim().toUpperCase() === 'COMPLETED' ? <FaCheckCircle style={{ color: '#43a047' }} /> : <FaTimesCircle style={{ color: '#e53935' }} />}
                                                                            <Typography variant="body2" sx={{ color: (booking.paymentStatus || '').trim().toUpperCase() === 'COMPLETED' ? '#43a047' : '#e53935', fontWeight: 600 }}>
                                                                                {(booking.paymentStatus || '').trim().toUpperCase() === 'COMPLETED' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                </Grid>
                                                                {daysLeft !== null && daysLeft >= 0 && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#1976d2', fontWeight: 500 }}>
                                                                        <FaClock style={{ marginRight: 6 }} />
                                                                        Thời gian còn lại để hủy tour: Còn {daysLeft} ngày (hạn chót: {cancelDeadline?.toLocaleDateString('vi-VN')})
                                                                    </Box>
                                                                )}
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                                                    <Button variant="outlined" startIcon={<FaDownload />} sx={{ borderRadius: 2 }} disabled>Tải về</Button>
                                                                    {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && booking.status !== 'Request Refund' && (
                                                                        <Button variant="outlined" color="warning" startIcon={<FaTimesCircle />} sx={{ borderRadius: 2 }} onClick={() => handleRequestRefund(booking.bookingId)}>
                                                                            Yêu cầu hoàn tiền
                                                                        </Button>
                                                                    )}
                                                                    {(booking.paymentStatus || '').trim().toUpperCase() !== 'COMPLETED' && booking.status !== 'CANCELLED' && booking.status !== 'Request Refund' && (
                                                                        <Button variant="contained" color="primary" sx={{ borderRadius: 2 }}
                                                                            onClick={async () => {
                                                                                const token = localStorage.getItem('token');
                                                                                try {
                                                                                    // Lấy payment chưa thanh toán
                                                                                    const res = await axios.get(`http://localhost:8080/api/payments/booking/${booking.bookingId}`, {
                                                                                        headers: { 'Authorization': `Bearer ${token}` }
                                                                                    });
                                                                                    const payment = res.data.find(p => ['SUPPORT_CONTACT', 'PENDING'].includes((p.statusName || '').toUpperCase()));
                                                                                    if (payment && payment.statusName.toUpperCase() === 'SUPPORT_CONTACT') {
                                                                                        // Gọi API chuyển về PENDING (id = 1)
                                                                                        await axios.put(`http://localhost:8080/api/payments/${payment.paymentId}/status?statusId=1`, {}, {
                                                                                            headers: { 'Authorization': `Bearer ${token}` }
                                                                                        });
                                                                                    }
                                                                                } catch (e) {
                                                                                    // Bỏ qua lỗi, vẫn cho phép chuyển hướng
                                                                                }
                                                                                navigate(`/payment/${booking.bookingId}`);
                                                                            }}>
                                                                            Tiếp tục thanh toán
                                                                        </Button>
                                                                    )}
                                                                </Box>
                                                            </MUICardContent>
                                                        </MUICard>
                                                    );
                                                })
                                            )}
                                        </Stack>
                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                >
                                                    Trước
                                                </Button>
                                                {[...Array(totalPages)].map((_, idx) => (
                                                    <Button
                                                        key={idx}
                                                        variant={currentPage === idx + 1 ? "contained" : "outlined"}
                                                        size="small"
                                                        onClick={() => setCurrentPage(idx + 1)}
                                                    >
                                                        {idx + 1}
                                                    </Button>
                                                ))}
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                >
                                                    Sau
                                                </Button>
                                            </Stack>
                                        )}
                                    </Box>
                                )}
                                {tabIndex === 1 && (
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
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* Booking Detail Dialog */}
            <Dialog 
                open={showBookingDetail} 
                onClose={() => setShowBookingDetail(false)}
                maxWidth="sm"
                fullWidth
            >
                {selectedBooking && (
                    <>
                        <DialogTitle sx={{ 
                            background: '#1976d2',
                            color: 'white',
                            fontWeight: 600
                        }}>
                            Chi tiết booking
                        </DialogTitle>
                        <DialogContent sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Tên tour:
                                    </Typography>
                                    <Typography>
                                        {selectedBooking.tourName || selectedBooking.tour?.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Lịch trình:
                                    </Typography>
                                    <Typography>
                                        {formatScheduleInfo(selectedBooking.scheduleInfo)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Số người:
                                    </Typography>
                                    <Typography>
                                        {selectedBooking.passengerCount || 
                                         selectedBooking.numPassengers || 
                                         selectedBooking.totalPassengers || 1}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Tổng tiền:
                                    </Typography>
                                    <Typography>
                                        {(selectedBooking.totalPrice || 
                                          selectedBooking.totalAmount || 0).toLocaleString()}đ
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Trạng thái booking:
                                    </Typography>
                                    <Typography sx={{
                                        color: selectedBooking.status === 'CONFIRMED' ? '#388e3c' :
                                               selectedBooking.status === 'CANCELLED' ? '#ff4d4f' : '#1976d2',
                                        fontWeight: 600
                                    }}>
                                        {selectedBooking.status}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Trạng thái thanh toán:
                                    </Typography>
                                    <Typography sx={{
                                        color: selectedBooking.paymentStatus === 'COMPLETED' ? '#388e3c' :
                                               selectedBooking.paymentStatus === 'FAILED' ? '#ff4d4f' : '#1976d2',
                                        fontWeight: 600
                                    }}>
                                        {selectedBooking.paymentStatus}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                onClick={() => setShowBookingDetail(false)}
                                sx={{ 
                                    color: '#1976d2',
                                    fontWeight: 600
                                }}
                            >
                                Đóng
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default UpdateInfoUser;