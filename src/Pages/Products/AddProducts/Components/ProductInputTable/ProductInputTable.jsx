import React, { useState, useEffect,useRef } from "react";
import "./ProductInputTable.css";
import { FaPlus } from "react-icons/fa";
import Select from "react-select";
import { AddProduct, GetCategoriesSuppliers,GetUnits } from "../../../../../UserService";
import ProductRow from "./ProductRow";
import BarcodeModal from "./BarcodeModal";
import SupplierModal from "./SupplierModal";
import CategoryModal from "./CategoryModal";

function ProductInputTable() {
 const initialRow = {
  code: "",
  name: "",
  cost_price: "",
  qty: "",
  sale_price: "",
  expiry: new Date().toISOString().split("T")[0],
  category: "",
  supplier: "",
  unit: "",   // ✅ add this
};

  const [rows, setRows] = useState([initialRow]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState(null);

  const [openBarcode, setOpenBarcode] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

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
    opening_balance: 0,
    outstanding_balance: 0,
    credit_limit: "",
    status: "Active",
  });

  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState(""); // "success" | "error"
  const [units, setUnits] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const data = await GetCategoriesSuppliers();
    if (data) {
      setCategories(data.categories || []);
      setSuppliers(data.suppliers || []);
    }

    // Fetch units
    const unitsData = await GetUnits();
    if (unitsData) setUnits(unitsData);
  };
  fetchData();
}, []);

useEffect(() => {
  let buffer = "";
  let lastTime = Date.now();

  const handleKeyDown = (e) => {
    const now = Date.now();
    if (now - lastTime > 100) buffer = "";
    lastTime = now;

    if (e.key.length === 1 && /[0-9A-Za-z]/.test(e.key)) buffer += e.key;

    if (e.key === "Enter" && buffer) {
      e.preventDefault();
      const scannedCode = buffer.trim();
      buffer = "";
      handleScan(scannedCode);
    }
  };

  const handleScan = (code) => {
    console.log("📦 Scanned:", code);
    setRows((prev) => {
      const updated = [...prev];
      let idx = updated.findIndex((r) => !r.code.trim());
      if (idx === -1) {
        updated.push({ ...initialRow, code });
      } else {
        updated[idx].code = code;
      }
      return updated;
    });
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);


const unitOptions = [
  ...units.map((u) => ({ value: u.id, label: u.name })),
];

  const addRow = () =>
    setRows([...rows, { ...initialRow, supplier: supplier || "" }]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);

    // Auto-add new row if last row has any value
    if (
      index === rows.length - 1 &&
      Object.values(updatedRows[index]).some((v) => v !== "")
    )
      addRow();
  };

  // Keep refs for all row first inputs
const rowRefs = useRef([]);

const focusNextRow = (currentIndex) => {
  const nextRow = rowRefs.current[currentIndex + 1];
  if (nextRow) {
    nextRow.focusItemCode(); // call the exposed function
  } else {
    addRow();
    setTimeout(() => {
      rowRefs.current[currentIndex + 1]?.focusItemCode();
    }, 50);
  }
};

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMsgType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  // Transform rows to backend payload
  const handleSubmitAll = async () => {
    const rowsToSubmit = rows
      .filter((r) => r.code.trim() !== "")
      .map((r) => ({
        code: r.code,
        name: r.name,
        category_id: r.category || null,
        supplier_id: r.supplier || null,
        unit_id: r.unit || null,
        cost_price: parseFloat(r.cost_price) || 0,
        sale_price: parseFloat(r.sale_price) || 0,
        qty: parseInt(r.qty) || 0,
        expiry: r.expiry,
      }));

    if (rowsToSubmit.length === 0)
      return showMessage("No products to submit", "error");

    try {
      await AddProduct(rowsToSubmit);
      showMessage("Products submitted successfully!", "success");
      setRows([initialRow]);
    } catch (err) {
      showMessage(err.message || "Submission failed", "error");
    }
  };

  const categoryOptions = [
    { value: "add_new", label: "Add New Category", isNew: true },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const supplierOptions = [
    { value: "add_new", label: "Add New Supplier", isNew: true },
    ...suppliers.map((s) => ({ value: s.id, label: s.supplier_name })),
  ];

 const handleBarcodeSubmit = () => {
  if (!barcodeValue) return;
  const updatedRows = [...rows];
  let rowIndex = updatedRows.findIndex((r) => r.code === "");

  if (rowIndex !== -1) {
    updatedRows[rowIndex].code = barcodeValue;
  } else {
    updatedRows.push({ ...initialRow, code: barcodeValue });
    rowIndex = updatedRows.length - 1;
  }

  setRows(updatedRows);
  setBarcodeValue("");
  setOpenBarcode(false);

  // Move focus to Product Name input after barcode is added
  setTimeout(() => {
    rowRefs.current[rowIndex]?.focusNextInput();
  }, 50);
};

  return (
    <div className="product-input-container">
      <div className="barcode-sticky-wrapper">
        {/* Hidden input to auto-focus and capture scanner events */}
<input
  type="text"
  style={{
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  }}
  autoFocus
  onBlur={(e) => e.target.focus()} // keep focus even after click
/>
  <button className="add-btn" onClick={() => setOpenBarcode(true)}>
    Create Barcode
  </button>
</div>

<div className="header-row">
  <div className="supplier-select">
    <Select
      options={supplierOptions}
      onChange={(option) =>
        option.value === "add_new"
          ? setShowSupplierModal(true)
          : setSupplier(option.value)
      }
      placeholder="Select Supplier"
      isSearchable
      styles={{ container: (base) => ({ ...base, width: "220px" }) }}
    />
  </div>
</div>

      {message && <div className={`alert ${msgType}`}>{message}</div>}

      {/* Modals */}
      {showCategoryModal && (
        <CategoryModal
          show={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          setCategories={setCategories}
          setMessage={setMessage}
          setMsgType={setMsgType}
        />
      )}
      {showSupplierModal && (
        <SupplierModal
          show={showSupplierModal}
          onClose={() => setShowSupplierModal(false)}
          suppliers={suppliers}
          setSuppliers={setSuppliers}
          supplierFormData={supplierFormData}
          setSupplierFormData={setSupplierFormData}
          setMessage={setMessage}
          setMsgType={setMsgType}
        />
      )}
      {openBarcode && (
        <BarcodeModal
          open={openBarcode}
          setOpen={setOpenBarcode}
          code={barcodeValue}
          setCode={setBarcodeValue}
          handleSubmit={handleBarcodeSubmit}
        />
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
              <th>Unit</th>
              <th>Sale Price</th>
              <th>Total Price</th>
              <th>Expiry</th>
              <th>Barcode</th>
            </tr>
          </thead>
          <tbody>
  {rows.map((row, idx) => (
    <ProductRow
      key={idx}
      row={row}
      index={idx}
      handleChange={handleChange}
      categoryOptions={categoryOptions}
      supplierOptions={supplierOptions}
      unitOptions={unitOptions}
      setShowModal={setShowCategoryModal}
      focusNextRow={focusNextRow}
      ref={(el) => (rowRefs.current[idx] = el)} // just assign ref
    />
  ))}
</tbody>


        </table>
      </div>

      <button className="add-btn" onClick={addRow}>
        <FaPlus /> Add Row
      </button>

      <div className="submit-all-container">
        <button className="submit-all-btn" onClick={handleSubmitAll}>
          Submit All
        </button>
      </div>
    </div>
  );
}

export default ProductInputTable;
