import React, { useState, useEffect } from 'react';

function FeedbackIndex() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // feedbackId đang cập nhật

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/feedbacks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Sắp xếp feedbacks theo createdAt giảm dần
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setFeedbacks(data);
        } else {
          console.error('Failed to fetch feedbacks');
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    }
    async function fetchStatuses() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/feedback-status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setStatuses(await res.json());
        }
      } catch (e) { console.error(e); }
    }
    fetchFeedbacks();
    fetchStatuses();
  }, []);

  const handleStatusChange = async (feedback, newStatusId) => {
    setUpdating(feedback.feedbackId);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/feedbacks/${feedback.feedbackId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ statusId: parseInt(newStatusId) })
      });
      if (res.ok) {
        setFeedbacks(fbs => fbs.map(fb =>
          fb.feedbackId === feedback.feedbackId
            ? { ...fb, statusName: statuses.find(s => s.statusId === parseInt(newStatusId))?.statusName }
            : fb
        ));
      } else {
        alert('Cập nhật trạng thái thất bại!');
      }
    } catch (e) {
      alert('Lỗi khi cập nhật trạng thái!');
    }
    setUpdating(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ color: '#1976d2', fontWeight: 900, fontSize: 28, marginBottom: 24, letterSpacing: 1, textAlign: 'center' }}>Danh sách đánh giá</h2>
      <div style={{ overflowX: 'auto', borderRadius: 16, boxShadow: '0 4px 24px #e3e8f0', background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 900, borderRadius: 16, overflow: 'hidden' }}>
          <thead>
            <tr style={{background: 'rgb(227, 242, 253)', color: 'rgb(25, 118, 210)', fontWeight: 800, fontSize: 17 }}>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid rgb(25, 118, 210)', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid rgb(25, 118, 210)', textAlign: 'left' }}>User</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid rgb(25, 118, 210)', textAlign: 'left' }}>Tour</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid rgb(25, 118, 210)', textAlign: 'left' }}>Rating</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid rgb(25, 118, 210)', textAlign: 'left' }}>Message</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid rgb(25, 118, 210)', textAlign: 'left' }}>Ngày tạo</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid rgb(25, 118, 210)', textAlign: 'left' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, idx) => (
              <tr key={feedback.feedbackId} style={{ background: idx % 2 === 0 ? '#f8fafd' : '#e3f2fd', transition: 'background 0.2s' }}>
                <td style={{ padding: '12px 10px', border: 'none', textAlign: 'left', fontWeight: 700 }}>{feedback.feedbackId}</td>
                <td style={{ padding: '12px 10px', border: 'none', minWidth: 120 }}>{feedback.user?.fullName || feedback.userFullName || 'N/A'}</td>
                <td style={{ padding: '12px 10px', border: 'none', textAlign: 'left' }}>{feedback.tourId}</td>
                <td style={{ padding: '12px 10px', border: 'none', textAlign: 'left', fontSize: 18 }}>
                  {Array.from({ length: feedback.rating }, (_, i) => <span key={i} style={{ color: '#FFD700', fontSize: 18 }}>★</span>)}
                  {Array.from({ length: 5 - feedback.rating }, (_, i) => <span key={i} style={{ color: '#e0e0e0', fontSize: 18 }}>★</span>)}
                </td>
                <td style={{ padding: '12px 10px', border: 'none', maxWidth: 320, whiteSpace: 'pre-line', overflow: 'hidden', textOverflow: 'ellipsis' }}>{feedback.message}</td>
                <td style={{ padding: '12px 10px', border: 'none', textAlign: 'left', minWidth: 140 }}>{new Date(feedback.createdAt).toLocaleString()}</td>
                <td style={{ padding: '12px 10px', border: 'none', textAlign: 'left' }}>
                  <select
                    value={statuses.find(s => s.statusName === feedback.statusName)?.statusId || ''}
                    onChange={e => handleStatusChange(feedback, e.target.value)}
                    disabled={updating === feedback.feedbackId}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 8,
                      border: '1.5px solid #1976d2',
                      background: '#f8fafd',
                      color: '#1976d2',
                      fontWeight: 700,
                      fontSize: 15,
                      minWidth: 120,
                      outline: 'none',
                      boxShadow: updating === feedback.feedbackId ? '0 0 0 2px #90caf9' : 'none',
                      transition: 'box-shadow 0.2s',
                      cursor: updating === feedback.feedbackId ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <option value='' disabled>Chọn trạng thái</option>
                    {statuses.map(status => (
                      <option key={status.statusId} value={status.statusId}>{status.statusName}</option>
                    ))}
                  </select>
                  {updating === feedback.feedbackId && <span style={{marginLeft:8, color:'#1976d2', fontWeight:600}}>Đang cập nhật...</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeedbackIndex;
