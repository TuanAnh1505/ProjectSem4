import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ScheduleChangeRequests.css';

const ScheduleChangeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [adminResponse, setAdminResponse] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [actionLoading, setActionLoading] = useState(false); // Thêm state loading cho action

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/schedule-change-requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        setActionLoading(true); // Bắt đầu loading
        try {
            await axios.post(`http://localhost:8080/api/schedule-change-requests/${requestId}/approve`, null, {
                params: {
                    adminResponse: adminResponse,
                    adminId: 1 // Thay bằng admin ID thực tế
                }
            });
            setShowModal(false);
            setAdminResponse('');
            fetchRequests();
            alert('Yêu cầu đã được phê duyệt thành công!');
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Có lỗi xảy ra khi phê duyệt yêu cầu!');
        } finally {
            setActionLoading(false); // Kết thúc loading
        }
    };

    const handleReject = async (requestId) => {
        setActionLoading(true); // Bắt đầu loading
        try {
            await axios.post(`http://localhost:8080/api/schedule-change-requests/${requestId}/reject`, null, {
                params: {
                    adminResponse: adminResponse,
                    adminId: 1 // Thay bằng admin ID thực tế
                }
            });
            setShowModal(false);
            setAdminResponse('');
            fetchRequests();
            alert('Yêu cầu đã bị từ chối!');
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Có lỗi xảy ra khi từ chối yêu cầu!');
        } finally {
            setActionLoading(false); // Kết thúc loading
        }
    };

    const openModal = (request, action) => {
        setSelectedRequest({ ...request, action });
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'approved': return 'green';
            case 'rejected': return 'red';
            default: return 'gray';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'low': return 'blue';
            case 'medium': return 'orange';
            case 'high': return 'red';
            case 'critical': return 'darkred';
            default: return 'gray';
        }
    };

    const filteredRequests = requests.filter(request => {
        if (filter === 'all') return request.status === 'pending';
        if (filter === 'pending') return request.status === 'pending';
        return request.status === filter;
    });

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="schedule-change-requests">
            <div className="header">
                <h1>Quản lý yêu cầu thay đổi lịch trình</h1>
                <div className="filters-pro">
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select-filter-pro">
                    <option value="pending">Chờ phê duyệt</option>
                    <option value="approved">Đã phê duyệt</option>
                    <option value="rejected">Đã từ chối</option>
                    <option value="all">Tất cả</option>
                  </select>
                </div>
            </div>

            <div className="requests-list">
                {filteredRequests.length === 0 ? (
                    <div className="no-requests">Không có yêu cầu nào</div>
                ) : (
                    filteredRequests.map((request) => (
                        <div key={request.requestId} className="request-card-pro">
                          <div className="request-card-pro-header">
                            <div>
                              <span className="request-id-pro">#{request.requestId}</span>
                              <span className={`status-badge-pro ${getStatusColor(request.status)}`}>
                                {request.status === 'pending' ? 'Chờ phê duyệt' :
                                 request.status === 'approved' ? 'Đã phê duyệt' : 'Đã từ chối'}
                              </span>
                              <span className={`urgency-badge-pro ${getUrgencyColor(request.urgencyLevel)}`}>
                                {request.urgencyLevel === 'low' ? 'Thấp' :
                                 request.urgencyLevel === 'medium' ? 'Trung bình' :
                                 request.urgencyLevel === 'high' ? 'Cao' : 'Khẩn cấp'}
                              </span>
                            </div>
                            <div className="request-meta-pro">
                              <span><b>Guide:</b> {request.guideName}</span>
                              <span><b>Schedule ID:</b> {request.scheduleId}</span>
                              <span><b>Ngày yêu cầu:</b> {new Date(request.requestedAt).toLocaleString('vi-VN')}</span>
                            </div>
                          </div>
                          <div className="request-card-pro-body">
                            <div className="request-field-pro">
                              <label>Loại yêu cầu:</label>
                              <div className="multiline-pro">{request.requestType}</div>
                            </div>
                            <div className="request-field-pro">
                              <label>Lý do:</label>
                              <div className="multiline-pro">{request.reason}</div>
                            </div>
                        </div>
                        <div>
                            <div className="request-field-pro">
                              <label>Thay đổi đề xuất:</label>
                              <div className="multiline-pro">{request.proposedChanges}</div>
                            </div>
                            {request.adminResponse && (
                              <div className="request-field-pro">
                                <label>Phản hồi admin:</label>
                                <div className="multiline-pro">{request.adminResponse}</div>
                              </div>
                            )}
                          </div>
                          {request.status === 'pending' && (
                            <div className="request-actions-pro">
                              <button className="btn-approve-pro" onClick={() => openModal(request, 'approve')}>Phê duyệt</button>
                              <button className="btn-reject-pro" onClick={() => openModal(request, 'reject')}>Từ chối</button>
                            </div>
                          )}
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal custom-modal">
                        <div className="modal-header custom-modal-header">
                            <div className="modal-title-group">
                              <h2 className="modal-title">
                                {selectedRequest.action === 'approve' ? 'Phê duyệt' : 'Từ chối'} yêu cầu #{selectedRequest.requestId}
                              </h2>
                              <span className="modal-subtitle">Vui lòng xác nhận và nhập phản hồi nếu cần thiết</span>
                            </div>
                            <button className="close-btn custom-close-btn" onClick={() => setShowModal(false)} disabled={actionLoading}>×</button>
                        </div>
                        <div className="modal-body custom-modal-body">
                            <div className="form-group custom-form-group">
                                <label className="custom-label">Phản hồi (tùy chọn):</label>
                                <textarea
                                    className="custom-textarea"
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    placeholder="Nhập phản hồi cho guide..."
                                    rows="4"
                                    disabled={actionLoading}
                                />
                            </div>
                        </div>
                        <div className="modal-footer custom-modal-footer">
                            <button 
                                className="btn-cancel custom-btn-cancel"
                                onClick={() => setShowModal(false)}
                                disabled={actionLoading}
                            >
                                Hủy
                            </button>
                            <button 
                                className={
                                  (selectedRequest.action === 'approve' ? 'btn-approve custom-btn-approve' : 'btn-reject custom-btn-reject') +
                                  (actionLoading ? ' custom-btn-loading' : '')
                                }
                                onClick={() => {
                                    if (selectedRequest.action === 'approve') {
                                        handleApprove(selectedRequest.requestId);
                                    } else {
                                        handleReject(selectedRequest.requestId);
                                    }
                                }}
                                disabled={actionLoading}
                            >
                                {actionLoading 
                                    ? 'Đang xử lý...'
                                    : (selectedRequest.action === 'approve' ? 'Phê duyệt' : 'Từ chối')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleChangeRequests; 