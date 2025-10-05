import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecoveryContext } from "../../Context/RecoveryContext";
import "./Login.css";

function SuccessMsg() {
  const { passwordChanged } = useContext(RecoveryContext);
  const navigate = useNavigate();

  // Redirect if user somehow lands here without completing password change
  useEffect(() => {
    if (!passwordChanged) {
      navigate("/recovery/Recovered");
    }
  }, [passwordChanged, navigate]);

  return (
    <div className="login-container">
      {/* Success Message */}
      <h2>Password Changed</h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "green",
          fontWeight: "500",
        }}
      >
        ✅ You have successfully changed your password
      </p>

      {/* Login Button */}
      <button
        className="verify-btn"
        onClick={() => navigate("/recovery/login")}
      >
        Login Now
      </button>
    </div>
  );
}

export default SuccessMsg;
