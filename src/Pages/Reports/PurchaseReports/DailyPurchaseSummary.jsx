import React, { useState, useEffect,useContext } from "react";
import { getDailyPurchases } from "../../../UserService";
import { ProfileContext } from "../../../Context/ProfileContext";

const DailyPurchaseSummary = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]); // ✅ start with empty array
  const [msg, setMsg] = useState(null);
  const {ProfileData}=useContext(ProfileContext)

  // ✅ Fetch data on mount
  useEffect(() => {
    const fetchPurchaseSummary = async () => {
      try {
        const result = await getDailyPurchases();
        setPurchaseData(result);

        // apply default filter after data loads
        const { start, end } = getDefaultDateRange();
        setFromDate(start);
        setToDate(end);
        setFiltered(result.filter((p) => p.date >= start && p.date <= end));
      } catch (err) {
        console.error(err);
        setMsg("Failed to fetch data");
      }
    };
    fetchPurchaseSummary();
  }, []);

  // ✅ helper: get start and end of current month
  const getDefaultDateRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    };
  };

  // ✅ filter purchases by date
  const filterPurchases = (start, end) => {
    return purchaseData.filter((p) => p.date >= start && p.date <= end);
  };

  // ✅ handle filter click
  const handleFilter = () => {
    setFiltered(filterPurchases(fromDate, toDate));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "center", padding: "5px" }}>
          <h3>{ProfileData.shopName}</h3>
          <p>{ProfileData.location} </p>
          <p>{ProfileData.number1} , {ProfileData.number2}</p>
          <h2>Daily Purchase Summary</h2>
        </div>

      {/* 🔹 Error Message */}
      {msg && (
        <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
          {msg}
        </p>
      )}

      {/* Filter Section */}
      <div style={{ marginBottom: "15px" }}>
        <label>
          From:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>{" "}
        <label>
          To:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>{" "}
        <button onClick={handleFilter}>Filter</button>
      </div>

      {/* Summary Table */}
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Date</th>
            <th>Total Purchases</th>
            <th>Paid</th>
            <th>Pending</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <tr key={p.date}>
                <td>{p.date}</td>
                <td>{p.total}</td>
                <td>{p.paid}</td>
                <td>{p.pending ?? p.total - p.paid}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No purchases found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DailyPurchaseSummary;
