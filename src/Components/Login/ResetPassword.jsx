import React, { useState } from "react";
import { resetpassword } from "../../UserService";
import { useParams, useNavigate } from "react-router-dom";
function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetpassword(token, newPassword );
      setMessage(res.message);
      if (res.success) navigate("/login");
    } catch (err) {
      setMessage("Reset failed, link may be expired");
    }
  };

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
export default ResetPassword;