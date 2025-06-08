import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ExperienceIndex() {
    const [experiences, setExperiences] = useState([]);
    const [mediaList, setMediaList] = useState([]);
    // const [userMap, setUserMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalGallery, setModalGallery] = useState({ images: [], index: 0, open: false });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Đưa fetchExperiences ra ngoài useEffect để có thể gọi lại
    const fetchExperiences = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get('http://localhost:8080/api/experiences', config);
            
            // Transform the data to handle potential circular references
            const transformedData = Array.isArray(res.data) ? res.data.map(exp => ({
                ...exp,
                user: exp.user ? {
                    fullName: exp.user.fullName,
                    publicId: exp.user.publicId
                } : null
            })) : [];
            
            setExperiences(transformedData);
            setError('');
        } catch (err) {
            console.error('Error fetching experiences:', err);
            setError('Không thể tải danh sách trải nghiệm. Vui lòng thử lại sau.');
            setExperiences([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const res = await axios.get('http://localhost:8080/api/media', config);
                
                // Chỉ lấy các trường cần thiết của media, không lấy user lồng nhau
                const transformedMedia = Array.isArray(res.data) ? res.data.map(media => ({
                    mediaId: media.mediaId,
                    fileType: media.fileType,
                    fileUrl: media.fileUrl,
                    uploadedAt: media.uploadedAt,
                    userPublicId: media.userPublicId || (media.user ? media.user.publicId : null),
                    experienceId: media.experienceId // nếu cần liên kết với experience
                })) : [];
                
                setMediaList(transformedMedia);
            } catch (err) {
                console.error('Error fetching media:', err);
                // Don't set error state for media as it's not critical
            }
        };
        fetchMedia();
    }, []);


  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Đang tải danh sách trải nghiệm...</div>;
  if (error) return <div style={{ padding: 32, color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!Array.isArray(experiences)) return <div style={{ padding: 32, color: 'red', textAlign: 'center' }}>Dữ liệu không hợp lệ</div>;

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.put(`http://localhost:8080/api/experiences/${id}/approve`, {}, config);
    fetchExperiences();
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.put(`http://localhost:8080/api/experiences/${id}/reject`, {}, config);
    fetchExperiences();
  };

  // Sắp xếp trải nghiệm mới nhất lên trên
  const sortedExperiences = [...experiences].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0', overflowX: 'auto' }}>
      <h2 style={{ color: '#1976d2', fontWeight: 900, fontSize: 32, marginBottom: 32, textAlign: 'center', letterSpacing: 1 }}>
        Quản lý trải nghiệm người dùng
      </h2>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e3e8f0', padding: 24, minWidth: 900 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 800, fontSize: 17 }}>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>STT</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Tiêu đề</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Người gửi</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Ngày tạo</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Nội dung</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Ảnh/Video</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Trạng thái</th>
              <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedExperiences.map((exp, idx) => {
              const mediaArr = mediaList.filter(m => m.experienceId === exp.experienceId);
              const images = mediaArr.filter(m => m.fileType === 'image');
              const videos = mediaArr.filter(m => m.fileType === 'video');
              const imageUrls = images.map(m => m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}`);
              
              return (
                <tr key={exp.experienceId} style={{ borderBottom: '1px solid #e3e8f0', fontSize: 16 }}>
                  <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                  <td style={{ padding: '12px 8px', fontWeight: 700, color: '#1976d2', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={exp.title}>
                    {exp.title && exp.title.length > 30 ? exp.title.slice(0, 30) + '...' : exp.title || 'Trải nghiệm'}
                  </td>
                  <td style={{ padding: '12px 8px', color: '#333', fontWeight: 600 }}>{exp.user?.fullName || ''}</td>
                  <td style={{ padding: '12px 8px', color: '#888', minWidth: 120 }}>{exp.createdAt && (new Date(exp.createdAt).toLocaleString())}</td>
                  <td style={{ padding: '12px 8px', color: '#333', minWidth: 180, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={exp.content}>
                    {exp.content && exp.content.length > 80 ? exp.content.slice(0, 80) + '...' : exp.content}
                  </td>
                  <td style={{ padding: '12px 8px', minWidth: 180 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      {/* Hiển thị 1 ảnh đại diện, overlay số lượng nếu có nhiều ảnh */}
                      {images.length > 0 && (
                        <div style={{ position: 'relative', width: 54, height: 54, cursor: 'pointer' }}
                          onClick={() => setModalGallery({ images: imageUrls, index: 0, open: true })}>
                          <img
                            src={imageUrls[0]}
                            alt="media"
                            style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 6, border: '1.5px solid #1976d2', background: '#fafafa' }}
                          />
                          {images.length > 1 && (
                            <div style={{
                              position: 'absolute',
                              top: 0, left: 0, right: 0, bottom: 0,
                              background: 'rgba(0,0,0,0.45)',
                              color: '#fff',
                              fontWeight: 900,
                              fontSize: 18,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 6
                            }}>
                              +{images.length - 1}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Hiển thị video (nếu có) */}
                      {videos.map(m => {
                        const url = m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}`;
                        return (
                          <video
                            key={m.mediaId}
                            src={url}
                            controls
                            style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 6, border: '1.5px solid #1976d2', background: '#fafafa' }}
                          />
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px', color: '#333', fontWeight: 600 }}>
                    {exp.status === 'approved' ? 'Đã duyệt' : exp.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {(exp.status === 'pending' || exp.status === 'rejected') && (
                        <button
                          onClick={() => handleApprove(exp.experienceId)}
                          title="Duyệt"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#4caf50',
                            fontSize: 22,
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          onMouseOver={e => (e.currentTarget.style.background = '#e8f5e9')}
                          onMouseOut={e => (e.currentTarget.style.background = 'none')}
                        >
                          ✔
                        </button>
                      )}
                      {exp.status === 'pending' && (
                        <button
                          onClick={() => handleReject(exp.experienceId)}
                          title="Từ chối"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f44336',
                            fontSize: 22,
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          onMouseOver={e => (e.currentTarget.style.background = '#ffebee')}
                          onMouseOut={e => (e.currentTarget.style.background = 'none')}
                        >
                          ✖
                        </button>
                      )}
                      {exp.status === 'approved' && (
                        <span
                          title="Đã duyệt"
                          style={{
                            color: '#bdbdbd',
                            fontSize: 22,
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f5f5f5',
                          }}
                        >
                          ✔
                        </span>
                      )}
                      {exp.status === 'rejected' && (
                        <span
                          title="Đã từ chối"
                          style={{
                            color: '#bdbdbd',
                            fontSize: 22,
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f5f5f5',
                          }}
                        >
                          ✖
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Modal gallery ảnh lớn với <, > */}
      {modalGallery.open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn .2s',
          }}
          onClick={() => setModalGallery(g => ({ ...g, open: false }))}
        >
          <div
            style={{
              position: 'relative',
              background: 'transparent',
              borderRadius: 12,
              boxShadow: '0 4px 32px #0008',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalGallery(g => ({ ...g, open: false }))}
              style={{
                position: 'absolute',
                top: -18,
                right: -18,
                background: '#fff',
                color: '#1976d2',
                border: 'none',
                borderRadius: '50%',
                width: 38,
                height: 38,
                fontSize: 26,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #0004',
                zIndex: 2,
              }}
              title="Đóng"
            >×</button>
            {modalGallery.index > 0 && (
              <button
                onClick={() => setModalGallery(g => ({ ...g, index: g.index - 1 }))}
                style={{
                  position: 'absolute',
                  left: -48,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  color: '#1976d2',
                  border: 'none',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  fontSize: 28,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #0004',
                  zIndex: 2,
                }}
                title="Ảnh trước"
              >&lt;</button>
            )}
            <img
              src={modalGallery.images[modalGallery.index]}
              alt="preview-large"
              style={{
                maxWidth: '80vw',
                maxHeight: '80vh',
                borderRadius: 12,
                boxShadow: '0 2px 16px #0006',
                background: '#fff',
              }}
            />
            {modalGallery.index < modalGallery.images.length - 1 && (
              <button
                onClick={() => setModalGallery(g => ({ ...g, index: g.index + 1 }))}
                style={{
                  position: 'absolute',
                  right: -48,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  color: '#1976d2',
                  border: 'none',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  fontSize: 28,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #0004',
                  zIndex: 2,
                }}
                title="Ảnh tiếp theo"
              >&gt;</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper cho phân trang dạng nút
function getPageNumbers(current, total) {
  const maxPages = 5;
  if (total <= maxPages) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 3) {
    pages.push(1, 2, 3, '...', total);
  } else if (current >= total - 2) {
    pages.push(1, '...', total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }
  return pages;
}

const pageBtn = (active, isNumber) => ({
  minWidth: 40,
  height: 40,
  borderRadius: 8,
  border: 'none',
  background: active ? '#1976d2' : '#f5f6fa',
  color: active ? '#fff' : '#1976d2',
  fontWeight: 700,
  fontSize: 18,
  margin: 0,
  padding: 0,
  cursor: active ? 'default' : 'pointer',
  boxShadow: active ? '0 2px 8px #1976d2aa' : 'none',
  outline: 'none',
  transition: 'background 0.18s, color 0.18s',
  ...(isNumber && !active ? {
    ':hover': {
      background: '#e3f2fd',
      color: '#1565c0'
    }
  } : {}),
  opacity: active ? 1 : undefined
});





