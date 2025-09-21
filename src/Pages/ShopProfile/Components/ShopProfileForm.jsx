import React, { useState, useEffect, useContext } from "react";
import { AddProfile } from "../../../UserService";
import { ProfileContext } from "../../../Context/ProfileContext";

import "../../AddUser/AddUser.css";

function ShopProfileForm() {
  // ✅ Safe context handling
  const context = useContext(ProfileContext);

  // Debug log to check if context is undefined
  useEffect(() => {
    if (!context) {
      console.error(
        "ProfileContext is undefined! Make sure ShopProfileForm is wrapped inside <ProfileProvider>"
      );
    } else {
      console.log("ProfileContext loaded:", context);
    }
  }, [context]);

  const { ProfileData, fetchProfile, loading } = context || {};

  const [formData, setFormData] = useState({
    shopName: "",
    number1: "",
    number2: "",
    location: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  // Update formData when ProfileData changes
  useEffect(() => {
  setFormData({
    shopName: ProfileData?.shopName || "",
    number1: ProfileData?.number1 || "",
    number2: ProfileData?.number2 || "",
    location: ProfileData?.location || "",
    description: ProfileData?.description || "",
  });
}, [ProfileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AddProfile(formData);
      setMessage(res?.message || "Profile updated successfully!");
      if (fetchProfile) fetchProfile();
    } catch (err) {
      setMessage("Error saving profile data.");
      console.error(err);
    }
  };

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!context) return <div>Error: ProfileContext not found</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="addUserContainer">
      <h2>Shop Profile</h2>
      {message && <p className="message" style={{color:'green'}}>{message}</p>}
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div>
          <label>Shop Name:</label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-row">
          <div>
            <label>Phone Number 1:</label>
            <input
              type="tel"
              name="number1"
              value={formData.number1}
              onChange={handleChange}
              pattern="^(\+92\d{3}-?\d{7}|0\d{3}-?\d{7})$"
              placeholder="0311-1234567 or +92311-1234567"
              required
            />
          </div>
          <div>
            <label>Phone Number 2:</label>
            <input
              type="tel"
              name="number2"
              value={formData.number2}
              onChange={handleChange}
              pattern="^(\+92\d{3}-?\d{7}|0\d{3}-?\d{7})$"
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default ShopProfileForm;
