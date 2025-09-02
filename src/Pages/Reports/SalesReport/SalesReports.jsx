import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";

function SalesSummary() {
  // 🔹 Helper function: Format date in dd/mm/yyyy
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB"); 
  };

  // Dummy data (with today's date automatically)
  const salesData = [
    {
      date: formatDate(new Date("2025-07-27")),
      cashier: "ADMINISTRATOR",
      total: 149335,
      discountItems: 0,
      saleTax: 0,
      netTotal: 149335,
      discountTotal: 315,
      grandTotal: 149020,
      profit: 16104.32,
    },
    {
      date: formatDate(new Date("2025-08-05")),
      cashier: "ADMINISTRATOR",
      total: 207575,
      discountItems: 0,
      saleTax: 0,
      netTotal: 207575,
      discountTotal: 50,
      grandTotal: 207525,
      profit: 21055.44,
    },
    {
      date: formatDate(new Date("2025-08-20")),
      cashier: "ADMINISTRATOR",
      total: 110000,
      discountItems: 100,
      saleTax: 0,
      netTotal: 109900,
      discountTotal: 0,
      grandTotal: 109900,
      profit: 15000,
    },
  ];

  // 🔹 State for Date Filtering
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔹 Function to parse "dd/mm/yyyy" → JS Date
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  // 🔹 Filter sales data by date range
  const filteredData = salesData.filter((row) => {
    const rowDate = parseDate(row.date);

    if (fromDate && rowDate < new Date(fromDate)) return false;
    if (toDate && rowDate > new Date(toDate)) return false;

    return true;
  });

  // 🔹 Totals
  const totalSales = filteredData.reduce((sum, row) => sum + row.grandTotal, 0);
  const totalProfit = filteredData.reduce((sum, row) => sum + row.profit, 0);
  const transactions = filteredData.length;
  const avgBill = transactions > 0 ? (totalSales / transactions).toFixed(2) : 0;

  // 🔹 Date Range for report
  const reportFrom = filteredData[0]?.date || "N/A";
  const reportTo = filteredData[filteredData.length - 1]?.date || "N/A";

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>smart super Mart</h2>
        <p>Behria Enclusive Road Chak Shezad Islamabad</p>
        <h2>Daily Sale Summary Report</h2>
      </div>

      {/* Date Filter Inputs */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label>
          From:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ margin: "0 10px", padding: "5px" }}
          />
        </label>

        <label>
          To:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ margin: "0 10px", padding: "5px" }}
          />
        </label>
      </div>

      {/* Report Date Range */}
      <hr style={{ border: "2px solid black", margin: "2px 0" }} />
      <p style={{ fontWeight: "bold", textAlign: "center" }}>
        Date From {reportFrom} to {reportTo}
      </p>
       {/* Totals Row */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#f9f9f9",
          display: "flex",
          justifyContent: "space-between",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        <span>Total Sales: {totalSales.toLocaleString()}</span>
        <span>Total Profit: {totalProfit.toFixed(2)}</span>
        <span>Transactions: {transactions}</span>
        <span>Average Bill: {avgBill}</span>
      </div>

      <hr style={{ border: "2px solid black", margin: "2px 0" }} />

      {/* Sales Table */}
      <table border="1" cellPadding="6" cellSpacing="0" width="100%">
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th>Invoice Date</th>
            <th>Cashier Name</th>
            <th>Total</th>
            <th>Disc. on Items</th>
            <th>Sale Tax</th>
            <th>Net Total</th>
            <th>Disc. on Total</th>
            <th>G. Total</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.cashier}</td>
                <td>{row.total}</td>
                <td>{row.discountItems}</td>
                <td>{row.saleTax}</td>
                <td>{row.netTotal}</td>
                <td>{row.discountTotal}</td>
                <td>{row.grandTotal}</td>
                <td>{row.profit}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", color: "red" }}>
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
}

export default SalesSummary;
