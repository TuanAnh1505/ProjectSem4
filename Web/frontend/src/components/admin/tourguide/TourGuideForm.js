import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';

const TourGuideForm = ({ tourGuide, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    userId: '',
    experienceYears: '',
    specialization: '',
    languages: '',
    rating: '',
    isAvailable: true
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [guideUsers, setGuideUsers] = useState([]);

  // Load user data if editing
  useEffect(() => {
    // Lấy danh sách user có role là guide
    const fetchGuideUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };
        const response = await axios.get('http://localhost:8080/api/users?role=GUIDE', config);
        setGuideUsers(response.data.map(user => ({
          value: user.userid,
          label: `${user.fullName} (${user.email})`
        })));
      } catch (err) {
        console.error('Lỗi khi tải danh sách user có role GUIDE:', err);
        setGuideUsers([]);
      }
    };
    fetchGuideUsers();
    if (tourGuide) {
      setFormData(prev => {
        const isEmpty = !prev.userId && !prev.experienceYears && !prev.specialization && !prev.languages && !prev.rating;
        return isEmpty ? {
        userId: tourGuide.userId || '',
        experienceYears: tourGuide.experienceYears || '',
        specialization: tourGuide.specialization || '',
        languages: tourGuide.languages || '',
        rating: tourGuide.rating || '',
        isAvailable: tourGuide.isAvailable ?? true
        } : prev;
      });
      if (tourGuide.userId) {
        loadUserDetails(tourGuide.userId);
      }
    }
  }, [tourGuide]);

  // Load user details
  const loadUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.get(`http://localhost:8080/api/users?role=GUIDE`, config);
      const user = response.data.find(u => u.userid === userId);
      if (user) {
      setSelectedUser({
          value: user.userid,
          label: `${user.fullName} (${user.email})`
      });
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin người dùng:', err);
    }
  };

  // Search users with debounce
  const loadUsers = useCallback(
    debounce(async (inputValue, callback) => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.get(
          `http://localhost:8080/api/users?role=GUIDE`,
          config
        );
        const options = response.data
          .filter(user => user.fullName.toLowerCase().includes(inputValue.toLowerCase()) || 
                         user.email.toLowerCase().includes(inputValue.toLowerCase()))
          .map(user => ({
            value: user.userid,
          label: `${user.fullName} (${user.email})`
        }));
        callback(options);
      } catch (err) {
        console.error('Lỗi khi tìm kiếm người dùng:', err);
        callback([]);
      }
    }, 500),
    [axios]
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = 'Vui lòng chọn người dùng';
    if (!formData.experienceYears) newErrors.experienceYears = 'Số năm kinh nghiệm là bắt buộc';
    if (isNaN(formData.experienceYears) || formData.experienceYears < 0) {
      newErrors.experienceYears = 'Số năm kinh nghiệm phải là số dương';
    }
    if (!formData.specialization) newErrors.specialization = 'Chuyên môn là bắt buộc';
    if (!formData.languages) newErrors.languages = 'Ngôn ngữ là bắt buộc';
    if (formData.rating && (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 5)) {
      newErrors.rating = 'Đánh giá phải từ 0 đến 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
    setFormData(prev => ({
      ...prev,
      userId: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    };

    try {
      if (tourGuide) {
        await axios.put(`http://localhost:8080/api/tour-guides/${tourGuide.guideId}`, formData, config);
        setSuccess(true);
        setTimeout(() => {
        if (onSubmit) onSubmit();
        }, 1000);
      } else {
        await axios.post('http://localhost:8080/api/tour-guides', formData, config);
        setSuccess(true);
        setFormData({
          userId: '',
          experienceYears: '',
          specialization: '',
          languages: '',
          rating: '',
          isAvailable: true
        });
        setSelectedUser(null);
        setTimeout(() => {
        if (onSubmit) onSubmit();
        }, 1000);
      }
    } catch (err) {
      console.error('Lỗi khi lưu hướng dẫn viên:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Đã xảy ra lỗi khi lưu hướng dẫn viên.');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">Add Tour Guide</h3>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  {tourGuide ? 'Cập nhật hướng dẫn viên thành công!' : 'Thêm hướng dẫn viên mới thành công!'}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="userId" className="form-label">Chọn Người Dùng</label>
                  <Select
                    id="userId"
                    value={guideUsers.find(u => u.value === formData.userId) || null}
                    onChange={selected => setFormData(prev => ({
                      ...prev,
                      userId: selected ? selected.value : ''
                    }))}
                    options={guideUsers}
                    placeholder="Chọn hướng dẫn viên..."
                    isDisabled={!!tourGuide}
                    isClearable
                    className={errors.userId ? 'is-invalid' : ''}
                  />
                  {errors.userId && <div className="invalid-feedback">{errors.userId}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="experienceYears" className="form-label">Số Năm Kinh Nghiệm</label>
                  <input
                    type="number"
                    className={`form-control ${errors.experienceYears ? 'is-invalid' : ''}`}
                    id="experienceYears"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                  />
                  {errors.experienceYears && <div className="invalid-feedback">{errors.experienceYears}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="specialization" className="form-label">Chuyên Môn</label>
                  <input
                    type="text"
                    className={`form-control ${errors.specialization ? 'is-invalid' : ''}`}
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                  {errors.specialization && <div className="invalid-feedback">{errors.specialization}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="languages" className="form-label">Ngôn Ngữ</label>
                  <input
                    type="text"
                    className={`form-control ${errors.languages ? 'is-invalid' : ''}`}
                    id="languages"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                  />
                  {errors.languages && <div className="invalid-feedback">{errors.languages}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">Đánh Giá (0-5)</label>
                  <input
                    type="number"
                    className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                  {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isAvailable"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isAvailable">Có Sẵn</label>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {tourGuide ? 'Cập Nhật' : 'Thêm Mới'} Hướng Dẫn Viên
                  </button>
                  {onCancel && (
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideForm; 