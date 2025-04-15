import React from "react";
import { useNavigate } from "react-router-dom";

const UserIndex = () => {
  const navigate = useNavigate();

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]; // Example user data

  const handleEdit = (userId) => {
    navigate("/edit-user", { state: { userId } }); // Pass userId to EditUser page
  };

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserIndex;
