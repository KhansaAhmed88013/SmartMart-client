import React from "react";
import Select, { components } from "react-select";
import { FaTimes } from "react-icons/fa";

export default function SupplierSection({
  suppliers,
  supplier,
  setSupplier,
  showNewSupplierModal,
  setShowNewSupplierModal,
  newSupplier,
  setNewSupplier,
  saveNewSupplier,
}) {
  const CustomMenuList = (props) => {
    const { children } = props;
    return (
      <components.MenuList {...props}>
        <div
          className="supplier-add-btn"
          onClick={() => setShowNewSupplierModal(true)}
        >
          + Add New Supplier
        </div>
        {children}
      </components.MenuList>
    );
  };

  return (
    <div className="supplier-section">
      <label className="supplier-label">Select Supplier:</label>
      <Select
        className="supplier-select"
        options={suppliers}
        value={supplier}
        onChange={setSupplier}
        placeholder="Choose supplier"
        isSearchable
        components={{ MenuList: CustomMenuList }}
        getOptionLabel={(option) => option.supplier_name}
        getOptionValue={(option) => option.value}
      />

      {supplier && (
        <div className="supplier-details">
          <p className="supplier-detail"><strong>Contact:</strong> {supplier.contact_person}</p>
          <p className="supplier-detail"><strong>Phone:</strong> {supplier.phone}</p>
          <p className="supplier-detail"><strong>Email:</strong> {supplier.email}</p>
          <p className="supplier-detail"><strong>Payment Terms:</strong> {supplier.payment_terms}</p>
          <p className="supplier-detail"><strong>Credit Limit:</strong> {supplier.credit_limit}</p>
          <p className="supplier-detail"><strong>Status:</strong> {supplier.status}</p>
        </div>
      )}

      {/* New Supplier Modal */}
      {showNewSupplierModal && (
        <div className="modal-overlay">
          <div className="modal-content supplier-modal">
            <button
              className="modal-close-btn"
              onClick={() => setShowNewSupplierModal(false)}
            >
              <FaTimes />
            </button>
            <h2 className="modal-title">Add New Supplier</h2>
            <div className="modal-form supplier-form">
              <input
                type="text"
                placeholder="Supplier Name *"
                value={newSupplier.supplier_name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, supplier_name: e.target.value })
                }
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Contact Person"
                value={newSupplier.contact_person}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, contact_person: e.target.value })
                }
                className="form-input"
              />
              <input
                type="text"
                placeholder="Phone *"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
                className="form-input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newSupplier.email}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, email: e.target.value })
                }
                className="form-input"
              />
              <textarea
                placeholder="Address"
                value={newSupplier.address}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, address: e.target.value })
                }
                className="form-textarea"
              />
              <input
                type="text"
                placeholder="City"
                value={newSupplier.city}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, city: e.target.value })
                }
                className="form-input"
              />
              <input
                type="text"
                placeholder="Country"
                value={newSupplier.country}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, country: e.target.value })
                }
                className="form-input"
              />
              <input
                type="text"
                placeholder="Tax Number"
                value={newSupplier.tax_number}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, tax_number: e.target.value })
                }
                className="form-input"
              />
              <input
                type="text"
                placeholder="Payment Terms"
                value={newSupplier.payment_terms}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, payment_terms: e.target.value })
                }
                className="form-input"
              />
              <textarea
                placeholder="Bank Details"
                value={newSupplier.bank_details}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, bank_details: e.target.value })
                }
                className="form-textarea"
              />
              <input
                type="number"
                placeholder="Opening Balance"
                value={newSupplier.opening_balance}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, opening_balance: e.target.value })
                }
                className="form-input"
              />
              <input
                type="number"
                placeholder="Outstanding Balance"
                value={newSupplier.outstanding_balance}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, outstanding_balance: e.target.value })
                }
                className="form-input"
              />
              <input
                type="number"
                placeholder="Credit Limit"
                value={newSupplier.credit_limit}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, credit_limit: e.target.value })
                }
                className="form-input"
              />
              <select
                value={newSupplier.status}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, status: e.target.value })
                }
                className="form-select"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                onClick={saveNewSupplier}
                className="btn save-btn"
              >
                Save Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
