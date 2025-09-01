import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";

const CustomerReport = () => {
  const customers = [
    {
      id: 1,
      name: "Ahmed Khan",
      phone: "0300-1234567",
      email: "ahmed@example.com",
      address: "Lahore, Pakistan",
      totalPurchases: 50000,
      pendingAmount: 0,
      status: "Active",
      date: "2025-08-01",
    },
    {
      id: 2,
      name: "Sara Ahmed",
      phone: "0301-7654321",
      email: "sara@example.com",
      address: "Karachi, Pakistan",
      totalPurchases: 30000,
      pendingAmount: 5000,
      status: "Pending",
      date: "2025-08-05",
    },
    {
      id: 3,
      name: "Bilal Hassan",
      phone: "0321-9876543",
      email: "bilal@example.com",
      address: "Islamabad, Pakistan",
      totalPurchases: 20000,
      pendingAmount: 0,
      status: "Active",
      date: "2025-08-10",
    },
  ];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    if (!startDate || !endDate) return true;
    return customer.date >= startDate && customer.date <= endDate;
  });

  const totalPurchases = filteredCustomers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const totalPending = filteredCustomers.reduce((sum, c) => sum + c.pendingAmount, 0);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Smart Super Mart</h2>
        <p>Behria Enclusive Road Chak Shehzad Islamabad</p>
        <h2>Customer Report</h2>
      </div>

      {/* Date Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <label>From: </label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>To: </label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      {/* Total Summary */}
      <div style={{ margin: "15px 0", fontWeight: "bold", textAlign: "right", fontSize: "16px" }}>
        Total Purchases: Rs. {totalPurchases} | Total Pending: Rs. {totalPending}
      </div>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th style={{ width: "50px" }}>#</th>
            <th>Customer Name</th>
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
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>{customer.date}</td>
                <td>{customer.totalPurchases}</td>
                <td>{customer.pendingAmount}</td>
                <td style={{ color: customer.status === "Active" ? "green" : "red", fontWeight: "bold" }}>
                  {customer.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", color: "red" }}>
                No records found for selected date range.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button onClick={() => window.print()} style={{ padding: "8px 12px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          <FaPrint /> Print
        </button>
      </div>
    </div>
  );
};

export default CustomerReport;
