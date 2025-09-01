import React, { useState, useEffect } from "react";
import {  FaEdit, FaDownload, FaUpload, FaListAlt, FaTrash, FaBox } from "react-icons/fa";
import "./InventoryStock.css";
import { GetProducts, DelProduct,UpdateProduct } from "../../../UserService";

function InventoryStock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stock, setStock] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(null);   
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const [filterType, setFilterType] = useState("all"); 
  const itemsPerPage = 10;

  // Fetch products
  useEffect(() => {
    const callProduct = async () => {
      try {
        const result = await GetProducts();
        setStock(result);
      } catch (err) {
        alert(err.message);
      }
    };
    callProduct();
  }, []);
// When clicking edit → open modal
  const startEdit = (item) => {
    setOpen(item);
    setFormData({
      name: item.name,
      cost_price: item.cost_price,
      qty: item.qty,
      sale_price: item.sale_price,
      expiry: item.expiry,
      supplier: item.supplier || "",
      total_price: item.qty * item.sale_price
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      total_price:
        name === "qty" || name === "sale_price"
          ? (name === "qty" ? value : prev.qty) * (name === "sale_price" ? value : prev.sale_price)
          : prev.total_price
    }));
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await UpdateProduct({ code: open.code, ...formData });

      setMessage(result.message);
      setOpen(null);

      setTimeout(() => setMessage(null), 3000);

      // refresh products
      const refreshed = await GetProducts();
      setStock(refreshed);
    } catch (err) {
      setMessage(err.message);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Overlay click closes modal
  const handleOverlayClick = () => {
    setOpen(null);
  };
  

  // 🔍 Apply search + filter
  const filteredStock = stock.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

    const isLowStock = item.qty < 10;
    const isExpired = new Date(item.expiry) < new Date();

    if (filterType === "low" && !isLowStock) return false;
    if (filterType === "expired" && !isExpired) return false;

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
  const currentItems = filteredStock.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const deleteProduct = async (code) => {
    const response = window.confirm(`Do you want to delete ${code} product?`);
    try {
      if (response) {
        await DelProduct(code);
        window.location.reload();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Separate counts
  const lowStockCount = stock.filter(item => item.qty < 10).length;
  const expiredCount = stock.filter(item => new Date(item.expiry) < new Date()).length;

  return (
    <div className="inventory-container">
      {/* Header Bar */}
      <div className="inventory-header">
        <button onClick={() => setFilterType("all")}>
          <FaBox className="inventoryicon" /> Show All
        </button>
        <button onClick={() => setFilterType("low")}>
          <FaBox className="inventoryicon" /> Low Stock ({lowStockCount})
        </button>
        <button onClick={() => setFilterType("expired")}>
          <FaBox className="inventoryicon" /> Expired Stock ({expiredCount})
        </button>
        <button onClick={() => window.location.href='/auditLog'}>
          <FaListAlt className="inventoryicon" /> Audit Log
        </button>
        <button onClick={() => window.location.href = '/import'}>
          <FaUpload className="inventoryicon" /> Import Stock
        </button>
        <button onClick={() => window.location.href = '/export'}>
          <FaDownload className="inventoryicon" /> Export Stock
        </button>
      </div>
    {/* Auto-disappearing message */}
      {message && (
        <div className="update-msg">{message}</div>
      )}
      <div className="stock-container">
        <div className="stock-summary">
          <p><strong>Total Items:</strong> {stock.length}</p>
          <p><strong>Total Quantity:</strong> {stock.reduce((acc, item) => acc + item.qty, 0)}</p>
          <p><strong>Total Inventory Cost:</strong> Rs {stock.reduce((acc, item) => acc + (item.qty * item.cost_price), 0).toLocaleString()}</p>
          <p className="low-stock"><strong>Low Stock Alerts:</strong> {lowStockCount}</p>
          <p className="expired"><strong>Expired Items:</strong> {expiredCount}</p>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Name, Code or Supplier..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Stock Table */}
        <table className="stock-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Name</th>
              <th>Cost Price</th>
              <th>Quantity</th>
              <th>Sale Price</th>
              <th>Total Price</th>
              <th>Supplier</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const isLowStock = item.qty < 10;
              const isExpired = new Date(item.expiry) < new Date();

              return (
                <tr
                  key={index}
                  className={isLowStock ? "low-stock" : isExpired ? "expired" : ""}
                >
                  <td data-label="#">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td data-label="Code">{item.code}</td>
<td data-label="Name">{item.name}</td>
<td data-label="Cost Price">Rs {item.cost_price}</td>
<td data-label="Quantity">{item.qty}</td>
<td data-label="Sale Price">Rs {item.sale_price}</td>
<td data-label="Total Price">Rs {(item.qty * item.sale_price).toLocaleString()}</td>
<td data-label="Supplier">{item.supplier || "----"}</td>
<td data-label="Expiry Date">{item.expiry}</td>
<td data-label="Actions">
  <button onClick={() => startEdit(item)}><FaEdit /></button>
  <button onClick={() => deleteProduct(item.code)} className="delete-btn"><FaTrash /></button>
</td>

                </tr>
              );
            })}
          </tbody>
        </table>

            {/* 🔹 Modal for update */}
      {open && (
        <div className="modal--overlay" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Update Product ({open.code})</h3>
            <form onSubmit={handleUpdate} className="update-form">
              <label>
                Product Name:
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </label>
              <label>
                Cost Price:
                <input type="number" name="cost_price" value={formData.cost_price} onChange={handleInputChange} />
              </label>
              <label>
                Quantity:
                <input type="number" name="qty" value={formData.qty} onChange={handleInputChange} />
              </label>
              <label>
                Sale Price:
                <input type="number" name="sale_price" value={formData.sale_price} onChange={handleInputChange} />
              </label>
              <label>
                Total Price:
                <input type="number" name="total_price" value={formData.total_price} readOnly />
              </label>
              <label>
                Supplier:
                <input type="text" name="supplier" value={formData.supplier} onChange={handleInputChange} />
              </label>
              <label>
                Expiry:
                <input type="date" name="expiry" value={formData.expiry} onChange={handleInputChange} />
              </label>
              <div className="row">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setOpen(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
        {/* Pagination */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryStock;
