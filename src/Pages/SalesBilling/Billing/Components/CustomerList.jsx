import { GetCutomers } from "../../../../UserService";
import React, { useState, useEffect } from "react";
import './CustomerList.css'

function CustomerList({ onClose, onSelect, onAddNew }) {
  const [search, setSearch] = useState("");
  const [customer, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customers = await GetCutomers();
        setCustomers(customers);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customer.filter(
    (cust) =>
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      cust.phone?.includes(search)
  );

  return (
    <div className="customer-list">
      <div className="overlay" onClick={onClose}>
      <div
        className="customer-modal"
        onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking inside
      >
        <h3>Select Customer</h3>
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        <button className="add-customer-btn" onClick={onAddNew}>
          ➕ Add Customer
        </button>

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
              <th>#</th>
              <th>Name</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust, index) => (
              <tr key={cust.id}>
                <td>{index + 1}</td>
                <td>{cust.name}</td>
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
    </div>
  );
}

export default CustomerList;
