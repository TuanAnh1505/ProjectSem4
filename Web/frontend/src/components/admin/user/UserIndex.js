import React, { useState, useEffect} from "react";
import { FaTrash, FaExclamationTriangle, FaUserPlus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import "../../styles/admin/UserIndex.css";

const UserIndex = () => {
 
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [message, setMessage] = useState(""); // For success/error messages
  const [deleteAlert, setDeleteAlert] = useState({ show: false, userId: null, userName: "" });
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideForm, setGuideForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    experienceYears: "",
    specialization: "",
    languages: ""
  });
  const [guideLoading, setGuideLoading] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setMessage( "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    if (filterStatus === "active") {
      filtered = filtered.filter((user) => user.isActive);
    } else if (filterStatus === "inactive") {
      filtered = filtered.filter((user) => !user.isActive);
    }
    if (filterType === "guide") {
      filtered = filtered.filter((user) => user.isGuide);
    } else if (filterType === "user") {
      filtered = filtered.filter((user) => !user.isGuide);
    }
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [filterStatus, filterType, users]);

  // Handle user deletion
  const handleDeleteUser = (userId, userName) => {
    setDeleteAlert({ show: true, userId, userName });
  };

  const confirmDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/admin/delete-account/${deleteAlert.userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update state to remove the deleted user
      const updatedUsers = users.filter((user) => user.userid !== deleteAlert.userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setMessage("Tài khoản đã được xóa thành công");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to delete user:", error);
      setMessage("Không thể xóa tài khoản");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setDeleteAlert({ show: false, userId: null, userName: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteAlert({ show: false, userId: null, userName: "" });
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="userindex-main-container">
      <h1 className="userindex-title text-center mb-4">Danh sách tài khoản</h1>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="userindex-btn userindex-btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
          onClick={() => setShowGuideModal(true)}
        >
          <FaUserPlus /> Tạo tài khoản hướng dẫn viên
        </button>
      </div>
      {/* Success/Error Message */}
      {message && (
        <div
          className={`userindex-alert ${
            message.includes("success") ? "userindex-alert-success" : "userindex-alert-danger"
          } userindex-alert-dismissible fade show`}
          role="alert"
        >
          {message}
          <button
            type="button"
            className="userindex-btn-close"
            onClick={() => setMessage("")}
          ></button>
        </div>
      )}
      {/* Filter Section */}
      <div className="userindex-filter-container mb-4">
        <div className="userindex-filter-wrapper">
          <div className="userindex-filter-content">
            <span className="userindex-total-users">
              Tổng số tài khoản: {filteredUsers.length}
            </span>
            <select
              className="userindex-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ marginRight: 8 }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <select
              className="userindex-filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tất cả loại</option>
              <option value="user">User</option>
              <option value="guide">Guide</option>
            </select>
          </div>
        </div>
      </div>
      {/* No Accounts Message */}
      {filteredUsers.length === 0 ? (
        <div className="userindex-alert userindex-alert-warning text-center" role="alert" style={{ marginTop: "20vh" }}>
          Không tìm thấy tài khoản
        </div>
      ) : (
        <div className="userindex-table-responsive">
          <table className="userindex-table">
            <thead className="userindex-table-light">
              <tr>
             
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.userid}>
                  
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>{user.isGuide ? "Guide" : "User"}</td>
                  <td>
                    {user.isActive ? (
                      <span className="userindex-badge userindex-badge-success">Hoạt động</span>
                    ) : (
                      <span className="userindex-badge userindex-badge-secondary">Không hoạt động</span>
                    )}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="text-center">
                    <button
                      className="userindex-btn userindex-btn-danger userindex-btn-sm"
                      onClick={() => handleDeleteUser(user.userid, user.fullName)}
                      title="Xóa tài khoản"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <UserIndexPagination
        usersPerPage={usersPerPage}
        totalUsers={filteredUsers.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      {/* Modal tạo tài khoản hướng dẫn viên */}
      {showGuideModal && (
        <div className="destination-alert-overlay">
          <div className="guide-modal">
            <h2 className="guide-modal-title">
              <FaUserPlus style={{marginRight:8, color:'#7b6ef6', verticalAlign:'middle'}}/> Tạo tài khoản hướng dẫn viên
            </h2>
            <form
              className="guide-modal-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setGuideLoading(true);
                try {
                  const token = localStorage.getItem("token");
                  const response = await fetch("http://localhost:8080/api/tour-guides/admin", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      ...guideForm,
                      experienceYears: parseInt(guideForm.experienceYears),
                    }),
                  });
                  if (!response.ok) {
                    const errorText = await response.text();
                    try {
                        const errorData = JSON.parse(errorText);
                        throw new Error(errorData.message || "Tạo tài khoản thất bại");
                    } catch (e) {
                        throw new Error(errorText || "Tạo tài khoản thất bại");
                    }
                  }
                  setMessage("Tạo tài khoản hướng dẫn viên thành công");
                  setShowGuideModal(false);
                  setGuideForm({
                    fullName: "",
                    email: "",
                    password: "",
                    phone: "",
                    address: "",
                    experienceYears: "",
                    specialization: "",
                    languages: ""
                  });
                  // Reload user list
                  setLoading(true);
                  const token2 = localStorage.getItem("token");
                  const res2 = await fetch("http://localhost:8080/api/admin/users", {
                    headers: { Authorization: `Bearer ${token2}` },
                  });
                  const data2 = await res2.json();
                  setUsers(data2);
                  setFilteredUsers(data2);
                  setTimeout(() => setMessage(""), 3000);
                } catch (error) {
                  let finalMessage;
                  try {
                    const errorObj = JSON.parse(error.message);
                    finalMessage = errorObj.message || 'Có lỗi xảy ra.';
                  } catch (e) {
                    finalMessage = error.message;
                  }
                  setMessage(finalMessage || "Tạo tài khoản thất bại");
                  setTimeout(() => setMessage(""), 3000);
                } finally {
                  setGuideLoading(false);
                }
              }}
            >
              <div className="guide-modal-field">
                <label className="guide-modal-label">Họ tên</label>
                <input type="text" className="guide-modal-input" required value={guideForm.fullName} onChange={e => setGuideForm(f => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div className="guide-modal-field">
                <label className="guide-modal-label">Email</label>
                <input type="email" className="guide-modal-input" required value={guideForm.email} onChange={e => setGuideForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="guide-modal-field">
                <label className="guide-modal-label">Mật khẩu</label>
                <input type="password" className="guide-modal-input" required value={guideForm.password} onChange={e => setGuideForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="guide-modal-field">
                <label className="guide-modal-label">Số điện thoại</label>
                <input type="text" className="guide-modal-input" required value={guideForm.phone} onChange={e => setGuideForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="guide-modal-field">
                <label className="guide-modal-label">Địa chỉ</label>
                <input type="text" className="guide-modal-input" required value={guideForm.address} onChange={e => setGuideForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="guide-modal-field">
                <label className="guide-modal-label">Số năm kinh nghiệm</label>
                <input type="number" className="guide-modal-input" required min={0} value={guideForm.experienceYears} onChange={e => setGuideForm(f => ({ ...f, experienceYears: e.target.value }))} />
              </div>
              <div className="guide-modal-field">
                <label className="guide-modal-label">Chuyên môn</label>
                <input type="text" className="guide-modal-input" required value={guideForm.specialization} onChange={e => setGuideForm(f => ({ ...f, specialization: e.target.value }))} />
              </div>
              <div className="guide-modal-field">
                <label className="guide-modal-label">Ngôn ngữ</label>
                <input type="text" className="guide-modal-input" required value={guideForm.languages} onChange={e => setGuideForm(f => ({ ...f, languages: e.target.value }))} />
              </div>
              <div className="guide-modal-btn-row">
                <button type="button" className="guide-modal-btn guide-modal-btn-cancel" onClick={() => setShowGuideModal(false)} disabled={guideLoading}>Hủy</button>
                <button type="submit" className="guide-modal-btn guide-modal-btn-create" disabled={guideLoading}>
                  {guideLoading ? (
                    <span className="guide-modal-loading">
                      <span className="spinner-border spinner-border-sm" role="status" style={{marginRight:4}}></span>
                      Đang tạo...
                    </span>
                  ) : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal xác nhận xóa */}
      {deleteAlert.show && (
        <div className="destination-alert-overlay">
          <div className="destination-alert-dialog">
            <div className="destination-alert-icon-wrapper">
              <FaExclamationTriangle className="destination-alert-icon" />
            </div>
            <h2 className="destination-alert-title">Xóa Tài Khoản</h2>
            <p className="destination-alert-message">
              Bạn có chắc chắn muốn xóa tài khoản "{deleteAlert.userName}"? Hành động này không thể hoàn tác.
            </p>
            <div className="destination-alert-buttons">
              <button
                className="destination-alert-btn destination-alert-btn-cancel"
                onClick={cancelDelete}
              >
                Hủy
              </button>
              <button
                className="destination-alert-btn destination-alert-btn-delete"
                onClick={confirmDeleteUser}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserIndexPagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="userindex-pagination-container d-flex justify-content-center mt-3">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`userindex-pagination-button ${currentPage === number ? "active" : ""}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
}; 
export default UserIndex;