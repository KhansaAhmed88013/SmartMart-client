import React, { useState } from "react";
import { FaPlus, FaMinus, FaEdit, FaDownload, FaUpload, FaListAlt, FaTrash } from "react-icons/fa";
import "./InventoryStock.css";

function InventoryStock() {
  const [stock, setStock] = useState([
    { code: "P001", name: "Product A", qty: 50, sellingPrice: 120, supplier: "Supplier X", expiry: "2025-10-15" },
    { code: "P002", name: "Product B", qty: 8, sellingPrice: 80, supplier: "Supplier Y", expiry: "2025-09-01" },
    { code: "P003", name: "Product C", qty: 100, sellingPrice: 150, supplier: "Supplier Z", expiry: "2026-01-20" },
    { code: "P004", name: "Product D", qty: 20, sellingPrice: 90, supplier: "Supplier X", expiry: "2025-11-12" },
    { code: "P005", name: "Product E", qty: 60, sellingPrice: 110, supplier: "Supplier Y", expiry: "2026-02-18" },
    { code: "P001", name: "Product A", qty: 50, sellingPrice: 120, supplier: "Supplier X", expiry: "2025-10-15" },
    { code: "P002", name: "Product B", qty: 8, sellingPrice: 80, supplier: "Supplier Y", expiry: "2025-09-01" },
    { code: "P003", name: "Product C", qty: 100, sellingPrice: 150, supplier: "Supplier Z", expiry: "2026-01-20" },
    { code: "P004", name: "Product D", qty: 20, sellingPrice: 90, supplier: "Supplier X", expiry: "2025-11-12" },
    { code: "P005", name: "Product E", qty: 60, sellingPrice: 110, supplier: "Supplier Y", expiry: "2026-02-18" },
    { code: "P001", name: "Product A", qty: 50, sellingPrice: 120, supplier: "Supplier X", expiry: "2025-10-15" },
    { code: "P002", name: "Product B", qty: 8, sellingPrice: 80, supplier: "Supplier Y", expiry: "2025-09-01" },
    { code: "P003", name: "Product C", qty: 100, sellingPrice: 150, supplier: "Supplier Z", expiry: "2026-01-20" },
    { code: "P004", name: "Product D", qty: 20, sellingPrice: 90, supplier: "Supplier X", expiry: "2025-11-12" },
    { code: "P005", name: "Product E", qty: 60, sellingPrice: 110, supplier: "Supplier Y", expiry: "2026-02-18" },
    { code: "P001", name: "Product A", qty: 50, sellingPrice: 120, supplier: "Supplier X", expiry: "2025-10-15" },
    { code: "P002", name: "Product B", qty: 8, sellingPrice: 80, supplier: "Supplier Y", expiry: "2025-09-01" },
    { code: "P003", name: "Product C", qty: 100, sellingPrice: 150, supplier: "Supplier Z", expiry: "2026-01-20" },
    { code: "P004", name: "Product D", qty: 20, sellingPrice: 90, supplier: "Supplier X", expiry: "2025-11-12" },
    { code: "P005", name: "Product E", qty: 60, sellingPrice: 110, supplier: "Supplier Y", expiry: "2026-02-18" }
  ]);


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredStock = stock.filter(item =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
  const currentItems = filteredStock.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = (index) => {
    setStock(prevStock =>
      prevStock.map((row, i) =>
        i === index ? { ...row, qty: (Number(row.qty) || 0) + 1 } : row
      )
    );
  };

  const increaseQty = (index) => {
    setStock(prevStock =>
      prevStock.map((row, i) =>
        i === index ? { ...row, qty: (Number(row.qty) || 0) + 1 } : row
      )
    );
  };

  const decreaseQty = (index) => {
    setStock(prevStock =>
      prevStock.map((row, i) =>
        i === index ? { ...row, qty: Math.max((Number(row.qty) || 0) - 1, 0) } : row
      )
    );
  };

  const deleteProduct = (index) => {
    const globalIndex = (currentPage - 1) * itemsPerPage + index;
    setStock(prevStock => prevStock.filter((_, i) => i !== globalIndex));
  };

  return (
    <div className="inventory-container">

      {/* Header Bar */}
      <div className="inventory-header">
        <button onClick={() => alert("Show Audit Log")}><FaListAlt className="inventoryicon"/> Audit Log</button>
        <button onClick={() => window.location.href = '/import'}><FaUpload className="inventoryicon"/> Import Stock</button>
        <button onClick={() => window.location.href = '/export'}><FaDownload className="inventoryicon"/> Export Stock</button>
        <button ><FaDownload className="inventoryicon"/> Low Stock</button>
      </div>

      <div className="stock-container">
        
        {/* Stock Summary */}
        {/* Stock Summary */}
<div className="stock-summary">
  <p><strong>Total Items:</strong> {stock.length}</p>
  <p><strong>Total Quantity:</strong> {stock.reduce((acc, item) => acc + item.qty, 0)}</p>
  <p><strong>Total Inventory Cost:</strong> Rs {stock.reduce((acc, item) => acc + (item.qty * item.sellingPrice), 0).toLocaleString()}</p>
  <p><strong>Low Stock Alerts:</strong> {stock.filter(item => item.qty < 10).length}</p>
</div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Code, Name, Supplier..."
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
              <th>Quantity</th>
              <th>Selling Price</th>
              <th>Supplier</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className={item.qty < 10 || new Date(item.expiry) < new Date() ? "low-stock" : ""}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>Rs {item.sellingPrice}</td>
                <td>{item.supplier}</td>
                <td>{item.expiry}</td>
                <td>
                  <button onClick={() => increaseQty((currentPage - 1) * itemsPerPage + index)}><FaPlus /></button>
                  <button onClick={() => decreaseQty((currentPage - 1) * itemsPerPage + index)}><FaMinus /></button>
                  <button onClick={() => handleAction((currentPage - 1) * itemsPerPage + index, "adjust")}><FaEdit /></button>
                  <button onClick={() => deleteProduct(index)}  className="delete-btn" ><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
          <span> Page {currentPage} of {totalPages} </span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
        </div>

        </div>
    </div>
  );
}

export default InventoryStock;
