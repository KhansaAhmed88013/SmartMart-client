import React, { useEffect, useState, useRef, useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { GetSalesReportData } from "../../../UserService";
import { ProfileContext } from "../../../Context/ProfileContext";

function SalesSummary() {
  const [salesData, setSalesData] = useState([]);
  const [errMessage, setErrMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const { ProfileData } = useContext(ProfileContext);

  // ✅ safe number parser
  const toNum = (val) => (val ? parseFloat(val) : 0);

  // Fetch sales data
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const result = await GetSalesReportData();
        setSalesData(result.formatted);
        setUsers(result.users);
      } catch (err) {
        console.error(err);
        setErrMessage("Failed to fetch sales data");
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const filteredData = salesData.filter((row) => {
    const rowDate = new Date(row.invoice_date);
    if (fromDate && rowDate < new Date(fromDate)) return false;
    if (toDate && rowDate > new Date(toDate)) return false;
    if (selectedUser && row.cashier_name !== selectedUser) return false;
    return true;
  });

  // Totals
  const totalCost = filteredData.reduce((sum, row) => sum + toNum(row.costPrice), 0);
  const totalTaxOnItems = filteredData.reduce((sum, row) => sum + toNum(row.totalTax), 0);
  const totalSaleTax = filteredData.reduce((sum, row) => sum + toNum(row.invoiceTax), 0);
  const totalSales = filteredData.reduce((sum, row) => sum + toNum(row.net_total), 0);
  const totalProfit = filteredData.reduce((sum, row) => sum + toNum(row.profit), 0);

  const transactions = filteredData.length;
  const avgBill = transactions > 0 ? (totalSales / transactions).toFixed(2) : 0;

  // Report date range
  const reportFrom = filteredData[0]
    ? new Date(filteredData[0].invoice_date).toLocaleDateString("en-GB")
    : "N/A";
  const reportTo = filteredData[filteredData.length - 1]
    ? new Date(filteredData[filteredData.length - 1].invoice_date).toLocaleDateString("en-GB")
    : "N/A";

  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Sales Summary Report",
  });

  if (isLoading) return <p>Loading...</p>;
  if (errMessage) return <p style={{ color: "red" }}>{errMessage}</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* User Filter Dropdown */}
      <div ref={contentRef}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <label>
            Cashier:{" "}
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{ margin: "0 10px", padding: "5px" }}
            >
              <option value="">All</option>
              {users.map((u, i) => (
                <option key={i} value={u.username}>
                  {u.username}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Date Filter Inputs */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <label style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            From:{" "}
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ margin: "0 10px", padding: "5px" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            To:{" "}
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ margin: "0 10px", padding: "5px" }}
            />
          </label>
        </div>

        {/* Report Header */}
        <div style={{ textAlign: "center", padding: "5px" }}>
          <h2>{ProfileData.shopName}</h2>
          <p>{ProfileData.location}</p>
          <p>
            {ProfileData.number1} , {ProfileData.number2}
          </p>
          <h2>Daily Sale Summary Report</h2>
        </div>

        <hr style={{ border: "2px solid black", margin: "2px 0" }} />
        <p style={{ fontWeight: "bold", textAlign: "center" }}>
          Date From {reportFrom} to {reportTo}
        </p>

        {/* Totals */}
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#f9f9f9",
            fontWeight: "600",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Cost: {totalCost.toLocaleString()}</span>
            <span>Total Tax on Items: {totalTaxOnItems.toLocaleString()}</span>
            <span>Total Sale Tax: {totalSaleTax.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Profit: {totalProfit.toFixed(2)}</span>
            <span>Transactions: {transactions}</span>
            <span>Average Bill: {avgBill}</span>
          </div>
          <span>Total Sales: {totalSales.toLocaleString()}</span>
        </div>

        <hr style={{ border: "2px solid black", margin: "2px 0" }} />

        {/* Sales Table */}
        <table border="1" cellPadding="2" cellSpacing="0" width="100%" style={{ fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th>Invoice Date</th>
              <th>Invoice No</th>
              <th>Cashier</th>
              <th>Total Cost</th>
              <th>Total</th>
              <th>Disc on Items</th>
              <th>Tax on Item</th>
              <th>Net Total</th>
              <th>Disc. on Total</th>
              <th>Tax on Bill</th>
              <th>G. Total</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <tr key={i}>
                  <td>{new Date(row.invoice_date).toLocaleDateString("en-GB")}</td>
                  <td>{row.invoice_no}</td>
                  <td>{row.cashier_name}</td>
                  <td>{toNum(row.costPrice).toLocaleString()}</td>
                  <td>{toNum(row.gross).toLocaleString()}</td>
                  <td>{toNum(row.itemDiscount).toLocaleString()}</td>
                  <td>{toNum(row.totalTax).toLocaleString()}</td>
                  <td>{toNum(row.net_total).toLocaleString()}</td>
                  <td>{toNum(row.invoiceDiscount).toLocaleString()}</td>
                  <td>{toNum(row.invoiceTax).toLocaleString()}</td>
                  <td>{toNum(row.net_total).toLocaleString()}</td>
                  <td>{toNum(row.profit).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", color: "red" }}>
                  No records found for selected date range
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default SalesSummary;
