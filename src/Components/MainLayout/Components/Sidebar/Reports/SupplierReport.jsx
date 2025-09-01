import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";

const SupplierReport = () => {
  const suppliers = [
    {
      id: 1,
      name: "ABC Suppliers",
      contactPerson: "Ali Khan",
      phone: "0300-1234567",
      email: "abc@suppliers.com",
      address: "Lahore, Pakistan",
      totalPurchases: 250000,
      pendingAmount: 0,
      status: "Active",
      date: "2025-08-01",
    },
    {
      id: 2,
      name: "XYZ Traders",
      contactPerson: "Sara Ahmed",
      phone: "0301-7654321",
      email: "xyz@traders.com",
      address: "Karachi, Pakistan",
      totalPurchases: 150000,
      pendingAmount: 12000,
      status: "Pending",
      date: "2025-08-05",
    },
    {
      id: 3,
      name: "Global Imports",
      contactPerson: "Bilal Hassan",
      phone: "0321-9876543",
      email: "global@imports.com",
      address: "Islamabad, Pakistan",
      totalPurchases: 80000,
      pendingAmount: 8000,
      status: "Active",
      date: "2025-08-08",
    },
  ];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!startDate || !endDate) return true;
    return supplier.date >= startDate && supplier.date <= endDate;
  });

  const totalPurchases = filteredSuppliers.reduce(
    (sum, supplier) => sum + supplier.totalPurchases,
    0
  );
  const totalPending = filteredSuppliers.reduce(
    (sum, supplier) => sum + supplier.pendingAmount,
    0
  );

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Smart Super Mart</h2>
        <p>Behria Enclusive Road Chak Shehzad Islamabad</p>
        <h2>Supplier Report</h2>
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>To: </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
        Total Purchases: Rs. {totalPurchases} | Total Pending: Rs.{" "}
        {totalPending}
      </div>

      {/* Supplier Table */}
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th style={{ width: "60px" }}>#</th> {/* Bigger Serial No column */}
            <th>Supplier Name</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Date</th>
            <th>Total Purchases (PKR)</th>
            <th>Pending Amount (PKR)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td style={{ textAlign: "center" }}>{supplier.id}</td>
                <td>{supplier.name}</td>
                <td>{supplier.contactPerson}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.email}</td>
                <td>{supplier.address}</td>
                <td>{supplier.date}</td>
                <td>{supplier.totalPurchases}</td>
                <td>{supplier.pendingAmount}</td>
                <td
                  style={{
                    color: supplier.status === "Active" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {supplier.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", color: "red" }}>
                No records found for selected date range.
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

export default SupplierReport;
