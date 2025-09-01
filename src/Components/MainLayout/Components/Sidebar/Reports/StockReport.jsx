import React from "react";
import { FaPrint } from "react-icons/fa";
const StockReport = () => {
  // Sample Data (Demo purpose)
  const stockData = [
    {
      item: "Pepsi 1.5L",
      openingStock: 50,
      purchases: 20,
      sales: 30,
      closingStock: 40,
      rate: 180,
      reorderLevel: 10
    },
    {
      item: "Nestle Milk 1L",
      openingStock: 100,
      purchases: 50,
      sales: 80,
      closingStock: 70,
      rate: 250,
      reorderLevel: 20
    },
    {
      item: "Lays Chips",
      openingStock: 200,
      purchases: 100,
      sales: 250,
      closingStock: 50,
      rate: 50,
      reorderLevel: 30
    }
  ];

  // کل اسٹاک ویلیو
  const totalStockValue = stockData.reduce(
    (sum, stock) => sum + stock.closingStock * stock.rate,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Stock Report</h2>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>Item</th>
            <th>Opening Stock</th>
            <th>Purchases</th>
            <th>Sales</th>
            <th>Closing Stock</th>
            <th>Rate</th>
            <th>Stock Value</th>
            <th>Reorder Level</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((stock, index) => (
            <tr key={index}>
              <td>{stock.item}</td>
              <td>{stock.openingStock}</td>
              <td>{stock.purchases}</td>
              <td>{stock.sales}</td>
              <td>{stock.closingStock}</td>
              <td>{stock.rate}</td>
              <td>{stock.closingStock * stock.rate}</td>
              <td
                style={{
                  color: stock.closingStock <= stock.reorderLevel ? "red" : "green",
                  fontWeight: "bold"
                }}
              >
                {stock.reorderLevel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Summary */}
      <div style={{ marginTop: "20px", fontWeight: "bold", textAlign: "right" }}>
        Total Stock Value: Rs. {totalStockValue}
      </div>
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

export default StockReport;
