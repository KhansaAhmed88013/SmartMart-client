import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  AddCustomer,
  GetCutomers,
  DeleteCustomer,
  UpdateCustomer,
} from "../../../UserService";
import "./CustomerMNG.css";

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); // track if editing
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    balance: 0.0,
  });

  const navigate = useNavigate();
  // ✅ Fetch customers safely
  const getCustomers = async () => {
    try {
      const result = await GetCutomers();
      if (Array.isArray(result)) {
        setCustomers(result);
      } else if (result?.data && Array.isArray(result.data)) {
        setCustomers(result.data);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        // update existing customer
        await UpdateCustomer(editingCustomer.id, newCustomer);
        window.alert("Customer updated successfully");
      } else {
        // add new customer
        await AddCustomer(newCustomer);
        window.alert("Customer added successfully");
      }
      getCustomers();
      setShowForm(false);
      setEditingCustomer(null);
      setNewCustomer({ name: "", phone: "", address: "", balance: 0.0 });
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  // ✅ Edit customer
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setNewCustomer(customer); // prefill form
    setShowForm(true);
  };

  // ✅ Delete customer
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await DeleteCustomer(id);
        window.alert("Customer deleted successfully");
        getCustomers();
      } catch (err) {
        console.error("Error deleting customer:", err);
      }
    }
  };

  return (
    <div className="customer-management">
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Smart Super Mart</h2>
        <p>Behria Enclusive Road Chak Shezad Islamabad</p>
        <h2>Customer Management</h2>
      </div>

      {/* Actions Row */}
      <div className="customer-actions">
        <button
          className="add-customer-btn"
          onClick={() => {
            setEditingCustomer(null);
            setNewCustomer({ name: "", phone: "", address: "", balance: 0.0 });
            setShowForm(true);
          }}
        >
          <FaPlus /> Add Customer
        </button>
      </div>

      <hr />

      {/* Customer Table */}
      <table border="1" cellPadding="6" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Balance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer,index) => (
              <tr key={customer.id}>
                <td>{index+1}</td>
                <td>{customer.name}</td>
                <td>{customer.phone || "-"}</td>
                <td>{customer.address || "-"}</td>
                <td className="right">
                  {parseFloat(customer.balance).toFixed(2)}
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(customer)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(customer.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="customer-no-results">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add/Edit Customer Modal */}
      {showForm && (
        <div className="customer-overlay" onClick={() => setShowForm(false)}>
          <div
            className="customer-modal"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h3>{editingCustomer ? "Edit Customer" : "Add New Customer"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={newCustomer.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Balance</label>
                <input
                  type="number"
                  step="0.01"
                  name="balance"
                  value={newCustomer.balance}
                  onChange={handleChange}
                />
              </div>

              <div className="form-buttons">
                <button type="submit">
                  {editingCustomer ? "Update" : "Save"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;
