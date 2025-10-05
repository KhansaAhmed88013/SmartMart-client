import React, { useEffect, useState, useRef, useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { ProfileContext } from "../../../Context/ProfileContext";
import { GetDailySalesReport } from "../../../UserService";

function DailySalesReport() {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { ProfileData } = useContext(ProfileContext);
  const contentRef = useRef();

  // ✅ Set default date range: same day of last month to today
  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); // 0-indexed
    const year = today.getFullYear();

    const to = today;
    const from = new Date(year, month - 1, day);

    const formatDate = (d) => d.toISOString().split("T")[0];

    setFromDate(formatDate(from));
    setToDate(formatDate(to));
  }, []);

  // ✅ Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetDailySalesReport();
        setData(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
 
  // ✅ Print setup
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Daily Sales Report",
  });

  // ✅ Filter data by date
  const filteredSales = data.filter((group) => {
    const date = group[0]?.invoiceDate;
    if (!date) return false;

    if (fromDate && date < fromDate) return false;
    if (toDate && date > toDate) return false;

    return true;
  });

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Date Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <label>
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ margin: "0 10px", padding: "5px" }}
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ margin: "0 10px", padding: "5px" }}
          />
        </label>
      </div>

      <div ref={contentRef}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "5px" }}>
          <h2>{ProfileData.shopName}</h2>
          <p>{ProfileData.location}</p>
          <p>
            {ProfileData.number1}, {ProfileData.number2}
          </p>
          <h2>Daily Sale Summary Report</h2>

          {/* Show selected date range */}
          {fromDate || toDate ? (
            <p>
              Period: {fromDate ? fromDate : "___"} &nbsp; to &nbsp;{" "}
              {toDate ? toDate : "___"}
            </p>
          ) : null}
        </div>

        <hr style={{ border: "2px solid black", margin: "5px 0" }} />

        {/* Tables for each date */}
        {filteredSales.map((rows, idx) => {
          const date = rows[0]?.invoiceDate;
          return (
            <div key={idx} style={{ marginBottom: "30px" }}>
              <table
                border="1"
                cellPadding="5"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr style={{ background: "#f0f0f0d4" }}>
                    <th>Invoice Date</th>
                    <th>Cashier</th>
                    <th>Total</th>
                    <th>Disc on Items</th>
                    <th>Tax on Items</th>
                    <th>Net Total</th>
                    <th>Disc on Total</th>
                    <th>Tax on Total</th>
                    <th>G Total</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      style={
                        row.cashierName === "Daily Total"
                          ? { fontWeight: "bold", background: "#d9f7d9c7" }
                          : {}
                      }
                    >
                      <td>{row.invoiceDate}</td>
                      <td>{row.cashierName}</td>
                      <td>{row.total.toFixed(2)}</td>
                      <td>{row.discItems.toFixed(2)}</td>
                      <td>{row.taxItems.toFixed(2)}</td>
                      <td>{row.netTotal.toFixed(2)}</td>
                      <td>{row.discTotal.toFixed(2)}</td>
                      <td>{row.taxTotal.toFixed(2)}</td>
                      <td>{row.grandTotal.toFixed(2)}</td>
                      <td>{row.profit.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Print Button */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button onClick={handlePrint}>
          <FaPrint /> Print
        </button>
      </div>
    </div>
  );
}

export default DailySalesReport;
