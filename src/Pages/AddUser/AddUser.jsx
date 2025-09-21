import React, { useState, useEffect,useContext } from "react";
import { addUser } from "../../UserService";
import "./AddUser.css";
import { UserContext } from "../../Context/UserContext";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Cashier");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const {currentUser}=useContext(UserContext)

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await addUser({
        username,
        full_name: fullName,
        email,           // ✅ send email to backend
        password,
        role,
        createdBy:currentUser.username
      });

      setMessage(
        response.message ||
          (response.success ? "User added successfully!" : "Failed to add user.")
      );

      if (response.success) {
        setUsername("");
        setFullName("");
        setEmail("");     // ✅ reset email
        setPassword("");
        setRole("Cashier");
      }
    } catch (err) {
      setMessage("Error occurred while adding user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="addUserContainer">
      <h2>Add User</h2>
      <form className="addUserForm" onSubmit={handleAddUser}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>  {/* ✅ Added Email field */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Cashier">Cashier</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {message && <p className="message">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
