import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function AssignGuidePage() {
  const [tours, setTours] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [guides, setGuides] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedTour, setSelectedTour] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedGuide, setSelectedGuide] = useState('');
  const [role, setRole] = useState('main_guide');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Thêm state cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/tours').then(res => setTours(res.data));
    axios.get('http://localhost:8080/api/tour-guides').then(res => setGuides(res.data));
  }, []);

  useEffect(() => {
    if (selectedTour) {
      axios.get(`http://localhost:8080/api/schedules/tour/${selectedTour}`)
        .then(res => setSchedules(res.data));
      axios.get(`http://localhost:8080/api/tour-guide-assignments/tour/${selectedTour}`)
        .then(res => setAssignments(res.data));
    } else {
      setSchedules([]);
      setAssignments([]);
    }
    setSelectedSchedule('');
  }, [selectedTour]);

  const handleAssign = async () => {
    setError(''); setSuccess('');
    setIsAssigning(true);
    if (!selectedTour || !selectedSchedule || !selectedGuide || !role) {
      setError('Vui lòng chọn đầy đủ thông tin!');
      setIsAssigning(false);
      return;
    }
    const schedule = schedules.find(s => s.scheduleId === Number(selectedSchedule));
    if (!schedule) {
      setError('Không tìm thấy lịch trình đã chọn!');
      setIsAssigning(false);
      return;
    }
    if (dayjs(schedule.endDate).isBefore(dayjs(), 'day')) {
      setError('Không thể gán hướng dẫn viên cho lịch trình đã kết thúc!');
      setIsAssigning(false);
      return;
    }
    if (!schedule.startDate || !schedule.endDate) {
      setError('Lịch trình chưa có ngày bắt đầu hoặc kết thúc!');
      setIsAssigning(false);
      return;
    }
    const payload = {
      tourId: Number(selectedTour),
      guideId: Number(selectedGuide),
      scheduleId: Number(selectedSchedule),
      role,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      status: 'assigned'
    };
    console.log('Dữ liệu gửi lên:', payload);
    try {
      await axios.post('http://localhost:8080/api/tour-guide-assignments', payload);
      setSuccess('Gán hướng dẫn viên thành công!');
      axios.get(`http://localhost:8080/api/tour-guide-assignments/tour/${selectedTour}`)
        .then(res => setAssignments(res.data));
    } catch (e) {
      if (e.response && e.response.data) {
        // Ưu tiên lấy error/message từ backend
        const err = e.response.data.error || e.response.data.message || e.response.data;
        setError('Lỗi: ' + err);
      } else if (e.response && e.response.status === 400) {
        setError('Lỗi 400: Dữ liệu gửi lên không hợp lệ hoặc thiếu trường!');
      } else {
        setError('Hướng dẫn viên đã có tour trùng lịch hoặc lỗi khác!');
      }
      console.error('Lỗi khi gửi request:', e);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tour-guide-assignments/${assignmentId}`);
      setSuccess('Xóa phân công thành công!');
      setShowDeleteConfirm(null);
      // Refresh assignment list
      if (selectedTour) {
        axios.get(`http://localhost:8080/api/tour-guide-assignments/tour/${selectedTour}`)
          .then(res => setAssignments(res.data));
      }
    } catch (e) {
      setError('Lỗi khi xóa phân công!');
    }
  };

  // Lọc danh sách assignment
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment.guideName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || assignment.role === roleFilter;
    const matchesStatus = statusFilter === '' || assignment.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'main_guide': return 'Chính';
      case 'assistant_guide': return 'Phụ';
      case 'specialist': return 'Chuyên gia';
      default: return role;
    }
  };

  const getStatusDisplayName = (status) => {
    switch(status) {
      case 'assigned': return 'Đã phân công';
      case 'inprogress': return 'Đang diễn ra';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #e3e8f0', padding: 32 }}>
      <h2 style={{ fontFamily: "'Montserrat', sans-serif", color: '#1976d2', fontWeight: 800, marginBottom: 24 }}>Phân công hướng dẫn viên cho lịch trình</h2>
      
      {/* Form gán hướng dẫn viên */}
      <div style={{ background: '#f8f9fa', padding: 24, borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ color: '#1976d2', marginBottom: 16 }}>Gán hướng dẫn viên mới</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Chọn tour</label>
            <select value={selectedTour} onChange={e => setSelectedTour(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}>
              <option value="">-- Chọn tour --</option>
              {tours.map(t => <option key={t.tourId} value={t.tourId}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Chọn lịch trình</label>
            <select value={selectedSchedule} onChange={e => setSelectedSchedule(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}>
              <option value="">-- Chọn lịch trình --</option>
              {schedules.map(s => (
                dayjs(s.endDate).isBefore(dayjs(), 'day') ? null : (
                  <option key={s.scheduleId} value={s.scheduleId}>{s.startDate} - {s.endDate}</option>
                )
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Chọn hướng dẫn viên</label>
            <select value={selectedGuide} onChange={e => setSelectedGuide(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}>
              <option value="">-- Chọn HDV --</option>
              {guides.filter(g => g.isActive === true).map(g => (
                <option 
                  key={String(g.userId)} 
                  value={g.guideId} 
                  disabled={!g.guideId || g.guideId === 0}
                  style={{ color: (!g.guideId || g.guideId === 0) ? '#aaa' : 'inherit' }}
                >
                  {g.userFullName}{(!g.guideId || g.guideId === 0) ? ' (*)' : ''}
                </option>
              ))}
            </select>
            <small style={{ color: '#888', marginTop: 4 }}>
              (*) Hướng dẫn viên chưa có hồ sơ chi tiết.
            </small>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Vai trò</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}>
              <option value="main_guide">Chính</option>
              <option value="assistant_guide">Phụ</option>
              <option value="specialist">Chuyên gia</option>
            </select>
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <button onClick={handleAssign} disabled={isAssigning} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, cursor: isAssigning ? 'not-allowed' : 'pointer', opacity: isAssigning ? 0.6 : 1 }}>
              {isAssigning ? 'Đang xử lý...' : 'Gán'}
            </button>
          </div>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ color: '#1976d2', marginBottom: 16 }}>Lọc và tìm kiếm</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Tìm kiếm theo tên HDV</label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Nhập tên hướng dẫn viên..."
              style={{ width: '98%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ minWidth: 150 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Lọc theo vai trò</label>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}>
              <option value="">Tất cả vai trò</option>
              <option value="main_guide">Chính</option>
              <option value="assistant_guide">Phụ</option>
              <option value="specialist">Chuyên gia</option>
            </select>
          </div>
          <div style={{ minWidth: 150 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Lọc theo trạng thái</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}>
              <option value="">Tất cả trạng thái</option>
              <option value="assigned">Đã phân công</option>
              <option value="inprogress">Đang diễn ra</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách phân công */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ color: '#1976d2', margin: 0 }}>Danh sách phân công</h3>
          <div style={{ color: '#666', fontSize: 14 }}>
            Tổng cộng: {filteredAssignments.length} phân công
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f8f9fa', borderRadius: 8 }}>
            <thead>
              <tr style={{ background: '#e3e8f0', color: '#1976d2' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>#</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Lịch trình</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Hướng dẫn viên</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Vai trò</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Ngày bắt đầu</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Ngày kết thúc</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Trạng thái</th>
                <th style={{ padding: 12, textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 24, color: '#666' }}>
                    {assignments.length === 0 ? 'Chưa có phân công nào' : 'Không tìm thấy phân công nào phù hợp'}
                  </td>
                </tr>
              ) : filteredAssignments.map((a, idx) => (
                <tr key={a.assignmentId} style={{ background: idx % 2 === 0 ? '#fff' : '#f1f5f9' }}>
                  <td style={{ padding: 12 }}>{idx + 1}</td>
                  <td style={{ padding: 12 }}>{a.startDate} - {a.endDate}</td>
                  <td style={{ padding: 12 }}>{a.guideName}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      background: a.role === 'main_guide' ? '#e3f2fd' : a.role === 'assistant_guide' ? '#f3e5f5' : '#e8f5e8',
                      color: a.role === 'main_guide' ? '#1976d2' : a.role === 'assistant_guide' ? '#7b1fa2' : '#388e3c'
                    }}>
                      {getRoleDisplayName(a.role)}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>{a.startDate}</td>
                  <td style={{ padding: 12 }}>{a.endDate}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      background: a.status === 'assigned' ? '#e8f5e8' : a.status === 'completed' ? '#e3f2fd' : '#ffebee',
                      color: a.status === 'assigned' ? '#388e3c' : a.status === 'completed' ? '#1976d2' : '#d32f2f'
                    }}>
                      {getStatusDisplayName(a.status)}
                    </span>
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <button
                      onClick={() => setShowDeleteConfirm(a.assignmentId)}
                      style={{
                        background: '#f44336',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 8,
            maxWidth: 400,
            width: '90%'
          }}>
            <h3 style={{ marginBottom: 16, color: '#d32f2f' }}>Xác nhận xóa</h3>
            <p style={{ marginBottom: 24, color: '#666' }}>
              Bạn có chắc chắn muốn xóa phân công này không? Hành động này không thể hoàn tác.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: 4,
                  background: '#f44336',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 