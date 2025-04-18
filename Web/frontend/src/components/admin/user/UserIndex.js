import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/UserIndex.css";


const UserIndex = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

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
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
   
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t("loading")}</span>
          </div>
        </div>

    );
  }

  return (

      <div className="main-container">
        <h1 className="title text-center mb-4">{t("user_list_title")}</h1>
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped user-table">
            <thead className="table-light">
              <tr>
                <th>{t("id")}</th>
                <th>{t("full_name")}</th>
                <th>{t("email")}</th>
                <th>{t("phone")}</th>
                <th>{t("address")}</th>
                <th>{t("status")}</th>
                <th>{t("created_at")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.userid}>
                  <td>{user.userid}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>
                    {user.isActive ? (
                      <span className="badge bg-success">{t("active")}</span>
                    ) : (
                      <span className="badge bg-secondary">{t("inactive")}</span>
                    )}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="text-center">
                    <button className="btn btn-danger btn-sm">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          usersPerPage={usersPerPage}
          totalUsers={users.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>

  );
};

const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container d-flex justify-content-center mt-3">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`pagination-button ${currentPage === number ? "active" : ""}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default UserIndex;