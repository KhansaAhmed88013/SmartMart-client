import "./ShopProfileForm.css";
import { getProfile,AddProfile } from "../../../UserService";
import { useState,useEffect } from "react";
function ShopProfileForm() {

     const [formData, setFormData] = useState({
    shopName: "",
    number1: "",
    number2: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    try {
      const profile = await getProfile();  // res.data is already the object
      console.log("API Response:", profile);

      if (profile) {
        setFormData({
          shopName: profile.shopName || "",
          number1: profile.number1 || "",
          number2: profile.number2 || "",
          location: profile.location || "",
          description: profile.description || "",
        });
      }
    } catch (err) {
      console.log("No existing data or error:", err);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddProfile(formData); 
    alert("Billing data saved successfully!");
    } catch (err) {
      console.error("Error saving billing data:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

    return (  
    <div className="shop-profile-container">
      <h2>Shope Profile</h2>
      <form onSubmit={handleSubmit}>
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

  <button type="submit">Save</button>
</form>
    </div>
     );
}

export default ShopProfileForm;