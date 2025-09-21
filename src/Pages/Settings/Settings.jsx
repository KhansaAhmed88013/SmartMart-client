import React from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css"; // separate CSS file

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      <div className="settings-card" onClick={() => navigate("/shopProfile")}>
        Shop Profile
      </div>
      <div className="settings-card" onClick={() => navigate("/units")}>
        Product Units
      </div>
      <div className="settings-card" onClick={() => navigate("/changePassword")}>
        Change Password
      </div>
    </div>
  );
}

export default Settings;
