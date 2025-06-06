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
                
                // Transform media data to handle potential circular references
                const transformedMedia = Array.isArray(res.data) ? res.data.map(media => ({
                    ...media,
                    user: media.user ? {
                        fullName: media.user.fullName,
                        publicId: media.user.publicId
                    } : null
                })) : [];
                
                setMediaList(transformedMedia);
            } catch (err) {
                console.error('Error fetching media:', err);
                // Don't set error state for media as it's not critical
            }
        };
        fetchMedia();
    }, []);

//   // Fetch user info for each unique userid
//     useEffect(() => {
//         const fetchUserInfo = async (publicId) => {
//         try {
//             const token = localStorage.getItem('token');
//             const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
//             const res = await axios.get(`http://localhost:8080/api/users/${publicId}`, config);
//             return res.data;
//         } catch (err) {
//             return null;
//         }
//     };

//     const fetchAllUsers = async () => {
//       // Lấy danh sách publicId duy nhất từ experience
//       const uniqueUserPublicIds = [...new Set(experiences.map(exp => exp.userPublicId))];
//       const userPromises = uniqueUserPublicIds.map(publicId => fetchUserInfo(publicId));
//       const userResults = await Promise.all(userPromises);

//       const newUserMap = {};
//       userResults.forEach((user, index) => {
//         if (user) {
//           newUserMap[uniqueUserPublicIds[index]] = user;
//         }
//       });
//       setUserMap(newUserMap);
//     };

//     if (experiences.length > 0) {
//       fetchAllUsers();
//     }
//   }, [experiences]);

//   // Hàm lấy tên người dùng từ userid
//   const getFullName = (publicId) => {
//     const user = userMap[publicId];
//     return user ? user.fullName : publicId;
//   };

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

  const totalPages = Math.ceil(experiences.length / itemsPerPage);
  const paginatedExperiences = experiences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0', overflowX: 'auto' }}>
      <h2 style={{ color: '#1976d2', fontWeight: 900, fontSize: 32, marginBottom: 32, textAlign: 'center' }}>
        Danh sách tất cả trải nghiệm đã chia sẻ
      </h2>
      {experiences.length === 0 ? (
        <div style={{ color: '#888', fontSize: 18, textAlign: 'center', padding: 32, background: '#f6f7fb', borderRadius: 12, boxShadow: '0 2px 8px #e3e8f0' }}>
          Chưa có trải nghiệm nào.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #e3e8f0', overflow: 'hidden', minWidth: 900 }}>
            <thead>
              <tr style={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 800, fontSize: 17 }}>
                <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>STT</th>
                <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Tiêu đề</th>
                <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Tên người trải nghiệm</th>
                <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Ngày tạo</th>
                <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Nội dung</th>
                <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Ảnh/Video</th>
                <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Trạng thái</th>
                <th style={{ padding: '14px 8px', borderBottom: '2px solid #1976d2', textAlign:'left' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExperiences.map((exp, idx) => {
                const mediaArr = mediaList.filter(m => m.experienceId === exp.experienceId);
                const images = mediaArr.filter(m => m.fileType === 'image');
                const videos = mediaArr.filter(m => m.fileType === 'video');
                const imageUrls = images.map(m => m.fileUrl.startsWith('/uploads/media/') ? m.fileUrl : `/uploads/media/${m.fileUrl}`);
                
                return (
                  <tr key={exp.experienceId} style={{ borderBottom: '1px solid #e3e8f0', fontSize: 16 }}>
                    <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 700 }}>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 700, color: '#1976d2' }}>{exp.title || 'Trải nghiệm'}</td>
                    <td style={{ padding: '12px 8px', color: '#333', fontWeight: 600 }}>{exp.user?.fullName || ''}</td>
                    <td style={{ padding: '12px 8px', color: '#888', minWidth: 120 }}>{exp.createdAt && (new Date(exp.createdAt).toLocaleString())}</td>
                    <td style={{ padding: '12px 8px', color: '#333', minWidth: 180, whiteSpace: 'pre-line' }}>{exp.content}</td>
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
          {/* Pagination controls */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ marginRight: 8, padding: '6px 12px', borderRadius: 4, border: '1px solid #1976d2', background: currentPage === 1 ? '#eee' : '#fff', color: '#1976d2', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              &lt; Trước
            </button>
            <span style={{ lineHeight: '32px', fontWeight: 600, color: '#1976d2' }}>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 4, border: '1px solid #1976d2', background: currentPage === totalPages ? '#eee' : '#fff', color: '#1976d2', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Sau &gt;
            </button>
          </div>
        </div>
      )}
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





