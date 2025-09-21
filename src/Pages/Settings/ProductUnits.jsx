import React, { useState, useEffect } from "react";
import "./ProductUnits.css";
import { AddUnit, GetUnits, DelUnits } from "../../UserService";

function ProductUnits() {
  const [unit, setUnit] = useState("");
  const [unitsList, setUnitsList] = useState([]);

  // Fetch units from backend on mount
  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const data = await GetUnits();
      setUnitsList(data);
    } catch (err) {
      console.error("Error fetching units:", err.message);
    }
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    const trimmedUnit = unit.trim();
    if (!trimmedUnit) return;

    try {
      await AddUnit({ name: trimmedUnit });
      setUnit("");
      fetchUnits(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUnit = async (id) => {
    try {
      await DelUnits(id);
      fetchUnits(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Product Units</h2>

      <form className="unit-form" onSubmit={handleAddUnit}>
        <input
          type="text"
          placeholder="Enter unit (e.g., Kg, Liter, Pcs)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="unit-input"
        />
        <button type="submit" className="unit-button">
          Add Unit
        </button>
      </form>

      <div className="units-list">
        {unitsList.length === 0 && <p>No units added yet.</p>}
        {unitsList.map((u) => (
          <div key={u.id} className="unit-item">
            {u.name}
            <span
              className="unit-delete"
              onClick={() => handleDeleteUnit(u.id)}
            >
              &times;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductUnits;
