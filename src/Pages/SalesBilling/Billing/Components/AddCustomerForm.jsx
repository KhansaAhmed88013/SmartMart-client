// AddCustomerForm.js
import React, { useState } from "react";

function AddCustomerForm({ onClose, onCustomerAdded }) {
  // Local state for customer form
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    balance: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to backend API
      const res = await fetch("http://localhost:3000/addCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ⚡ Make sure backend returns new customer WITH id
        // Example: { customer: { id: 7, name: "Ali", ... } }
        onCustomerAdded(data.customer);

        // Close modal after success
        onClose();
      } else {
        alert(data.message || "Error adding customer");
      }
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="overlay">
      <div className="customer-modal">
        <h3>Add New Customer</h3>
        <form onSubmit={handleSubmit}>
          {/* Customer name */}
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          {/* Phone number */}
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          {/* Opening balance */}
          <input
            type="number"
            placeholder="Balance"
            value={form.balance}
            onChange={(e) =>
              setForm({ ...form, balance: Number(e.target.value) })
            }
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomerForm;
