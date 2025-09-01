import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";
const SalesReturnReport = () => {
  // Sample Data
  const salesReturns = [
    {
      returnInvoice: "RET-001",
      originalInvoice: "INV-010",
      date: "2025-08-25",
      customer: "Ali Khan",
      item: "Pepsi 1.5L",
      quantity: 1,
      rate: 180,
      totalAmount: 180,
      reason: "Damaged Bottle",
      refundType: "Cash",
      salesperson: "Ahmed"
    },
    {
      returnInvoice: "RET-002",
      originalInvoice: "INV-011",
      date: "2025-08-26",
      customer: "Sara Ahmed",
      item: "Nestle Milk 1L",
      quantity: 2,
      rate: 120,
      totalAmount: 240,
      reason: "Expired Product",
      refundType: "Adjustment",
      salesperson: "Bilal"
    }
  ];

  // States for Filters
  const [filterDate, setFilterDate] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");

  // Filtered Data
  const filteredReturns = salesReturns.filter((ret) => {
    return (
      (filterDate === "" || ret.date === filterDate) &&
      (filterCustomer === "" ||
        ret.customer.toLowerCase().includes(filterCustomer.toLowerCase()))
    );
  });

  // کل ریٹرن کی رقم
  const totalReturn = filteredReturns.reduce(
    (sum, ret) => sum + ret.totalAmount,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Sales Return Report</h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
        <div>
          <label><b>Filter by Date: </b></label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <div>
          <label><b>Filter by Customer: </b></label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>Return Invoice</th>
            <th>Original Invoice</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Item Returned</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total Amount</th>
            <th>Reason</th>
            <th>Refund Type</th>
            <th>Salesperson</th>
          </tr>
        </thead>
        <tbody>
          {filteredReturns.length > 0 ? (
            filteredReturns.map((ret, index) => (
              <tr key={index}>
                <td>{ret.returnInvoice}</td>
                <td>{ret.originalInvoice}</td>
                <td>{ret.date}</td>
                <td>{ret.customer}</td>
                <td>{ret.item}</td>
                <td>{ret.quantity}</td>
                <td>{ret.rate}</td>
                <td>{ret.totalAmount}</td>
                <td>{ret.reason}</td>
                <td>{ret.refundType}</td>
                <td>{ret.salesperson}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Summary */}
      <div style={{ marginTop: "20px", fontWeight: "bold", textAlign: "right" }}>
        Total Amount Returned: Rs. {totalReturn}
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

export default SalesReturnReport;
