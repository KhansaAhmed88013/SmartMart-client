import React from "react";
import { FaPrint } from "react-icons/fa";
const OTSaleReport = () => {
  // Sample Data (Demo purpose)
  const otSales = [
    {
      invoiceNo: "INV-001",
      date: "2025-08-27",
      time: "19:45",
      customer: "Ali Khan",
      item: "Pepsi 1.5L",
      quantity: 2,
      rate: 180,
      discount: 20,
      tax: 10,
      netSale: 350,
      paymentMode: "Cash",
      profit: 80,
      salesperson: "Ahmed"
    },
    {
      invoiceNo: "INV-002",
      date: "2025-08-27",
      time: "21:10",
      customer: "Sara Ahmed",
      item: "Nestle Milk",
      quantity: 1,
      rate: 250,
      discount: 0,
      tax: 0,
      netSale: 250,
      paymentMode: "Card",
      profit: 50,
      salesperson: "Bilal"
    }
  ];

  // Calculate Totals
  const totalQuantity = otSales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalDiscount = otSales.reduce((sum, sale) => sum + sale.discount, 0);
  const totalTax = otSales.reduce((sum, sale) => sum + sale.tax, 0);
  const totalNetSale = otSales.reduce((sum, sale) => sum + sale.netSale, 0);
  const totalProfit = otSales.reduce((sum, sale) => sum + sale.profit, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>OT Sale Report</h2>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>Invoice No</th>
            <th>Date</th>
            <th>Time</th>
            <th>Customer</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Net Sale</th>
            <th>Payment Mode</th>
            <th>Profit</th>
            <th>Salesperson</th>
          </tr>
        </thead>
        <tbody>
          {otSales.map((sale, index) => (
            <tr key={index}>
              <td>{sale.invoiceNo}</td>
              <td>{sale.date}</td>
              <td>{sale.time}</td>
              <td>{sale.customer}</td>
              <td>{sale.item}</td>
              <td>{sale.quantity}</td>
              <td>{sale.rate}</td>
              <td>{sale.discount}</td>
              <td>{sale.tax}</td>
              <td>{sale.netSale}</td>
              <td>{sale.paymentMode}</td>
              <td>{sale.profit}</td>
              <td>{sale.salesperson}</td>
            </tr>
          ))}

          {/* Summary Row */}
          <tr style={{ fontWeight: "bold", backgroundColor: "#e6f7ff" }}>
            <td colSpan="5" style={{ textAlign: "right" }}>
              Totals:
            </td>
            <td>{totalQuantity}</td>
            <td>-</td>
            <td>{totalDiscount}</td>
            <td>{totalTax}</td>
            <td>{totalNetSale}</td>
            <td>-</td>
            <td>{totalProfit}</td>
            <td>-</td>
          </tr>
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

export default OTSaleReport;
