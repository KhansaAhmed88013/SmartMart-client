import React, { useEffect, useState,useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { GetSupplierReport } from "../../../UserService";
import { ProfileContext } from "../../../Context/ProfileContext";

const SupplierReport = () => {
  const [suppliers,setSupplier]=useState([])
  const [msg,setMsg]=useState(null)
  const {ProfileData}=useContext(ProfileContext)
 useEffect(() => {
     const fetchPurchase = async () => {
       try {
         const supplierData = await GetSupplierReport();
         setSupplier(supplierData);
       } catch (err) {
         console.error(err);
         setMsg("❌ Failed to fetch Suppliers data from server.");
       }
     };
     fetchPurchase();
   }, []);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // helper: format ISO string into YYYY-MM-DD
const formatDate = (isoDate) => {
  if (!isoDate) return "";
  return new Date(isoDate).toISOString().split("T")[0];
};

// Filtered suppliers by comparing date objects
const filteredSuppliers = suppliers.filter((supplier) => {
  if (!startDate || !endDate) return true;

  const supplierDate = formatDate(supplier.date);
  return supplierDate >= startDate && supplierDate <= endDate;
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
      <div style={{ textAlign: "center", padding: "5px" }}>
          <h2>{ProfileData.shopName}</h2>
          <p>{ProfileData.location}</p>
          <p>{ProfileData.number1} , {ProfileData.number2}</p>
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
                <td>{formatDate(supplier.date)}</td>
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
