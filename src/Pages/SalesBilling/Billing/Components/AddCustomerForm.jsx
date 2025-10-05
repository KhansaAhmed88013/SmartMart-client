import './CustomerList.css'
import React, { useState } from "react";

function AddCustomerForm({ onClose, onCustomerAdded }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    balance: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/addCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        onCustomerAdded(data.customer); // ✅ backend must return new customer with id
        onClose(); // close modal
      } else {
        alert(data.message || "Error adding customer");
      }
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
  <div className="customer-list">
    <div className="overlay" onClick={onClose}>
      <div
        className="customer-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Add New Customer</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            type="number"
            placeholder="Balance"
            value={form.balance}
            onChange={(e) =>
              setForm({ ...form, balance: Number(e.target.value) })
            }
          />

          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default AddCustomerForm;
