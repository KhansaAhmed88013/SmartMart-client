import React from "react";
import { useState } from "react";
import { FaPrint } from "react-icons/fa";
const OTSaleReport = () => {
const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // ✅ Dummy OT Sales Data (only walk-in sales)
  const sales = [
    { invoiceNo: "INV-101", date: "2025-09-11", paymentMode: "Cash", amount: 350 },
    { invoiceNo: "INV-102", date: "2025-09-11", paymentMode: "Card", amount: 280 },
    { invoiceNo: "INV-103", date: "2025-09-11", paymentMode: "Cash", amount: 120 },
    { invoiceNo: "INV-104", date: "2025-09-11", paymentMode: "Online", amount: 500 },
  ];

  // ✅ Summary Calculations
  const totalInvoices = sales.length;
  const totalAmount = sales.reduce((sum, s) => sum + s.amount, 0);

  const paymentSummary = sales.reduce((acc, s) => {
    acc[s.paymentMode] = (acc[s.paymentMode] || 0) + s.amount;
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>OT Sales Report (Demo)</h2>

      {/* Date Range */}
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

      {/* Summary */}
      <div
        style={{
          border: "1px solid #333",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: "#f2f2f2",
        }}
      >
        <h3>Summary</h3>
        <p><b>Total Invoices:</b> {totalInvoices}</p>
        <p><b>Total OT Sales:</b> Rs. {totalAmount}</p>

        <h4>By Payment Mode:</h4>
        <ul>
          {Object.entries(paymentSummary).map(([mode, amount], i) => (
            <li key={i}><b>{mode}:</b> Rs. {amount}</li>
          ))}
        </ul>
      </div>

      {/* Invoice Table */}
      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#f9f9f9" }}>
          <tr>
            <th>Invoice No</th>
            <th>Date</th>
            <th>Payment Mode</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s, idx) => (
            <tr key={idx}>
              <td>{s.invoiceNo}</td>
              <td>{s.date}</td>
              <td>{s.paymentMode}</td>
              <td>{s.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Print Button */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: "8px 12px",
            background: "#28a745",
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

export default OTSaleReport;
