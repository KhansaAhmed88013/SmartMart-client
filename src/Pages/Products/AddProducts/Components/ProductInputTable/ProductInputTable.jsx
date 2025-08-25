import React, { useState, useEffect } from "react";
import "./ProductInputTable.css";
import { FaPlus } from "react-icons/fa";
import Barcode from "react-barcode";
import { AddProduct } from "../../../../../UserService";

function ProductInputTable() {
  const [code, setCode] = useState("");
  const [rows, setRows] = useState([
    { code: "", name: "", cost_price: "", qty: "", sale_price: "", expiry: "" }
  ]);
  const [open, setOpen] = useState(false);

  // Add a new empty row
  const addRow = () => {
    setRows([
      ...rows,
      { code: "", name: "", cost_price: "", qty: "", sale_price: "", expiry: "" }
    ]);
  };

  // Generate random barcode
  const generateBarcode = () => {
    const randomCode = Math.floor(100000000 + Math.random() * 900000000).toString();
    setCode(randomCode);
  };

  // Submit generated barcode to last row
  const handleSubmit = () => {
    const updatedRows = [...rows];
    const lastIndex = updatedRows.length - 1;
    if (updatedRows[lastIndex].code === "") {
      updatedRows[lastIndex].code = code;
    } else {
      updatedRows.push({
        code: code,
        name: "",
        cost_price: "",
        qty: "",
        sale_price: "",
        expiry: ""
      });
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
  };

  // Submit all rows to backend
  const handleSubmitAll = async () => {
    try {
      const result = await AddProduct(rows);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  // Print barcode for a row
  const handlePrint = (rowCode) => {
    const printWindow = window.open("", "PRINT", "height=400,width=600");
    printWindow.document.write("<html><head><title>Print Barcode</title></head><body>");
    printWindow.document.write(`<h3>Product Barcode</h3>`);
    printWindow.document.write(`<div style="margin-top:20px;">`);
    printWindow.document.write(
      `<img src="${document.querySelector(`#barcode-${rowCode} canvas`).toDataURL()}" />`
    );
    printWindow.document.write("</div></body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) generateBarcode();
  }, [open]);

  return (
    <div className="products-container">
      <button className="add-btn" onClick={() => setOpen(true)}>
        Create Barcode
      </button>

      {open && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
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
            <button onClick={handleSubmit} className="close-btn">
              Submit
            </button>
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
                    value={
                      (parseFloat(row.sale_price || 0) * parseInt(row.qty || 0)).toFixed(2)
                    }
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
                      <button
                        className="print-btn mt-2"
                        onClick={() => handlePrint(row.code)}
                      >
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

      <button className="add-btn" onClick={addRow}>
        <FaPlus /> Add Row
      </button>
      <button className="submit-all-btn" onClick={handleSubmitAll}>
        Submit All
      </button>
    </div>
  );
}

export default ProductInputTable;
