import React, { useState } from "react";

function SalesRecord() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ product: "", quantity: "", price: "" });

  // input change handle
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // record add handle
  const handleAdd = () => {
    if (!form.product || !form.quantity || !form.price) return;

    const newRecord = {
      product: form.product,
      quantity: parseInt(form.quantity),
      price: parseFloat(form.price),
    };

    setRecords([...records, newRecord]);
    setForm({ product: "", quantity: "", price: "" });
  };

  // total sale calculate
  const totalSale = records.reduce(
    (sum, r) => sum + r.quantity * r.price,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sales Record</h2>

      <input
        type="text"
        placeholder="Product"
        name="product"
        value={form.product}
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Quantity"
        name="quantity"
        value={form.quantity}
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Price"
        name="price"
        value={form.price}
        onChange={handleChange}
      />
      <button onClick={handleAdd}>Add Record</button>

      <h3>Records</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.product}</td>
              <td>{r.quantity}</td>
              <td>{r.price}</td>
              <td>{r.quantity * r.price}</td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan="4">No records yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Total Sale: Rs. {totalSale}</h3>
    </div>
  );
}

export default SalesRecord;
