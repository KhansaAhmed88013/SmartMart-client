import React, { useState,useContext ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // ✅ reuse same styling
import { RecoveryContext } from "../../Context/RecoveryContext";
import { RecoverPassword } from "../../UserService";

function Recovered() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const {Username,Role,otpVerified, setPasswordChanged,}=useContext(RecoveryContext)
  const navigate=useNavigate()

  useEffect(() => {
    if (!otpVerified) {
      navigate("/recovery/OTPinput"); // redirect if OTP step not done
    }
  }, [otpVerified]);


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!termsAccepted) {
    alert("You must accept the terms and conditions.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const data = await RecoverPassword(Username, Role, newPassword);

    if (data.success) {
      setPasswordChanged(true);
      navigate('/recovery/Success-in-password-change');
    } else {
      alert(data.message || "Failed to reset password.");
    }
  } catch (error) {
    console.error(error);
    alert("Error resetting password. Try again later.");
  }
};


  return (
    <div className="login-container">
      {/* Heading */}
      <h2>Change Password</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
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
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Terms and Conditions */}
        <div className="terms">
          <div style={{display:'flex',flexDirection:'row',gap:'10px'}}>
            <input
            type="checkbox"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
          />
          <span>I accept the terms and conditions</span>
          </div>
        </div>

        {/* Reset Button */}
        <button type="submit" className="verify-btn">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default Recovered;
