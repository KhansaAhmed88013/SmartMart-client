import React from "react";
import Select from "react-select";
import { AddSupplier, GetCategoriesSuppliers } from "../../../../../UserService";

function SupplierModal({ show, onClose, suppliers, setSuppliers, supplierFormData, setSupplierFormData, setMessage, setMsgType }) {
  if (!show) return null;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AddSupplier(supplierFormData);
      setMsgType("success");
      setMessage(result.message || "Supplier added successfully");

      const data = await GetCategoriesSuppliers();
      if (data) setSuppliers(data.suppliers || []);

      onClose();
    } catch (err) {
      setMsgType("error");
      setMessage(err.message);
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Supplier</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Supplier Name *</label>
              <input type="text" name="supplier_name" value={supplierFormData.supplier_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input type="text" name="contact_person" value={supplierFormData.contact_person} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input type="text" name="phone" value={supplierFormData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={supplierFormData.email} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={supplierFormData.address} onChange={handleChange}></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={supplierFormData.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <Select
                options={countryOptions}
                value={{ value: supplierFormData.country, label: supplierFormData.country }}
                onChange={(option) => setSupplierFormData((prev) => ({ ...prev, country: option.value }))}
              />
            </div>
          </div>
          <label>Tax Number</label>
        <input
          type="text"
          name="tax_number"
          value={supplierFormData.tax_number}
          onChange={handleChange}
        />

        <label>Payment Terms</label>
        <input
          type="text"
          name="payment_terms"
          value={supplierFormData.payment_terms}
          onChange={handleChange}
        />

        <label>Bank Details</label>
        <textarea
          name="bank_details"
          value={supplierFormData.bank_details}
          onChange={handleChange}
        ></textarea>

        <div className="form-row">
          <div className="form-group">
            <label>Opening Balance</label>
            <input
              type="number"
              step="0.01"
              name="opening_balance"
              value={supplierFormData.opening_balance}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Outstanding Balance</label>
            <input
              type="number"
              step="0.01"
              name="outstanding_balance"
              value={supplierFormData.outstanding_balance}
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
              value={supplierFormData.credit_limit}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={supplierFormData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupplierModal;
