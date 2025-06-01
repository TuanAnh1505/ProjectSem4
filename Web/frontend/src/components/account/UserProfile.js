import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Trang tài khoản cá nhân: user xem & cập nhật thông tin, xem lịch sử đặt tour
export default function UserProfile() {
  const navigate = useNavigate();
  // State lưu thông tin user
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  // Modal chi tiết booking
  const [showDetail, setShowDetail] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  // Đổi mật khẩu
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  // Thêm public_id vào state
  const [publicId, setPublicId] = useState(null);

  // Lấy thông tin user và booking khi vào trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedPublicId = localStorage.getItem("publicId");
    console.log("(UserProfile) Token:", token ? "có" : "không", "PublicId:", storedPublicId || "không có");
    
    if (!token || !storedPublicId) {
      console.log("(UserProfile) Thiếu token hoặc publicId, chuyển hướng về /login");
      navigate("/login");
      return;
    }
    
    setPublicId(storedPublicId);
    const fetchUserAndBookings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log("(UserProfile) Fetching user info với publicId:", storedPublicId);
        const userRes = await axios.get(`http://localhost:8080/api/users/${storedPublicId}`, config);
        console.log("(UserProfile) User info response:", userRes.data);
        setUser(userRes.data);
        setEditUser(userRes.data);
        
        console.log("(UserProfile) Fetching bookings với publicId:", storedPublicId);
        const bookingsRes = await axios.get(`http://localhost:8080/api/bookings/user/${storedPublicId}`, config);
        console.log("(UserProfile) Bookings response:", bookingsRes.data);
        const sortedBookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        sortedBookings.sort((a, b) => (new Date(b.bookingDate) - new Date(a.bookingDate)));
        setBookings(sortedBookings);
      } catch (err) {
        console.error("(UserProfile) Lỗi fetchUserAndBookings:", err);
        if (err.response && err.response.status === 401) {
          console.log("(UserProfile) Lỗi 401, token có thể hết hạn hoặc không hợp lệ");
        } else {
          toast.error("Không thể tải thông tin tài khoản!");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndBookings();
  }, [navigate]);

  // Xử lý cập nhật thông tin cá nhân
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token || !publicId) {
        toast.error("Phiên đăng nhập hết hạn!");
        navigate("/login");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8080/api/users/${publicId}`, editUser, config);
      toast.success("Cập nhật thông tin thành công!");
      setUser(editUser);
      setEditing(false);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      toast.error("Cập nhật thất bại!");
    }
  };

  // Xem chi tiết booking
  const handleShowDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetail(true);
  };

  // Hủy booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn chắc chắn muốn hủy booking này?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {}, config);
      toast.success('Đã hủy booking!');
      setBookings(bookings => bookings.map(b => b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b));
    } catch (err) {
      toast.error('Hủy booking thất bại!');
    }
  };

  // Đổi mật khẩu
  const handleChangePwd = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    setPwdLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !publicId) {
        toast.error("Phiên đăng nhập hết hạn!");
        navigate("/login");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:8080/api/users/${publicId}/change-password`, pwdForm, config);
      toast.success("Đổi mật khẩu thành công!");
      setShowChangePwd(false);
      setPwdForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      toast.error("Đổi mật khẩu thất bại!");
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) return <div>Đang tải thông tin...</div>;
  if (!user) return <div>Không tìm thấy thông tin tài khoản.</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h2 style={{ color: '#1976d2', fontWeight: 700 }}>Tài khoản của tôi</h2>
      {/* Thông tin cá nhân */}
      <div style={{ background: '#f5f5f5', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ color: '#1976d2' }}>Thông tin cá nhân</h3>
        {editing ? (
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
            <label>Họ tên:
              <input value={editUser.fullName || ''} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} required />
            </label>
            <label>Email:
              <input value={editUser.email || ''} onChange={e => setEditUser({ ...editUser, email: e.target.value })} required type="email" />
            </label>
            <label>Số điện thoại:
              <input value={editUser.phone || ''} onChange={e => setEditUser({ ...editUser, phone: e.target.value })} required />
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600 }}>Lưu</button>
              <button type="button" onClick={() => { setEditUser(user); setEditing(false); }} style={{ background: '#e0e0e0', color: '#333', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600 }}>Hủy</button>
            </div>
          </form>
        ) : (
          <div style={{ fontSize: 17 }}>
            <div><b>Họ tên:</b> {user.fullName}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Số điện thoại:</b> {user.phone}</div>
            <button onClick={() => setEditing(true)} style={{ marginTop: 12, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600 }}>Chỉnh sửa</button>
            <button onClick={() => setShowChangePwd(true)} style={{ marginTop: 12, marginLeft: 12, background: '#fff', color: '#1976d2', border: '1.5px solid #1976d2', borderRadius: 6, padding: '8px 16px', fontWeight: 600 }}>Đổi mật khẩu</button>
          </div>
        )}
      </div>
      {/* Lịch sử đặt tour */}
      <div style={{ background: '#f5f5f5', borderRadius: 12, padding: 24 }}>
        <h3 style={{ color: '#1976d2' }}>Lịch sử đặt tour</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8 }}>
          <thead>
            <tr style={{ background: '#e3f2fd' }}>
              <th style={{ padding: 8 }}>#</th>
              <th style={{ padding: 8 }}>Tên tour</th>
              <th style={{ padding: 8 }}>Lịch trình</th>
              <th style={{ padding: 8 }}>Số người</th>
              <th style={{ padding: 8 }}>Tổng tiền</th>
              <th style={{ padding: 8 }}>Trạng thái booking</th>
              <th style={{ padding: 8 }}>Trạng thái thanh toán</th>
              <th style={{ padding: 8 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) && bookings.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#888', padding: 16 }}>Chưa có booking nào</td></tr>
            ) : Array.isArray(bookings) && bookings.map((b, idx) => (
              <tr key={b.bookingId} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: 8 }}>{idx + 1}</td>
                <td style={{ padding: 8 }}>{b.tourName || b.tour?.name}</td>
                <td style={{ padding: 8 }}>{b.scheduleInfo || (b.schedule && `${b.schedule.startDate} - ${b.schedule.endDate}`)}</td>
                <td style={{ padding: 8 }}>{b.passengerCount || b.numPassengers || b.totalPassengers || 1}</td>
                <td style={{ padding: 8 }}>{b.totalPrice?.toLocaleString() || b.totalAmount?.toLocaleString() || 0}đ</td>
                <td style={{ padding: 8, color: b.status === 'CONFIRMED' ? '#388e3c' : b.status === 'CANCELLED' ? '#ff4d4f' : '#1976d2', fontWeight: 600 }}>{b.status}</td>
                <td style={{ padding: 8, color: b.paymentStatus === 'COMPLETED' ? '#388e3c' : b.paymentStatus === 'FAILED' ? '#ff4d4f' : '#1976d2', fontWeight: 600 }}>{b.paymentStatus}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => handleShowDetail(b)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, marginRight: 6 }}>Chi tiết</button>
                  {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                    <button onClick={() => handleCancelBooking(b.bookingId)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600 }}>Hủy</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal chi tiết booking */}
      {showDetail && selectedBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 500, boxShadow: '0 4px 24px #e3e8f0', position: 'relative' }}>
            <button onClick={() => setShowDetail(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>×</button>
            <h3 style={{ color: '#1976d2', marginBottom: 12 }}>Chi tiết booking</h3>
            <div><b>Tên tour:</b> {selectedBooking.tourName || selectedBooking.tour?.name}</div>
            <div><b>Lịch trình:</b> {selectedBooking.scheduleInfo || (selectedBooking.schedule && `${selectedBooking.schedule.startDate} - ${selectedBooking.schedule.endDate}`)}</div>
            <div><b>Số người:</b> {selectedBooking.passengerCount || selectedBooking.numPassengers || selectedBooking.totalPassengers || 1}</div>
            <div><b>Tổng tiền:</b> {selectedBooking.totalPrice?.toLocaleString() || selectedBooking.totalAmount?.toLocaleString() || 0}đ</div>
            <div><b>Trạng thái booking:</b> {selectedBooking.status}</div>
            <div><b>Trạng thái thanh toán:</b> {selectedBooking.paymentStatus}</div>
            {/* Có thể mở rộng thêm: danh sách hành khách, thông tin chi tiết hơn */}
          </div>
        </div>
      )}
      {/* Modal đổi mật khẩu */}
      {showChangePwd && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 400, boxShadow: '0 4px 24px #e3e8f0', position: 'relative' }}>
            <button onClick={() => setShowChangePwd(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>×</button>
            <h3 style={{ color: '#1976d2', marginBottom: 12 }}>Đổi mật khẩu</h3>
            <form onSubmit={handleChangePwd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label>Mật khẩu cũ:
                <input type="password" value={pwdForm.oldPassword} onChange={e => setPwdForm({ ...pwdForm, oldPassword: e.target.value })} required />
              </label>
              <label>Mật khẩu mới:
                <input type="password" value={pwdForm.newPassword} onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })} required />
              </label>
              <label>Nhập lại mật khẩu mới:
                <input type="password" value={pwdForm.confirmPassword} onChange={e => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} required />
              </label>
              <button type="submit" disabled={pwdLoading} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, marginTop: 8 }}>
                {pwdLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 