import React, { useState, useEffect } from "react";
import { GetSuppliers, EditSupplier, DelSupplier } from "../../../../../UserService";
import "./SupplierView.css";
import Select from "react-select";
import { FaEdit, FaTrash } from "react-icons/fa";

function SupplierView() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 🌍 Country options grouped by continent
  const countryOptions = [
    { label: "Asia", options: [
      { value: "Pakistan", label: "Pakistan" }, { value: "India", label: "India" },
      { value: "China", label: "China" }, { value: "Japan", label: "Japan" },
      { value: "Bangladesh", label: "Bangladesh" }, { value: "Sri Lanka", label: "Sri Lanka" },
      { value: "Nepal", label: "Nepal" }, { value: "Afghanistan", label: "Afghanistan" },
      { value: "Saudi Arabia", label: "Saudi Arabia" }, { value: "United Arab Emirates", label: "UAE" },
    ]},
    { label: "Europe", options: [
      { value: "United Kingdom", label: "United Kingdom" }, { value: "Germany", label: "Germany" },
      { value: "France", label: "France" }, { value: "Italy", label: "Italy" },
      { value: "Spain", label: "Spain" }, { value: "Netherlands", label: "Netherlands" },
      { value: "Sweden", label: "Sweden" },
    ]},
    { label: "Africa", options: [
      { value: "Egypt", label: "Egypt" }, { value: "South Africa", label: "South Africa" },
      { value: "Nigeria", label: "Nigeria" }, { value: "Kenya", label: "Kenya" },
    ]},
    { label: "North America", options: [
      { value: "United States", label: "United States" }, { value: "Canada", label: "Canada" },
      { value: "Mexico", label: "Mexico" },
    ]},
    { label: "South America", options: [
      { value: "Brazil", label: "Brazil" }, { value: "Argentina", label: "Argentina" },
      { value: "Chile", label: "Chile" }, { value: "Colombia", label: "Colombia" },
    ]},
    { label: "Oceania", options: [
      { value: "Australia", label: "Australia" }, { value: "New Zealand", label: "New Zealand" },
      { value: "Fiji", label: "Fiji" },
    ]},
  ];

  const handleCountryChange = (selectedOption) => {
    handleInputChange("country", selectedOption.value);
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await GetSuppliers();
        setSuppliers(res.data || res);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch suppliers");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      (supplier.supplier_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (supplier.contact_person || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (e, supplier) => {
    e.stopPropagation();
    setSelectedSupplier(supplier);
    setIsEditing(true);
  };

  const handledeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    setSaveSuccess(""); setSaveError("");
    try {
      const res = await DelSupplier(id);
      if (res?.message) {
        setSaveSuccess(res.message);
        setSuppliers(prev => prev.filter(s => s.id !== id));
        if (selectedSupplier?.id === id) { setSelectedSupplier(null); setIsEditing(false); }
        setTimeout(() => setSaveSuccess(""), 2000);
      }
    } catch (err) {
      setSaveError(err?.response?.data?.message || err.message || "Failed to delete supplier");
    }
  };

  const handleRowClick = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditing(false);
  };

  const handleInputChange = (key, value) => {
    setSelectedSupplier({ ...selectedSupplier, [key]: value });
  };

  const handleSave = async () => {
    setSaveSuccess("");
    try {
      const res = await EditSupplier(selectedSupplier);
      if (res?.message) {
        setSaveSuccess(res.message);
        setSaveError("");
        setSuppliers(prev => prev.map(s => s.id === selectedSupplier.id ? { ...selectedSupplier } : s));
        setSelectedSupplier(null);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(""), 2000);
      }
    } catch (err) {
      setSaveError(err?.response?.data?.message || err.message || "Something went wrong");
    }
  };

  if (loading) return <p>Loading suppliers...</p>;
  if (error) return <p className="supplier-message error">{error}</p>;

  return (
    <div className="supplier-form-container">
      <h2>All Suppliers</h2>
      {saveError && <p className="editmsg error-message">{saveError}</p>}
      {saveSuccess && <p className="editmsg success-message">{saveSuccess}</p>}

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Supplier Name or Contact Person..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <table className="supplier-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Supplier Name</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Email</th>
            <th>City</th>
            <th>Country</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {filteredSuppliers.length > 0 ? (
    filteredSuppliers.map((supplier, index) => (
      <tr key={index} onClick={() => handleRowClick(supplier)} style={{ cursor: "pointer" }}>
        <td data-label="#"> {index + 1}</td>
        <td data-label="Supplier Name">{supplier.supplier_name}</td>
        <td data-label="Contact Person">{supplier.contact_person}</td>
        <td data-label="Phone">{supplier.phone}</td>
        <td data-label="Email">{supplier.email}</td>
        <td data-label="City">{supplier.city}</td>
        <td data-label="Country">{supplier.country}</td>
        <td data-label="Status">{supplier.status}</td>
        <td data-label="Actions" className="action-td">
          <div className="action-b" onClick={(e) => handleEditClick(e, supplier)}>
            <FaEdit className="action-box" />
          </div>
          <div className="action-b" onClick={(e) => handledeleteClick(supplier.id)}>
            <FaTrash className="action-trash-box" />
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="9">No suppliers found</td>
    </tr>
  )}
</tbody>
</table>

      {/* Modal */}
      {selectedSupplier && (
        <div className="modal-overlay" onClick={() => setSelectedSupplier(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {isEditing ? (
              <>
                <h3>Edit Supplier</h3>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                  {Object.entries(selectedSupplier).map(([key, value]) => {
                    if (key === "id") return null;
                    if (key === "status") return (
                      <div key={key}>
                        <label>Status</label>
                        <select value={value} onChange={e => handleInputChange(key, e.target.value)}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    );
                    if (key === "country") {
                      const findOption = (options) => {
                        for (let group of options) {
                          const match = group.options.find(opt => opt.value === value);
                          if (match) return match;
                        }
                        return null;
                      };
                      return (
                        <div key={key}>
                          <label>Country</label>
                          <Select
                            options={countryOptions}
                            value={findOption(countryOptions)}
                            onChange={handleCountryChange}
                            isSearchable
                          />
                        </div>
                      );
                    }
                    return (
                      <div key={key}>
                        <label>{key.replace("_", " ")}</label>
                        <input type="text" value={value} onChange={e => handleInputChange(key, e.target.value)} />
                      </div>
                    );
                  })}
                  <div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setSelectedSupplier(null)}>Cancel</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3>Supplier Details</h3>
                <table className="details-table">
                  <tbody>
                    {Object.entries(selectedSupplier).map(([key, value]) => {
                      if (key === "id") return null;
                      return (
                        <tr key={key}>
                          <td style={{ fontWeight: "bold" }}>{key.replace("_", " ")}</td>
                          <td>{value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button onClick={() => setSelectedSupplier(null)}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierView;
