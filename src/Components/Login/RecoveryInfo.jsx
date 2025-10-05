import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Reuse the same CSS
import { RecoveryContext } from "../../Context/RecoveryContext";
import { getRecoveryEmail } from "../../UserService";

function RecoveryInfo() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const { setOTP, setEmail, setusername, setrole,setEmailVerified } = useContext(RecoveryContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // <-- new loading state
  const navigate = useNavigate();

  const GetEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // start loading

    try {
      const result = await getRecoveryEmail({ username, role });
      console.log(result);
      if (!result.email) {
        setError("User not found or no email associated.");
        setLoading(false);
        return;
      }

      setEmail(result.email); // update context
      await NavigateToOTP(result.email); // pass email directly
    } catch (err) {
      setError("Error in Getting Email");
      console.error(err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const NavigateToOTP = async (userEmail) => {
    if (userEmail) {
      try {
        const otp = Math.floor(Math.random() * 90000 + 10000);
        setOTP(otp);

        const response = await fetch("http://localhost:3000/send_recovery_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipient_email: userEmail, OTP: otp }),
        });

        const data = await response.json();

        if (data.success) {
          setusername(username);
          setrole(role);
          setEmailVerified(true);
          navigate("/recovery/OTPinput");
        } else {
          setError(data.message || "Failed to send OTP. Try again.");
        }
      } catch (err) {
        console.error(err);
        setError("Error sending OTP. Try again later.");
      }
    } else {
      setError("You don't have any email");
    }
  };

  return (
    <div className="login-container">
      <h2>Enter Recovery Information</h2>
      <form onSubmit={GetEmail}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select role</option>
            <option value="Admin">Admin</option>
            <option value="Cashier">Cashier</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Submit Info"} {/* <-- show sending */}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default RecoveryInfo;
