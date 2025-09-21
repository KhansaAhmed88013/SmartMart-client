import React, { useState, useEffect, useRef,useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { getSalesSummaryReport } from "../../../UserService";
import { useReactToPrint } from "react-to-print";
import { ProfileContext } from "../../../Context/ProfileContext";


const DailySaleSummary = () => {
  // ✅ Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const [summary, setSummary] = useState(null);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const {ProfileData}=useContext(ProfileContext)

  const slipRef = useRef();

  // ✅ Print only the slip
  const handlePrint = useReactToPrint({
    contentRef: slipRef, // 👈 NEW API (v3+)
    documentTitle: "Sales_Summary", // optional: set title of printed doc
  });

  // Fetch summary from backend
  const fetchSummary = async () => {
    try {
      const data = await getSalesSummaryReport({ startDate, endDate });
      setSummary(data.summary);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [startDate, endDate]);

  return (
    <div style={{ width: "340px", margin: "auto" }}>
      {/* The Slip Section */}
      <div
        ref={slipRef}
        style={{
          border: "1px solid #000",
          padding: "12px",
          fontFamily: "monospace",
        }}
      >
       <div style={{ textAlign: "center", padding: "5px" }}>
          <h3>{ProfileData.shopName}</h3>
          <p>{ProfileData.location}</p>
          <p>{ProfileData.number1} , {ProfileData.number2}</p>
          <h3>Sales Summary</h3>
        </div>

        {/* Interval selection */}
        <div style={{ marginBottom: "10px" }}>
          <label>From: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: "60%" }}
          />
          <br />
          <label>To: </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: "60%" }}
          />
        </div>

        <p style={{ textAlign: "center" }}>
          Interval: {startDate} → {endDate}
        </p>
        <hr />

        {/* Summary Section */}
        {summary ? (
          <div style={{ fontSize: "14px" }}>
            <p>Total Invoices: {summary.totalInvoices}</p>
            <p>Total Qty Sold: {summary.totalQty}</p>
            <p>Gross Amount: Rs. {summary.grossAmount}</p>
            <p>Discount: Rs. {summary.totalDiscount}</p>
            <p>Tax: Rs. {summary.totalTax}</p>
            <p style={{ fontWeight: "bold" }}>
              Net Sale: Rs. {summary.netAmount}
            </p>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Loading...</p>
        )}

        <hr />
        <p style={{ textAlign: "center" }}>--- End of Report ---</p>
      </div>

      {/* Print Button */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
          onClick={handlePrint}
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

export default DailySaleSummary;
