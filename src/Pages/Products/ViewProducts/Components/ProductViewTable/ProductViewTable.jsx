import React from "react";
import "./ProductViewTable.css"; 
import { FaTrashCan, FaPen } from "react-icons/fa6";

function ProductViewTable() {
  const products = [
    { code: "P001", name: "Laptop", cost: 50000, qty: 2, sale: 55000, total: 110000, expiry: "2026-12-31" },
    { code: "P002", name: "Mouse", cost: 500, qty: 5, sale: 700, total: 3500, expiry: "2027-05-15" },
    { code: "P003", name: "Keyboard", cost: 1500, qty: 3, sale: 2000, total: 6000, expiry: "2026-09-20" }
  ];

  const handleDeleteProduct = () => {
    window.confirm(`Do you want to delete this product?`);
  };

  return (
    <div className="products-container">
      <h2 className="table-title">Products List</h2>
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Code / Barcode</th>
              <th>Product Name</th>
              <th>Cost Price</th>
              <th>QTY</th>
              <th>Sale Price</th>
              <th>Total Price</th>
              <th>Expiry</th>
              <th>Other</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td data-label="#"> {index + 1} </td>
                <td data-label="Item Code / Barcode">{product.code}</td>
                <td data-label="Product Name">{product.name}</td>
                <td data-label="Cost Price">{product.cost}</td>
                <td data-label="QTY">{product.qty}</td>
                <td data-label="Sale Price">{product.sale}</td>
                <td data-label="Total Price">{product.total}</td>
                <td data-label="Expiry">{product.expiry}</td>
                <td data-label="Other" className="controlls">
                  <FaPen className="pen" />
                  <FaTrashCan className="trash" onClick={handleDeleteProduct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductViewTable;
