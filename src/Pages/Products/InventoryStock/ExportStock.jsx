import React, { useState } from "react";
import "./InventoryStock.css";

function ExportStock() {
  const [exports, setExports] = useState([
    { code: "P001", name: "Product A", qty: 5, customer: "Customer X", date: "2025-08-22" },
    { code: "P002", name: "Product B", qty: 3, customer: "Customer Y", date: "2025-08-23" }
  ]);

  const [newExport, setNewExport] = useState({ code: "", name: "", qty: "", customer: "" });

  const handleChange = (e) => {
    setNewExport({ ...newExport, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!newExport.code || !newExport.name || !newExport.qty) return alert("Fill all fields!");
    setExports([...exports, { ...newExport, date: new Date().toISOString().slice(0, 10) }]);
    setNewExport({ code: "", name: "", qty: "", customer: "" });
  };

  return (
    <div className="inventory-container">
      <h2>📤 Export Stock</h2>

      {/* Form */}
      <div className="form-section">
        <input name="code" placeholder="Code" value={newExport.code} onChange={handleChange} />
        <input name="name" placeholder="Name" value={newExport.name} onChange={handleChange} />
        <input name="qty" type="number" placeholder="Quantity" value={newExport.qty} onChange={handleChange} />
        <input name="customer" placeholder="Customer" value={newExport.customer} onChange={handleChange} />
        <button onClick={handleAdd}>Add Export</button>
      </div>

      {/* Export Table */}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Code</th><th>Name</th><th>Quantity</th><th>Customer</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {exports.map((item, i) => (
            <tr key={i}>
              <td>{item.code}</td>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.customer}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExportStock;
