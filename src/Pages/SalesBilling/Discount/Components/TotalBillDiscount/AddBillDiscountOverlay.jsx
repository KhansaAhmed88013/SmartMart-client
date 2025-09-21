import React from "react";
import "./TotalBillDiscount.css";

function AddBillDiscountOverlay({ form, setForm, onSave, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <h3>Add Total Bill Discount</h3>

        <div className="form-row">
          <select
            value={form.conditionType}
            onChange={(e) => setForm({ ...form, conditionType: e.target.value })}
          >
            <option value="Above">Above</option>
            <option value="EqualOrAbove">Equal or Above</option>
            <option value="Below">Below</option>
          </select>

          <input
            type="number"
            placeholder="Amount (PKR)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        <div className="form-row">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="Percentage">Percentage</option>
            <option value="Flat">Flat Amount</option>
          </select>

          <input
            type="number"
            placeholder="Discount Value"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
        </div>

        <div className="form-row">
          <input
            type="date"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
          />
          <input
            type="date"
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button onClick={onSave}>Save</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBillDiscountOverlay;
