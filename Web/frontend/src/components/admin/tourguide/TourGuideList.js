import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { debounce } from 'lodash';
import TourGuideForm from './TourGuideForm';


const TourGuideList = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTourGuide, setEditingTourGuide] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourGuideToDelete, setTourGuideToDelete] = useState(null);
  
  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 10;

  const fetchTourGuides = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      };

      const response = await axios.get(
        `http://localhost:8080/api/tour-guides?page=${currentPage}&size=${itemsPerPage}&search=${searchTerm}&sort=${sortField},${sortDirection}`,
        config
      );
      
      setTourGuides(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải danh sách hướng dẫn viên:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách hướng dẫn viên');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, sortField, sortDirection]);

  useEffect(() => {
    fetchTourGuides();
  }, [fetchTourGuides]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(0); // Reset to first page on new search
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (tourGuide) => {
    if (tourGuide.guideId && tourGuide.guideId > 0) {
      setEditingTourGuide(tourGuide);
      setShowForm(true);
    } else {
      setError("Không thể chỉnh sửa hướng dẫn viên chưa có hồ sơ. Vui lòng tạo hồ sơ trước.");
    }
  };

  const handleDelete = (tourGuide) => {
    if (tourGuide.guideId && tourGuide.guideId > 0) {
      setTourGuideToDelete(tourGuide);
      setShowDeleteModal(true);
    } else {
      setError("Không thể xóa hướng dẫn viên chưa có hồ sơ.");
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      };

      await axios.delete(`http://localhost:8080/api/tour-guides/${tourGuideToDelete.guideId}`, config);
      fetchTourGuides(); // Refresh the list
      setShowDeleteModal(false);
      setTourGuideToDelete(null);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi xóa hướng dẫn viên:', err);
      setError(err.response?.data?.message || 'Không thể xóa hướng dẫn viên');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingTourGuide(null);
    setTimeout(() => {
      fetchTourGuides();
    }, 100);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản Lý Hướng Dẫn Viên</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingTourGuide(null);
            setShowForm(true);
          }}
        >
          <FaPlus className="me-2" />
          Thêm Hướng Dẫn Viên Mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm hướng dẫn viên..."
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title mb-4">
              {editingTourGuide ? 'Chỉnh Sửa Hướng Dẫn Viên' : 'Thêm Hướng Dẫn Viên Mới'}
            </h3>
            <TourGuideForm 
              tourGuide={editingTourGuide}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTourGuide(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('userId')} style={{ cursor: 'pointer' }}>
                ID Người Dùng {sortField === 'userId' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('userFullName')} style={{ cursor: 'pointer' }}>
                Tên Hướng Dẫn Viên {sortField === 'userFullName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('userEmail')} style={{ cursor: 'pointer' }}>
                Email {sortField === 'userEmail' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('experienceYears')} style={{ cursor: 'pointer' }}>
                Số Năm Kinh Nghiệm {sortField === 'experienceYears' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('specialization')} style={{ cursor: 'pointer' }}>
                Chuyên Môn {sortField === 'specialization' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('languages')} style={{ cursor: 'pointer' }}>
                Ngôn Ngữ {sortField === 'languages' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer' }}>
                Đánh Giá {sortField === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('isAvailable')} style={{ cursor: 'pointer' }}>
                Trạng Thái {sortField === 'isAvailable' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {tourGuides && tourGuides.length > 0 ? tourGuides.map((tourGuide) => (
              <tr key={tourGuide.guideId || tourGuide.userId}>
                <td>{tourGuide.guideId || 'N/A'}</td>
                <td>{tourGuide.userId}</td>
                <td>{tourGuide.userFullName || 'N/A'}</td>
                <td>{tourGuide.userEmail || 'N/A'}</td>
                <td>{tourGuide.experienceYears || 'N/A'}</td>
                <td>{tourGuide.specialization || 'N/A'}</td>
                <td>{tourGuide.languages || 'N/A'}</td>
                <td>{tourGuide.rating || 'N/A'}</td>
                <td>
                  <span className={`badge ${tourGuide.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                    {tourGuide.isAvailable ? 'Có sẵn' : 'Không có sẵn'}
                  </span>
                </td>
                <td>
                  {tourGuide.guideId && tourGuide.guideId > 0 ? (
                    <>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(tourGuide)}
                        title="Chỉnh sửa"
                        style={{ color: '#ffc107', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', padding: 0 }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(tourGuide)}
                        title="Xóa"
                        style={{ color: '#e74c3c', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', padding: 0 }}
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <span className="text-muted">Chưa có hồ sơ</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="text-center">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                Trước
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(index)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác Nhận Xóa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTourGuideToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                Bạn có chắc chắn muốn xóa hướng dẫn viên này không?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTourGuideToDelete(null);
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default TourGuideList; 