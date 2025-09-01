import React, { useState, useEffect } from "react";
import "./ProductInputTable.css";
import { FaPlus } from "react-icons/fa";
import Barcode from "react-barcode";
import Select from "react-select";
import { AddProduct, GetCategoriesSuppliers, CreateCategory, AddSupplier } from "../../../../../UserService";

function ProductInputTable() {
  const [code, setCode] = useState("");
    const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};


const [rows, setRows] = useState([
  { code: "", name: "", cost_price: "", qty: "", sale_price: "", expiry: getTodayDate(), category: "", supplier: "" }
]);

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier,setSupplier]=useState(null)
  const [supplierFormData, setSupplierFormData] = useState({
    supplier_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "Pakistan",
    tax_number: "",
    payment_terms: "",
    bank_details: "",
    opening_balance: 0.0,
    outstanding_balance: 0.0,
    credit_limit: "",
    status: "Active",
  });

  // Fetch categories & suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetCategoriesSuppliers();
        if (data) {
          setCategories(data.categories || []);
          setSuppliers(data.suppliers || []);
        }
      } catch (err) {
        console.error("Error fetching categories/suppliers:", err);
      }
    };
    fetchData();
  }, []);

  const addRow = () => {
  setRows([
    ...rows,
    {
      code: "",
      name: "",
      cost_price: "",
      qty: "",
      sale_price: "",
      expiry: getTodayDate(), // ✅ default to today
      category: "",
      supplier: supplier || ""
    }
  ]);
};


  const categoryOptions = [
    { value: "add_new", label: "Add New Category", isNew: true },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];

  const supplierOptions = [
    { value: "add_new", label: "Add New Supplier", isNew: true },
    ...suppliers.map(s => ({ value: s.id, label: s.supplier_name })),
  ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState(""); // "success" | "error"
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await CreateCategory(formData);
      setMsgType("success");
      setMessage(result.data.message);
      const data = await GetCategoriesSuppliers();
      if (data) setCategories(data.categories || []);
      setShowModal(false);
    } catch (err) {
      setMsgType("error");
      setMessage(err.message);
    }
    setFormData({ name: "", description: "" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSupplierChange = async (e) => {
    const { name, value } = e.target;
    setSupplierFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Country options grouped by continent
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
useEffect(() => {
  setRows((prevRows) => {
    const updatedRows = [...prevRows];
    const lastRowIndex = updatedRows.length - 1;

    if (lastRowIndex >= 0) {
      updatedRows[lastRowIndex] = {
        ...updatedRows[lastRowIndex],
        supplier: supplier || "",
      };
    }

    return updatedRows;
  });
}, [supplier]);
  // Generate random barcode
  const generateBarcode = () => {
    const randomCode = Math.floor(100000000 + Math.random() * 900000000).toString();
    setCode(randomCode);
  };

  // Submit generated barcode to first empty row
  const handleSubmit = () => {
    const updatedRows = [...rows];
    const emptyIndex = updatedRows.findIndex((row) => row.code === "");
    if (emptyIndex !== -1) {
      updatedRows[emptyIndex].code = code;
    } else {
      updatedRows.push({ code, name: "", cost_price: "", qty: "", sale_price: "", expiry: "", category: "", supplier: "" });
    }
    setRows(updatedRows);
    setOpen(false);
    setCode("");
  };

  // Update row fields
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);

    // Auto-add new row only if editing the last row
    const isLastRow = index === rows.length - 1;
    const hasAnyValue = Object.values(updatedRows[index]).some(v => v !== "");
    if (isLastRow && hasAnyValue) addRow();
  };

  // Submit all rows
  const handleSubmitAll = async () => {
  try {
    const rowsToSubmit = rows
      .filter(row => row.code.trim() !== "")
      .map(row => ({
        code: row.code,
        name: row.name,
        cost_price: parseFloat(row.cost_price),
        qty: parseInt(row.qty),
        sale_price: parseFloat(row.sale_price),
        total_price: parseFloat(row.sale_price) * parseInt(row.qty),
        expiry: row.expiry,
        category_id: row.category,
        supplier_id: row.supplier,
      }));

    if (rowsToSubmit.length === 0) {
      setMsgType("error");
      setMessage("No products to submit");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const result = await AddProduct(rowsToSubmit);
    if (result) {
      setMsgType("success");
      setMessage("Products submitted successfully!");
      setRows([{ code: "", name: "", cost_price: "", qty: "", sale_price: "", expiry: "", category: "", supplier: "" }]);
      setTimeout(() => setMessage(null), 3000);
    }
  } catch (err) {
    console.error(err);
    setMsgType("error");
    setMessage(err.message);
    setTimeout(() => setMessage(null), 3000);
  }
};


  // Print barcode
  const handlePrint = (rowCode) => {
    const barcodeElement = document.querySelector(`#barcode-${rowCode} svg`);
    if (!barcodeElement) {
      alert("Barcode not found!");
      return;
    }
    const printWindow = window.open("", "PRINT", "height=400,width=600");
    printWindow.document.write("<html><head><title>Print Barcode</title></head><body>");
    printWindow.document.write(`<h3 style="text-align:center;">Product Barcode</h3>`);
    printWindow.document.write(`<div style="margin-top:20px; text-align:center;">`);
    printWindow.document.write(barcodeElement.outerHTML);
    printWindow.document.write("</div></body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  useEffect(() => {
    if (open) generateBarcode();
  }, [open]);

  return (
    <div className="product-input-container">
     <div className="header-row">
  <button className="add-btn" onClick={() => setOpen(true)}>
    Create Barcode
  </button>

  <div className="supplier-select">
    <Select
      options={supplierOptions}
      onChange={(option) => {
        if (option.value === "add_new") {
          setShowSupplierModal(true);
        } else {
          setSupplier(option.value);
        }
      }}
      placeholder="Select Supplier"
      isSearchable
      styles={{
        container: (base) => ({ ...base, width: "220px" }),
        control: (base) => ({
          ...base,
          minHeight: "36px",
          fontSize: "14px",
          borderRadius: "6px",
          borderColor: "#ccc",
          boxShadow: "none",
          "&:hover": { borderColor: "#999" },
        }),
        menu: (base) => ({ ...base, maxHeight: "250px", overflowY: "auto", zIndex: 9999 }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#f0f0f0" : "white",
          color: state.data.isNew ? "#4CAF50" : "#333",
          fontWeight: state.data.isNew ? "bold" : "normal",
          fontSize: "13px",
          cursor: "pointer",
          padding: "8px 12px",
        }),
        singleValue: (base) => ({ ...base, color: "#333" }),
      }}
      menuPortalTarget={document.body}
    />
  </div>
</div>

      {/* Success/Error Message */}
      {message && <div className={`alert ${msgType}`}>{message}</div>}

      {/* Category Modal */}
      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          {message && <div className={`alert ${msgType} overlay-alert`}>{message}</div>}
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Category</h2>
            <form onSubmit={handleCategorySubmit} className="form">
              <div className="form-group">
                <label>Category Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleCategoryChange} placeholder="Enter category name" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleCategoryChange} placeholder="Enter description" rows="3"></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">Save</button>
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {showSupplierModal && (
  <div className="overlay" onClick={() => setShowSupplierModal(false)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h2>Create New Supplier</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const result = await AddSupplier(supplierFormData); // 👈 your API
            setMsgType("success");
            setMessage(result.message);

            // refresh suppliers list
            const data = await GetCategoriesSuppliers();
            if (data) {
              setSuppliers(data.suppliers || []);
            }

            setShowSupplierModal(false); // close modal
          } catch (err) {
            setMsgType("error");
            setMessage(err.message);
          }
          setTimeout(() => setMessage(null), 3000);
        }}
        className="form"
      >
        {/* Row: Supplier Name + Contact Person */}
        <div className="form-row">
          <div className="form-group">
            <label>Supplier Name *</label>
            <input
              type="text"
              name="supplier_name"
              value={supplierFormData.supplier_name}
              onChange={handleSupplierChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Person</label>
            <input
              type="text"
              name="contact_person"
              value={supplierFormData.contact_person}
              onChange={handleSupplierChange}
            />
          </div>
        </div>

        {/* Row: Phone + Email */}
        <div className="form-row">
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="text"
              name="phone"
              value={supplierFormData.phone}
              onChange={handleSupplierChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={supplierFormData.email}
              onChange={handleSupplierChange}
            />
          </div>
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={supplierFormData.address}
            onChange={handleSupplierChange}
          ></textarea>
        </div>

        {/* Row: City + Country */}
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={supplierFormData.city}
              onChange={handleSupplierChange}
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <Select
              options={countryOptions}
              defaultValue={{ value: "Pakistan", label: "Pakistan" }}
              onChange={(option) =>
                setSupplierFormData((prev) => ({ ...prev, country: option.value }))
              }
              isSearchable
            />
          </div>
        </div>

            <div className="form-row">
              <div className="form-group">
          <label>Tax Number</label>
          <input
            type="text"
            name="tax_number"
            value={supplierFormData.tax_number}
            onChange={handleSupplierChange}
          />
        </div>
        <div className="form-group">
          <label>Payment Terms</label>
        <select
              name="payment_terms"
              value={supplierFormData.payment_terms}
              onChange={handleSupplierChange}
            >
              <option value="Cash">Cash</option>
              <option value="Inactive">Online</option>
            </select>
        </div>
            </div>
        

        {/* Bank Details */}
        <div className="form-group">
          <label>Bank Details</label>
          <textarea
            name="bank_details"
            value={supplierFormData.bank_details}
            onChange={handleSupplierChange}
          ></textarea>
        </div>

        {/* Row: Opening Balance + Outstanding Balance */}
        <div className="form-row">
          <div className="form-group">
            <label>Opening Balance</label>
            <input
              type="number"
              step="0.01"
              name="opening_balance"
              value={supplierFormData.opening_balance}
              onChange={handleSupplierChange}
            />
          </div>
          <div className="form-group">
            <label>Outstanding Balance</label>
            <input
              type="number"
              step="0.01"
              name="outstanding_balance"
              value={supplierFormData.outstanding_balance}
              onChange={handleSupplierChange}
            />
          </div>
        </div>

        {/* Row: Credit Limit + Status */}
        <div className="form-row">
          <div className="form-group">
            <label>Credit Limit</label>
            <input
              type="number"
              step="0.01"
              name="credit_limit"
              value={supplierFormData.credit_limit}
              onChange={handleSupplierChange}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={supplierFormData.status}
              onChange={handleSupplierChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-save">
            Save
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setShowSupplierModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Barcode Generator Modal */}
      {open && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setOpen(false)}>
          <div className="modal-content">
            <div className="p-4">
              <h2 className="text-lg font-bold">Barcode Generator</h2>
              <div className="mt-4">
                {code && (
                  <>
                    <p className="mb-2">Generated Code: {code}</p>
                    <Barcode value={code} />
                  </>
                )}
              </div>
            </div>
            <button onClick={handleSubmit} className="close-btn">Submit</button>
          </div>
        </div>
      )}

      <h2 className="table-title">Add Products</h2>
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Code</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Cost Price</th>
              <th>QTY</th>
              <th>Sale Price</th>
              <th>Total Price</th>
              <th>Expiry</th>
              <th>Barcode</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
  <td data-label="#">{index + 1}</td>

  <td data-label="Item Code">
    <input
      type="text"
      value={row.code}
      onChange={(e) => handleChange(index, "code", e.target.value)}
    />
  </td>

  <td data-label="Product Name">
    <input
      type="text"
      value={row.name}
      onChange={(e) => handleChange(index, "name", e.target.value)}
    />
  </td>

  <td data-label="Category" className="select">
  <Select
    options={categoryOptions}
    value={categoryOptions.find((opt) => opt.value === row.category) || null}
    onChange={(option) => {
      if (option.value === "add_new") {
        setShowModal(true); // open category modal
      } else {
        handleChange(index, "category", option.value);
      }
    }}
    placeholder="Select Category"
    isSearchable
    menuPortalTarget={document.body}
    styles={{
      container: (base) => ({ ...base, width: "100%" }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      control: (base) => ({ ...base, width: "100%", minHeight: "30px", fontSize: "11px" }),
      menu: (base) => ({ ...base, width: "100%", maxHeight: "200px", overflowY: "auto" }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#f0f0f0" : "white",
        color: state.data.isNew ? "#4CAF50" : "#333",
        fontWeight: state.data.isNew ? "bold" : "normal",
        fontSize: "11px",
        padding: "3px 8px",
        cursor: "pointer",
      }),
    }}
  />
