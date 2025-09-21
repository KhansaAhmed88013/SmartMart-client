import React, { useEffect, useState, useRef,useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { GetStockReport } from "../../../UserService";
import { ProfileContext } from "../../../Context/ProfileContext";


function StockReport() {
  const [stockData, setStockData] = useState([]);
  const [errMessage, setErrMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const {ProfileData}=useContext(ProfileContext)

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const result = await GetStockReport();
        setStockData(result);
      } catch (err) {
        console.error(err);
        setErrMessage("Failed to fetch stock data");
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  // Total Stock Value using closing_stock
  const totalStockValue = stockData.reduce(
    (sum, stock) => sum + Number(stock.closing_stock) * Number(stock.cost_price),
    0
  );

  const filteredData = stockData.filter((row) => {
    // currently rowDate is static; you can later fetch real ledger date if needed
    const rowDate = new Date("2025-09-01"); 
    if (fromDate && rowDate < new Date(fromDate)) return false;
    if (toDate && rowDate > new Date(toDate)) return false;
    return true;
  });

  const reportFrom = fromDate
    ? new Date(fromDate).toLocaleDateString("en-GB")
    : "N/A";

  const reportTo = toDate
    ? new Date(toDate).toLocaleDateString("en-GB")
    : "N/A";

  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Stock Report",
  });

  if (isLoading) return <p>Loading...</p>;
  if (errMessage) return <p style={{ color: "red" }}>{errMessage}</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "10px" }}>
      <div style={{ marginBottom: "20px", display: 'flex', alignItems: 'center', justifyContent:'center' ,gap:'1rem'}}>
        <label>
          From:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ margin: "0 10px", padding: "5px" }}
          />
        </label>
        <label>
          To:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ margin: "0 10px", padding: "5px" }}
          />
        </label>
      </div>

      <div ref={contentRef}>
        <div style={{ textAlign: "center", padding: "5px" }}>
          <h2>{ProfileData.shopName}</h2>
          <p>{ProfileData.location}</p>
          <p>{ProfileData.number1} , {ProfileData.number2}</p>
          <h2>Stock Report</h2>
        </div>

        <hr style={{ border: "2px solid black", margin: "2px 0" }} />

        <p style={{ fontWeight: "bold", textAlign: "center" }}>
          Date From {reportFrom} to {reportTo}
        </p>

        <div style={{
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#f9f9f9",
            display: "flex",
            justifyContent: "space-between",
            textAlign: "center",
            fontWeight: "600",
            flexWrap: "wrap",
            gap: "5px"
        }}>
          <span>Total Stock Value: Rs. {totalStockValue.toFixed(2)}</span>
        </div>

        <hr style={{ border: "2px solid black", margin: "2px 0" }} />

        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", fontSize:'15px' }}
        >
          <thead style={{ backgroundColor: "#f2f2f2" }}>
  <tr>
    <th>ID</th>
    <th>Item</th>
    <th>Category</th>
    <th>Unit</th>
    <th>Opening Stock</th>
    <th>Opening Value</th>
    <th>Purchases</th>
    <th>Sales</th>
    <th>Closing Stock</th>
    <th>Unit Price</th>
    <th>Closing Value</th>
  </tr>
</thead>
<tbody>
  {filteredData.map((stock, index) => (
    <tr key={index}>
      <td>{stock.id}</td>
      <td>{stock.name}</td>
      <td>{stock.Category?.name}</td>
      <td>{stock.unit}</td>
      <td>{stock.opening_stock}</td>
      <td>{stock.opening_stock_value.toFixed(2)}</td>
      <td>{stock.purchases}</td>
      <td>{stock.sales}</td>
      <td>{stock.closing_stock}</td>
      <td>{Number(stock.cost_price).toFixed(2)}</td>
      <td>{stock.closing_stock_value.toFixed(2)}</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      <div style={{ marginTop: "10px", textAlign: "right" }}>
        <button onClick={handlePrint}>
          <FaPrint /> Print
        </button>
      </div>
    </div>
  );
}

export default StockReport;
