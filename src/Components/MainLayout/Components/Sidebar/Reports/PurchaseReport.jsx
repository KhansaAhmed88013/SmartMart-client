import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";

const PurchaseReport = () => {
  const purchases = [
    {
      id: 1,
      supplier: "ABC Suppliers",
      invoiceNo: "INV-001",
      date: "2025-08-01",
      items: "Raw Material (500 units)",
      amount: 25000,
      profit: 3000,
      status: "Paid",
    },
    {
      id: 2,
      supplier: "XYZ Traders",
      invoiceNo: "INV-002",
      date: "2025-08-05",
      items: "Office Supplies (300 units)",
      amount: 12000,
      profit: 1500,
      status: "Pending",
    },
    {
      id: 3,
      supplier: "Global Imports",
      invoiceNo: "INV-003",
      date: "2025-08-10",
      items: "Packaging Material (200 units)",
      amount: 8000,
      profit: 900,
      status: "Paid",
    },
  ];

  // State for date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Filter purchases based on date range
  const filteredPurchases = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return (!from || purchaseDate >= from) && (!to || purchaseDate <= to);
  });

  // Summary Calculations
  const totalAmount = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);
  const totalProfit = filteredPurchases.reduce((sum, p) => sum + p.profit, 0);
  const totalTransactions = filteredPurchases.length;
  const averageBill =
    totalTransactions > 0 ? (totalAmount / totalTransactions).toFixed(2) : 0;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Smart Super Mart</h2>
        <p>Behria Enclusive Road Chak Shehzad Islamabad</p>
        <h2>Daily Purchase Report</h2>
      </div>

      {/* Date Filter */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label>
          From Date:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <span style={{ margin: "0 10px" }}>To</span>
        <label>
          To Date:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
      </div>

      {/* Summary Section ABOVE Table */}
      <div
        style={{
          marginBottom: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h4>Total Sales</h4>
          <p style={{ fontWeight: "bold" }}>Rs. {totalAmount}</p>
        </div>
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h4>Total Profit</h4>
          <p style={{ fontWeight: "bold" }}>Rs. {totalProfit}</p>
        </div>
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h4>Transactions</h4>
          <p style={{ fontWeight: "bold" }}>{totalTransactions}</p>
        </div>
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h4>Average Bill</h4>
          <p style={{ fontWeight: "bold" }}>Rs. {averageBill}</p>
        </div>
      </div>

      {/* Table */}
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>#</th>
            <th>Supplier</th>
            <th>Invoice No</th>
            <th>Date</th>
            <th>Items</th>
            <th>Amount (PKR)</th>
            <th>Profit (PKR)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.id}</td>
                <td>{purchase.supplier}</td>
                <td>{purchase.invoiceNo}</td>
                <td>{purchase.date}</td>
                <td>{purchase.items}</td>
                <td>{purchase.amount}</td>
                <td>{purchase.profit}</td>
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
                No records found for selected date range
              </td>
            </tr>
          )}
        </tbody>
      </table>

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

export default PurchaseReport;
