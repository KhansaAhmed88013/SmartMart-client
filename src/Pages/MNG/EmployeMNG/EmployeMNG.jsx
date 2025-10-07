import { getUsers, deleteUser } from "../../../UserService";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeMNG.css";
import { UserContext } from "../../../Context/UserContext";

function EmployeMNG() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(""); // success message
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
  try {
    const result = await getUsers();
    console.log("Fetched users:", result);
    setUsers(Array.isArray(result) ? result : result.users || []); // ✅ fix
  } catch (err) {
    console.log(err);
  }
};

    fetchUser();
  }, []);

  const handleAddUser = () => {
    navigate("/addUser");
  };

  const handleDeleteUser = async (username) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(username); // Call backend to delete
        setUsers(users.filter((u) => u.username !== username)); // Remove from state
        setMessage(`User "${username}" deleted successfully.`);
        setTimeout(() => setMessage(""), 3000); // hide message after 3s
      } catch (err) {
        console.log(err);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="employee-container">
      <h2>Employee Management</h2>

      <button className="add-user-btn" onClick={handleAddUser}>
        + Add User
      </button>

      {message && <div className="success-message">{message}</div>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="table-responsive">
          <table className="employee-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td data-label="#"> {index + 1} </td>
                  <td data-label="Username"> {user.username} </td>
                  <td data-label="Full Name"> {user.full_name} </td>
                  <td data-label="Role"> {user.role} </td>
                  <td data-label="Email"> {user.email} </td>
                  <td data-label="Last Login">
                    {new Date(user.last_login).toLocaleString()}
                  </td>
                  <td
                    data-label="Status"
                    className={
                      user.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {user.status}
                  </td>
                  <td data-label="Action">
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.username)}
                      disabled={user.username === currentUser.username}
                      title={
                        user.username === currentUser.username
                          ? "You can't delete yourself"
                          : "Delete user"
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmployeMNG;
