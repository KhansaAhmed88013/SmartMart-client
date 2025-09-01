import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";
const InvoiceReport = () => {
  // Sample Data
  const invoices = [
    {
      invoiceNo: "INV-1001",
      date: "2025-08-25",
      customer: "Ali Khan",
      items: [
        { name: "Pepsi 1.5L", qty: 2, rate: 180, discount: 20, tax: 10 },
        { name: "Lays Chips", qty: 3, rate: 50, discount: 0, tax: 0 }
      ],
      paymentMode: "Cash",
      salesperson: "Ahmed"
    },
    {
      invoiceNo: "INV-1002",
      date: "2025-08-27",
      customer: "Sara Ahmed",
      items: [
        { name: "Nestle Milk", qty: 1, rate: 250, discount: 0, tax: 0 }
      ],
      paymentMode: "Card",
      salesperson: "Bilal"
    },
    {
      invoiceNo: "INV-1003",
      date: "2025-08-30",
      customer: "Usman",
      items: [
        { name: "Coca Cola 2L", qty: 1, rate: 220, discount: 10, tax: 5 }
      ],
      paymentMode: "Online",
      salesperson: "Ali"
    }
  ];

  // States for Date Filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Function to calculate Net Amount
  const calculateNetAmount = (items) => {
    return items.reduce(
      (sum, item) =>
        sum + (item.qty * item.rate - item.discount + item.tax),
      0
    );
  };

  // Filter invoices based on Date Range
  const filteredInvoices = invoices.filter((invoice) => {
    if (!startDate || !endDate) return true; // If no filter, show all
    const invoiceDate = new Date(invoice.date);
    return (
      invoiceDate >= new Date(startDate) &&
      invoiceDate <= new Date(endDate)
    );
  });

  // 🔹 Summary Data
  const totalInvoices = filteredInvoices.length;
  const totalAmount = filteredInvoices.reduce(
    (sum, inv) => sum + calculateNetAmount(inv.items),
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Invoice Report</h2>

      {/* Date Range Filter */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label>From: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <label>To: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* 🔹 Summary Section */}
      <div
        style={{
          border: "1px solid #333",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: "#f2f2f2"
        }}
      >
        <h3>Summary</h3>
        <p><b>Total Invoices:</b> {totalInvoices}</p>
        <p><b>Total Net Amount:</b> Rs. {totalAmount}</p>
      </div>

      {/* Show Filtered Invoices */}
      {filteredInvoices.length > 0 ? (
        filteredInvoices.map((invoice, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px"
            }}
          >
            <h3>Invoice No: {invoice.invoiceNo}</h3>
            <p><b>Date:</b> {invoice.date}</p>
            <p><b>Customer:</b> {invoice.customer}</p>
            <p><b>Salesperson:</b> {invoice.salesperson}</p>
            <p><b>Payment Mode:</b> {invoice.paymentMode}</p>

            {/* Invoice Items Table */}
            <table
              border="1"
              cellPadding="6"
              cellSpacing="0"
              style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
            >
              <thead style={{ backgroundColor: "#f9f9f9" }}>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.rate}</td>
                    <td>{item.discount}</td>
                    <td>{item.tax}</td>
                    <td>{item.qty * item.rate - item.discount + item.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Net Amount */}
            <div style={{ textAlign: "right", marginTop: "10px", fontWeight: "bold" }}>
              Net Amount: Rs. {calculateNetAmount(invoice.items)}
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>No invoices found in this date range.</p>
      )}
      {/* Print Button */}
            <div
              className="action-buttons"
              style={{ marginTop: "20px", textAlign: "right" }}
            >
              <button
                className="action-btn print-btn"
                onClick={() => window.print()}
                style={{
                  padding: "8px 12px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <FaPrint /> Print
              </button>
            </div>
    </div>
  );
};

export default InvoiceReport;
