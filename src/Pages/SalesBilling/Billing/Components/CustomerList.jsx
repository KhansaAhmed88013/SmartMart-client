// CustomerList.js
import React, { useState } from "react";

function CustomerList({ customers = [], onClose, onSelect, onAddNew }) {
  const [search, setSearch] = useState("");

  // 🔍 Filter customers by name or phone
  const filteredCustomers = customers.filter(
    (cust) =>
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      cust.phone?.includes(search)
  );

  return (
    <div className="overlay">
      <div className="customer-modal">
        <h3>Select Customer</h3>
        <button className="close-btn" onClick={onClose}>X</button>
        
        {/* 🔹 Add New Customer Button */}
        <button className="add-customer-btn" onClick={onAddNew}>
          ➕ Add Customer
        </button>

        {/* 🔍 Search Input */}
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Balance</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {/* Default "Cash" customer option */}
            <tr>
              <td>0</td>
              <td>Cash</td>
              <td>-</td>
              <td>0</td>
              <td>
                <button
                  onClick={() => {
                    onSelect({ id: 0, name: "Cash" });
                    onClose();
                  }}
                >
                  Select
                </button>
              </td>
            </tr>

            {filteredCustomers.map((cust) => (
              <tr key={cust.id}>
                <td>{cust.id}</td>
                <td>{cust.name}</td>
                <td>{cust.phone}</td>
                <td>{cust.balance}</td>
                <td>
                  <button
                    onClick={() => {
                      onSelect(cust);
                      onClose();
                    }}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default CustomerList;
