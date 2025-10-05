import React, { useState, useEffect } from "react";
import { FaPrint } from "react-icons/fa";
import { getOTsalesReport } from "../../../UserService";

const OTSaleReport = () => {
  // ✅ Calculate today
  const today = new Date();

  // ✅ Default: prev month same day to today
  const prevMonth = new Date(today);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formatDate(prevMonth));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [reverseOrder, setReverseOrder] = useState(false); // ✅ new state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getOTsalesReport();
        setSales(result);
        setFilteredSales(result); // show all initially
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter invoices by date range
  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredSales(sales);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // ✅ include the full end date

    let filtered = sales.filter((s) => {
      const invDate = new Date(s.invoice_date);
      return invDate >= start && invDate <= end;
    });

    // ✅ apply reverse order if selected
    if (reverseOrder) {
      filtered = [...filtered].reverse();
    }

    setFilteredSales(filtered);
  }, [startDate, endDate, sales, reverseOrder]);

  // ✅ Summary Calculations
  const totalInvoices = filteredSales.length;
  const totalAmount = filteredSales.reduce(
    (sum, s) => sum + Number(s.final_total || 0),
    0
  );

  const paymentSummary = filteredSales.reduce((acc, s) => {
    const mode = s.payment_method || "Unknown";
    acc[mode] = (acc[mode] || 0) + Number(s.final_total || 0);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>OT Sales Report</h2>

      {/* Date Range + Reverse Option */}
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
          style={{ marginRight: "20px" }}
        />

        {/* ✅ Reverse Order Toggle */}
        <label>
          <input
            type="checkbox"
            checked={reverseOrder}
            onChange={() => setReverseOrder(!reverseOrder)}
            style={{ marginRight: "5px" }}
          />
          Reverse Order
        </label>
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
        <p>
          <b>Total Invoices:</b> {totalInvoices}
        </p>
        <p>
          <b>Total OT Sales:</b> Rs. {totalAmount.toFixed(2)}
        </p>

        <h4>By Payment Mode:</h4>
        <ul>
          {Object.entries(paymentSummary).map(([mode, amount], i) => (
            <li key={i}>
              <b>{mode}:</b> Rs. {amount.toFixed(2)}
            </li>
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
            <th>Customer</th>
            <th>Payment Mode</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((s, idx) => (
            <tr key={idx}>
              <td>{s.id}</td>
              <td>{new Date(s.invoice_date).toLocaleDateString()}</td>
              <td>{s.Customer?.name || "N/A"}</td>
              <td>{s.payment_method}</td>
              <td>{s.final_total}</td>
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
