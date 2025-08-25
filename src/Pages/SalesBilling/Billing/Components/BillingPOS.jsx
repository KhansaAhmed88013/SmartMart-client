import React, { useState, useEffect } from "react";
import "./BillingPOS.css";
import { FaPrint, FaSave, FaTimes, FaPlus } from "react-icons/fa";

function BillingPOS() {
  const [rows, setRows] = useState([{ code: "", name: "", price: "", qty: "", tax: "", net: "" }]);
  const [discount, setDiscount] = useState(0);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addRow = () => {
    setRows([...rows, { code: "", name: "", price: "", qty: "", tax: "", net: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    const price = parseFloat(updated[index].price) || 0;
    const qty = parseFloat(updated[index].qty) || 0;
    const tax = parseFloat(updated[index].tax) || 0;

    const subtotal = price * qty;
    updated[index].net = (subtotal + (subtotal * tax) / 100).toFixed(2);

    setRows(updated);
  };

  const grandTotal = rows.reduce((sum, row) => sum + (parseFloat(row.net) || 0), 0);
  const discountAmount = (grandTotal * discount) / 100;
  const finalTotal = grandTotal - discountAmount;

  return (
    <div className="billing-container">

      {/* Header */}
<div className="billing-header">

  {/* Part 1 */}
  <div className="header-part">
    <div className="header-row">
      <label>Acc ID:</label>
      <input type="text" defaultValue="Cash" />
    </div>
    <div className="header-row">
      <label>Return Quantity:</label>
      <input type="checkbox" />
    </div>
    <div className="header-row">
      <label>Name:</label>
      <input type="text" defaultValue="Cash" />
    </div>
  </div>

  {/* Part 2 */}
  <div className="header-part">
    <div className="header-row">
      <label>Payment Methods:</label>
      <select>
        <option>Cash Sale</option>
        <option>Credit Card</option>
        <option>Credit Customer</option>
      </select>
    </div>
  </div>

  {/* Part 3 */}
  <div className="header-part">
    <div className="header-row">
      <label>P/Balance:</label>
      <input type="number" defaultValue="0.00" />
    </div>
    <div className="header-row">
      <label>Remarks:</label>
      <input type="text" />
    </div>
  </div>

  {/* Part 4 */}
  <div className="header-part">
    <div className="header-row">
      <label>Date:</label>
      <span>{dateTime.toLocaleDateString()}</span>
    </div>
    <div className="header-row">
      <label>Time:</label>
      <span>{dateTime.toLocaleTimeString()}</span>
    </div>
    <div className="header-row">
      <label>Invoice No:</label>
      <input type="number" defaultValue="333979" />
    </div>
  </div>

</div>

      {/* Table */}
      <div className="table-scroll">
        <div className="products-container">
         <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Code / Barcode</th>
                  <th>Product Name</th>
                  <th>Sale Price</th>
                  <th>Quantity</th>
                  <th>Sale Tax %</th>
                  <th>Net Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td data-label="#">{index + 1}</td>
                    <td data-label="Item Code / Barcode">
                      <input type="text" value={row.code} onChange={(e) => handleChange(index, "code", e.target.value)} />
                    </td>
                    <td data-label="Product Name">
                      <input type="text" value={row.name} onChange={(e) => handleChange(index, "name", e.target.value)} />
                    </td>
                    <td data-label="Sale Price">
                      <input type="number" value={row.price} onChange={(e) => handleChange(index, "price", e.target.value)} />
                    </td>
                    <td data-label="Quantity">
                      <input type="number" value={row.qty} onChange={(e) => handleChange(index, "qty", e.target.value)} />
                    </td>
                    <td data-label="Sale Tax %">
                      <input type="number" value={row.tax} onChange={(e) => handleChange(index, "tax", e.target.value)} />
                    </td>
                    <td data-label="Net Total">
                      <input type="text" value={row.net} readOnly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="add-btn" onClick={addRow}>
            <FaPlus /> Add Row
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-card">
        <div className="summary-row">
          <span>Grand Total:</span>
          <span>{grandTotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Discount %:</span>
          <input type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
        </div>

        <div className="summary-row total-row">
          <span>Final Total:</span>
          <span>{finalTotal.toFixed(2)}</span>
        </div>

        <div className="action-buttons">
          <button className="action-btn print-btn" onClick={() => window.print()}>
            <FaPrint /> Print
          </button>
          <button className="action-btn save-btn" onClick={() => alert("Saved!")}>
            <FaSave /> Save
          </button>
          <button className="action-btn exit-btn" onClick={() => alert("Exit clicked")}>
            <FaTimes /> Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillingPOS;
