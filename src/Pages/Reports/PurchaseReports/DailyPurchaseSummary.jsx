import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";

const DailyPurchaseSummary = () => {
  const purchases = [
    {
      id: 1,
      supplier: "ABC Suppliers",
      invoiceNo: "INV-001",
      date: "2025-08-28",
      items: "Raw Material (500 units)",
      quantity: 500,
      amount: 25000,
      status: "Paid",
    },
    {
      id: 2,
      supplier: "XYZ Traders",
      invoiceNo: "INV-002",
      date: "2025-08-28",
      items: "Office Supplies (300 units)",
      quantity: 300,
      amount: 12000,
      status: "Pending",
    },
    {
      id: 3,
      supplier: "Global Imports",
      invoiceNo: "INV-003",
      date: "2025-08-28",
      items: "Packaging Material (200 units)",
      quantity: 200,
      amount: 8000,
      status: "Paid",
    },
  ];

  // State for date filter
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Filter purchases by date range
  const filteredPurchases = purchases.filter((p) => {
    if (!fromDate || !toDate) return true;
    return p.date >= fromDate && p.date <= toDate;
  });

  // Total summary
  const totalAmount = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = filteredPurchases.length;
  const averageBill =
    totalTransactions > 0 ? (totalAmount / totalTransactions).toFixed(2) : 0;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Smart Super Mart</h2>
        <p>Behria Enclusive Road Chak Shehzad Islamabad</p>
        <h2>Daily Purchase Summary</h2>
      </div>

      {/* Date Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <label>From: </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label>To: </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Total Summary */}
      <div
        style={{
          margin: "15px 0",
          fontWeight: "bold",
          textAlign: "right",
          fontSize: "16px",
        }}
      >
        Total Purchases: Rs. {totalAmount} | Transactions: {totalTransactions} | Average Bill: Rs. {averageBill}
      </div>

      {/* Purchase Table */}
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th style={{ width: "60px" }}>#</th>
            <th>Supplier</th>
            <th>Invoice No</th>
            <th>Date</th>
            <th>Items</th>
            <th>Quantity</th>
            <th>Amount (PKR)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((purchase) => (
              <tr key={purchase.id}>
                <td style={{ textAlign: "center" }}>{purchase.id}</td>
                <td>{purchase.supplier}</td>
                <td>{purchase.invoiceNo}</td>
                <td>{purchase.date}</td>
                <td>{purchase.items}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.amount}</td>
                <td
                  style={{
                    color: purchase.status === "Paid" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {purchase.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", color: "red" }}>
                No records found for selected date range.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Print Button */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
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

export default DailyPurchaseSummary;
