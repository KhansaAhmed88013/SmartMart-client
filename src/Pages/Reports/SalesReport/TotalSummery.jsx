import React from "react";
import { FaPrint } from "react-icons/fa";
const DailySaleSummary = () => {
  // Sample Data: invoices of whole day
  const invoices = [
    {
      invoiceNo: "INV-001",
      items: [
        { item: "Pepsi 1.5L", qty: 2, rate: 180, discount: 20, tax: 10 },
        { item: "Lays Chips", qty: 3, rate: 50, discount: 0, tax: 0 }
      ]
    },
    {
      invoiceNo: "INV-002",
      items: [
        { item: "Nestle Milk", qty: 1, rate: 250, discount: 0, tax: 0 },
        { item: "Oreo Biscuit", qty: 2, rate: 100, discount: 10, tax: 0 }
      ]
    }
  ];

  // --- Calculate Totals ---
  let totalQty = 0,
    totalDiscount = 0,
    totalTax = 0,
    grossAmount = 0;

  invoices.forEach(inv => {
    inv.items.forEach(s => {
      totalQty += s.qty;
      totalDiscount += s.discount;
      totalTax += s.tax;
      grossAmount += s.qty * s.rate;
    });
  });

  const netAmount = grossAmount - totalDiscount + totalTax;

  return (
    <div
      style={{
        width: "300px",
        margin: "auto",
        border: "1px solid #000",
        padding: "10px",
        fontFamily: "monospace"
      }}
    >
      <h3 style={{ textAlign: "center" }}>Daily Sale Summary</h3>
      <p style={{ textAlign: "center" }}>Date: 2025-08-27</p>
      <hr />

      {/* Summary Section */}
      <div style={{ fontSize: "14px" }}>
        <p>Total Invoices: {invoices.length}</p>
        <p>Total Qty Sold: {totalQty}</p>
        <p>Gross Amount: Rs. {grossAmount}</p>
        <p>Discount: Rs. {totalDiscount}</p>
        <p>Tax: Rs. {totalTax}</p>
        <p style={{ fontWeight: "bold" }}>Net Sale: Rs. {netAmount}</p>
      </div>

      <hr />
      <p style={{ textAlign: "center" }}>--- End of Report ---</p>
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

export default DailySaleSummary;
