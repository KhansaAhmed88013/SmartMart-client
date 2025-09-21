import React, { useEffect, useState ,useContext} from "react";
import "./CashierReport.css"; // import the CSS
import { GetCashierSalesReport } from "../../UserService";
import { UserContext } from "../../Context/UserContext";

function CashierReport() {
  const [salesData, setSalesData] = useState([]);
  const [msg, setMsg] = useState(null);
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const username=currentUser.username
        const role=currentUser.role
        const result = await GetCashierSalesReport(username,role);
        setSalesData(result);
      } catch (err) {
        console.log(err);
        setMsg("Failed in fetching report data ", err);
      }
    };
    fetchData();
  }, []);
 console.log(salesData)
  const today = new Date().toISOString().split("T")[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(today);
  const [expandedRow, setExpandedRow] = useState(null);

  // 🔹 Filter sales by date
 // 🔹 Filter sales by date
const filteredSales = salesData.filter((s) => {
  const saleDate = new Date(s.date);
  return (
    saleDate >= new Date(fromDate) &&
    saleDate <= new Date(toDate + "T23:59:59")
  );
});

  // 🔹 Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cashier-sales-container">
        {/* 🔹 Error Message */}
      {msg && (
        <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
          {msg}
        </p>
      )}
      <div className="header">
        <h2>Cashier Sales Record</h2>
        <button className="print-btn" onClick={handlePrint}>
          🖨️ Print
        </button>
      </div>

      {/* Date filters */}
      <div className="filters">
        <label>From: </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <label>To: </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* Sales table */}
      <table className="sales-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Date & Time</th>
            <th>Payment Type</th>
            <th>Total (PKR)</th>
            <th>Discount</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((s, idx) => (
            <React.Fragment key={idx}>
              <tr
                onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                className="clickable-row"
              >
                <td>{s.invoiceNo}</td>
                <td>{new Date(s.date).toLocaleString()}</td>
                <td>{s.paymentType}</td>
                <td>{s.total.toLocaleString()}</td>
                <td>{s.discount.toLocaleString()}</td>
                <td>{s.items.length}</td>
              </tr>

              {expandedRow === idx && (
                <tr className="expanded-row">
                  <td colSpan="6">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.items.map((item, i) => (
                          <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.qty}</td>
                            <td>{item.price.toLocaleString()}</td>
                            <td>{(item.qty * item.price).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CashierReport;