</td>

<td data-label="Supplier" className="select">
  <Select
    options={supplierOptions.filter(opt => opt.value !== "add_new")}
    value={row.supplier ? supplierOptions.find(opt => opt.value === row.supplier) : null}
    onChange={(option) => handleChange(index, "supplier", option.value)}
    placeholder="Select Supplier"
    isSearchable
    menuPortalTarget={document.body}
    styles={{
      container: (base) => ({ ...base, width: "100%" }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      control: (base) => ({ ...base, width: "100%", minHeight: "30px", fontSize: "11px" }),
      menu: (base) => ({ ...base, width: "100%", maxHeight: "200px", overflowY: "auto" }),
      option: (base) => ({ ...base, fontSize: "11px", padding: "3px 8px" }),
    }}
  />
</td>

  <td data-label="Cost Price">
    <input
      type="number"
      value={row.cost_price}
      onChange={(e) => handleChange(index, "cost_price", e.target.value)}
    />
  </td>

  <td data-label="QTY">
    <input
      type="number"
      value={row.qty}
      onChange={(e) => handleChange(index, "qty", e.target.value)}
    />
  </td>

  <td data-label="Sale Price">
    <input
      type="number"
      value={row.sale_price}
      onChange={(e) => handleChange(index, "sale_price", e.target.value)}
    />
  </td>

  <td data-label="Total Price">
    <input
      type="number"
      value={(parseFloat(row.sale_price || 0) * parseInt(row.qty || 0)).toFixed(2)}
      readOnly
    />
  </td>

  <td data-label="Expiry">
    <input
      type="date"
      value={row.expiry}
      onChange={(e) => handleChange(index, "expiry", e.target.value)}
    />
  </td>

  <td data-label="Barcode">
    {row.code ? (
      <div id={`barcode-${row.code}`} style={{ textAlign: "center" }}>
        <Barcode value={row.code} width={0.6} height={30} fontSize={10} margin={0} />
        <button className="print-btn mt-2" onClick={() => handlePrint(row.code)}>
          Print
        </button>
      </div>
    ) : (
      <span>No Barcode</span>
    )}
  </td>
</tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="add-btn" onClick={addRow}><FaPlus /> Add Row</button>
      <div className="submit-all-container">
        <button className="submit-all-btn" onClick={handleSubmitAll}>Submit All</button>
      </div>
    </div>
  );
}

export default ProductInputTable;
