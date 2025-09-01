import React, { useState } from "react";
import Select from "react-select";
import "./SupplierAddForm.css";
import { AddSupplier } from "../../../../../UserService";

function SupplierAddForm() {
  const [formData, setFormData] = useState({
    supplier_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "Pakistan", // default
    tax_number: "",
    payment_terms: "",
    bank_details: "",
    opening_balance: 0.0,
    outstanding_balance: 0.0,
    credit_limit: "",
    status: "Active",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  


  // 🌍 Country options grouped by continent
  const countryOptions = [
    {
      label: "Asia",
      options: [
        { value: "Pakistan", label: "Pakistan" },
        { value: "India", label: "India" },
        { value: "China", label: "China" },
        { value: "Japan", label: "Japan" },
        { value: "Bangladesh", label: "Bangladesh" },
        { value: "Sri Lanka", label: "Sri Lanka" },
        { value: "Nepal", label: "Nepal" },
        { value: "Afghanistan", label: "Afghanistan" },
        { value: "Saudi Arabia", label: "Saudi Arabia" },
        { value: "United Arab Emirates", label: "UAE" },
      ],
    },
    {
      label: "Europe",
      options: [
        { value: "United Kingdom", label: "United Kingdom" },
        { value: "Germany", label: "Germany" },
        { value: "France", label: "France" },
        { value: "Italy", label: "Italy" },
        { value: "Spain", label: "Spain" },
        { value: "Netherlands", label: "Netherlands" },
        { value: "Sweden", label: "Sweden" },
      ],
    },
    {
      label: "Africa",
      options: [
        { value: "Egypt", label: "Egypt" },
        { value: "South Africa", label: "South Africa" },
        { value: "Nigeria", label: "Nigeria" },
        { value: "Kenya", label: "Kenya" },
      ],
    },
    {
      label: "North America",
      options: [
        { value: "United States", label: "United States" },
        { value: "Canada", label: "Canada" },
        { value: "Mexico", label: "Mexico" },
      ],
    },
    {
      label: "South America",
      options: [
        { value: "Brazil", label: "Brazil" },
        { value: "Argentina", label: "Argentina" },
        { value: "Chile", label: "Chile" },
        { value: "Colombia", label: "Colombia" },
      ],
    },
    {
      label: "Oceania",
      options: [
        { value: "Australia", label: "Australia" },
        { value: "New Zealand", label: "New Zealand" },
        { value: "Fiji", label: "Fiji" },
      ],
    },
  ];

  // Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle country change separately
  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, country: selectedOption.value }));
  };

  // Submit form
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await AddSupplier(formData);
    setMessage(res.message);
    setMessageType("success"); // success message
  } catch (error) {
    setMessage(error.message);
    setMessageType("error"); // error message
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  return (
    <div className="supplier-form-container">
      <h2>Add Supplier</h2>
      {message && (
  <p className={`supplier-message ${messageType}`}>
    {message}
  </p>
)}

      <form onSubmit={handleSubmit} className="supplier-form">
        {/* Two inputs in one row */}
        <div className="form-row">
          <div className="form-group">
            <label>Supplier Name *</label>
            <input
              type="text"
              name="supplier_name"
              value={formData.supplier_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person</label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Phone + Email row */}
        <div className="form-row">
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
        ></textarea>

        {/* City + Country row */}
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <Select
              options={countryOptions}
              defaultValue={{ value: "Pakistan", label: "Pakistan" }}
              onChange={handleCountryChange}
              isSearchable
            />
          </div>
        </div>

        <label>Tax Number</label>
        <input
          type="text"
          name="tax_number"
          value={formData.tax_number}
          onChange={handleChange}
        />

        <label>Payment Terms</label>
        <select
              name="payment_terms"
              value={formData.payment_terms}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="Inactive">Online</option>
            </select>

        <label>Bank Details</label>
        <textarea
          name="bank_details"
          value={formData.bank_details}
          onChange={handleChange}
        ></textarea>

        <div className="form-row">
          <div className="form-group">
            <label>Opening Balance</label>
            <input
              type="number"
              step="0.01"
              name="opening_balance"
              value={formData.opening_balance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Outstanding Balance</label>
            <input
              type="number"
              step="0.01"
              name="outstanding_balance"
              value={formData.outstanding_balance}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Credit Limit</label>
            <input
              type="number"
              step="0.01"
              name="credit_limit"
              value={formData.credit_limit}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button type="submit" style={{margin:'1rem', background:'#489FB5',padding:"7px 10px",color:'white',border:'1px solid #15373fff',borderRadius:'5px',cursor:'pointer'}}>Add Supplier</button>
      </form>
    </div>
  );
}

export default SupplierAddForm;
