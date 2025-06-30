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
        }
    };

    const handleReject = async (requestId) => {
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
        if (filter === 'all') return true;
        return request.status === filter;
    });

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="schedule-change-requests">
            <div className="header">
                <h1>Quản lý yêu cầu thay đổi lịch trình</h1>
                <div className="filters">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Tất cả</option>
                        <option value="pending">Chờ phê duyệt</option>
                        <option value="approved">Đã phê duyệt</option>
                        <option value="rejected">Đã từ chối</option>
                    </select>
                </div>
            </div>

            <div className="requests-list">
                {filteredRequests.length === 0 ? (
                    <div className="no-requests">Không có yêu cầu nào</div>
                ) : (
                    filteredRequests.map((request) => (
                        <div key={request.requestId} className="request-card">
                            <div className="request-header">
                                <div className="request-info">
                                    <h3>Yêu cầu #{request.requestId}</h3>
                                    <p><strong>Guide:</strong> {request.guideName}</p>
                                    <p><strong>Schedule ID:</strong> {request.scheduleId}</p>
                                    <p><strong>Ngày yêu cầu:</strong> {new Date(request.requestedAt).toLocaleString('vi-VN')}</p>
                                </div>
                                <div className="request-status">
                                    <span className={`status-badge ${getStatusColor(request.status)}`}>
                                        {request.status === 'pending' ? 'Chờ phê duyệt' :
                                         request.status === 'approved' ? 'Đã phê duyệt' : 'Đã từ chối'}
                                    </span>
                                    <span className={`urgency-badge ${getUrgencyColor(request.urgencyLevel)}`}>
                                        {request.urgencyLevel === 'low' ? 'Thấp' :
                                         request.urgencyLevel === 'medium' ? 'Trung bình' :
                                         request.urgencyLevel === 'high' ? 'Cao' : 'Khẩn cấp'}
                                    </span>
                                </div>
                            </div>

                            <div className="request-details">
                                <div className="detail-section">
                                    <h4>Loại yêu cầu:</h4>
                                    <p>{request.requestType}</p>
                                </div>
                                <div className="detail-section">
                                    <h4>Lý do:</h4>
                                    <p>{request.reason}</p>
                                </div>
                                <div className="detail-section">
                                    <h4>Thay đổi đề xuất:</h4>
                                    <p>{request.proposedChanges}</p>
                                </div>
                                {request.adminResponse && (
                                    <div className="detail-section">
                                        <h4>Phản hồi admin:</h4>
                                        <p>{request.adminResponse}</p>
                                    </div>
                                )}
                            </div>

                            {request.status === 'pending' && (
                                <div className="request-actions">
                                    <button 
                                        className="btn-approve"
                                        onClick={() => openModal(request, 'approve')}
                                    >
                                        Phê duyệt
                                    </button>
                                    <button 
                                        className="btn-reject"
                                        onClick={() => openModal(request, 'reject')}
                                    >
                                        Từ chối
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>
                                {selectedRequest.action === 'approve' ? 'Phê duyệt' : 'Từ chối'} yêu cầu #{selectedRequest.requestId}
                            </h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Phản hồi (tùy chọn):</label>
                                <textarea
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    placeholder="Nhập phản hồi cho guide..."
                                    rows="4"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn-cancel"
                                onClick={() => setShowModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className={selectedRequest.action === 'approve' ? 'btn-approve' : 'btn-reject'}
                                onClick={() => {
                                    if (selectedRequest.action === 'approve') {
                                        handleApprove(selectedRequest.requestId);
                                    } else {
                                        handleReject(selectedRequest.requestId);
                                    }
                                }}
                            >
                                {selectedRequest.action === 'approve' ? 'Phê duyệt' : 'Từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleChangeRequests; 