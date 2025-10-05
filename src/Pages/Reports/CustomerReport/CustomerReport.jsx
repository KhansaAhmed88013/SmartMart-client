import React, { useState, useEffect, useContext } from "react";
import { ProfileContext } from "../../../Context/ProfileContext";
import { FaPrint } from "react-icons/fa";
import { GetCutomersReport } from "../../../UserService";

const CustomerReport = () => {
  const { ProfileData } = useContext(ProfileContext);
  const [customers, setCustomers] = useState([]);

  const getCustomers = async () => {
    try {
      const result = await GetCutomersReport();
      if (Array.isArray(result)) {
        setCustomers(result);
      } else if (result?.data && Array.isArray(result.data)) {
        setCustomers(result.data);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    if (!startDate || !endDate) return true;

    const customerDate = new Date(customer.created_at)
      .toISOString()
      .split("T")[0];
    return customerDate >= startDate && customerDate <= endDate;
  });

  const totalPurchases = filteredCustomers.reduce(
    (sum, c) => sum + (c.purchase_amount || 0),
    0
  );

  const totalPending = filteredCustomers.reduce(
    (sum, c) => sum + (c.pendingAmount || 0),
    0
  );

  // ✅ helper for null-safe display
  const safeValue = (val) =>
    val === null || val === undefined || val === "" ? "-" : val;

  // ✅ format date into DD-MM-YYYY
  const formatDate = (val) => {
    if (!val) return "-";
    const date = new Date(val);
    if (isNaN(date)) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", padding: "5px" }}>
        <h3>{ProfileData.shopName}</h3>
        <p>{ProfileData.location}</p>
        <p>
          {ProfileData.number1} , {ProfileData.number2}
        </p>
        <h2>Customer Report</h2>
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
        Total Purchases: Rs. {(totalPurchases).toFixed(2)} | Total Pending: Rs.{" "}
        {(totalPending).toFixed(2)}
      </div>

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th style={{ width: "20px" }}>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Date</th>
            <th>Balance</th>
            <th>Total Purchases (PKR)</th>
            <th>Pending Amount (PKR)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>{safeValue(customer.name)}</td>
                <td>{safeValue(customer.phone)}</td>
                <td>{safeValue(customer.address)}</td>
                <td>{formatDate(customer.created_at)}</td>
                <td>{safeValue(customer.balance)}</td>
                <td>{safeValue(customer.purchase_amount?.toFixed(2))}</td>
                <td>{safeValue(customer.pendingAmount?.toFixed(2))}</td>
                <td
                  style={{
                    color: customer.pendingAmount > 0 ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {customer.pendingAmount > 0 ? "Pending" : "Clear"}
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

export default CustomerReport;
