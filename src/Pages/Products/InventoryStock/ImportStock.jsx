import React, { useState } from "react";
import "./InventoryStock.css";

function ImportStock() {
  const [imports, setImports] = useState([
    { code: "P004", name: "Product D", qty: 20, supplier: "Supplier A", date: "2025-08-20" },
    { code: "P005", name: "Product E", qty: 15, supplier: "Supplier B", date: "2025-08-21" }
  ]);

  const [newImport, setNewImport] = useState({ code: "", name: "", qty: "", supplier: "" });

  const handleChange = (e) => {
    setNewImport({ ...newImport, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!newImport.code || !newImport.name || !newImport.qty) return alert("Fill all fields!");
    setImports([...imports, { ...newImport, date: new Date().toISOString().slice(0, 10) }]);
    setNewImport({ code: "", name: "", qty: "", supplier: "" });
  };

  return (
    <div className="inventory-container">
      <h2>📥 Import Stock</h2>

      {/* Form */}
      <div className="form-section">
        <input name="code" placeholder="Code" value={newImport.code} onChange={handleChange} />
        <input name="name" placeholder="Name" value={newImport.name} onChange={handleChange} />
        <input name="qty" type="number" placeholder="Quantity" value={newImport.qty} onChange={handleChange} />
        <input name="supplier" placeholder="Supplier" value={newImport.supplier} onChange={handleChange} />
        <button onClick={handleAdd}>Add Import</button>
      </div>

      {/* Import Table */}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Code</th><th>Name</th><th>Quantity</th><th>Supplier</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {imports.map((item, i) => (
            <tr key={i}>
              <td>{item.code}</td>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.supplier}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ImportStock;
