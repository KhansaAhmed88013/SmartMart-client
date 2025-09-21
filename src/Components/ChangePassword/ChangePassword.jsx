import React, { useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import { verifyPassword, changePassword } from "../../UserService";
import "./ChangePassword.css";

function ChangePassword() {
  const [step, setStep] = useState(1);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const { currentUser } = useContext(UserContext);

  const handleVerifyOldPassword = async (e) => {
    e.preventDefault();
    try {
      const username = currentUser.username;
      const role = currentUser.role;
      const result = await verifyPassword({ oldPassword, username, role });
      if (result.valid) {
        setStep(2);
        setMessage("");
        setMessageType("");
      } else {
        setMessage("Current password is incorrect!");
        setMessageType("error");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error verifying password");
      setMessageType("error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match!");
      setMessageType("error");
      return;
    }

    if (newPassword === oldPassword) {
      setMessage("New password cannot be the same as the old password!");
      setMessageType("error");
      return;
    }

    try {
      const username = currentUser.username;
      const role = currentUser.role;
      const res = await changePassword({ newPassword, username, role });

      setMessage(res?.message || "Password changed successfully!");
      setMessageType("success");

      setStep(1);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err);
      setMessage(
        err.response?.data?.message || err.message || "Error changing password"
      );
      setMessageType("error");
    }
  };

  const handleCloseMessage = () => {
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>

      {message && (
        <div className={`message-box ${messageType}`}>
          <span>{message}</span>
          <button className="close-btn" onClick={handleCloseMessage}>
            &times;
          </button>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleVerifyOldPassword}>
          <div>
            <label>Current Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleChangePassword}>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Change Password</button>
        </form>
      )}
    </div>
  );
}

export default ChangePassword;
