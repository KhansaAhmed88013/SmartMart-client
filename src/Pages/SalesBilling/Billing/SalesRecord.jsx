import React, { useRef, useState } from "react";

const SalesRecord = () => {
  const printRef = useRef();
  const [filterDate, setFilterDate] = useState("");

  // 🔹 Dummy Sales Data
  const salesData = [
    {
      invoiceNo: "INV-101",
      date: "2025-09-02",
      cashier: "Ali",
      total: 1000,
      discountItems: 50,
      saleTax: 80,
      netTotal: 1030,
      discountTotal: 30,
      grandTotal: 1000,
      profit: 200,
    },
    {
      invoiceNo: "INV-102",
      date: "2025-09-02",
      cashier: "Sara",
      total: 1500,
      discountItems: 100,
      saleTax: 120,
      netTotal: 1520,
      discountTotal: 50,
      grandTotal: 1470,
      profit: 350,
    },
    {
      invoiceNo: "INV-103",
      date: "2025-09-03",
      cashier: "Ahmed",
      total: 2000,
      discountItems: 150,
      saleTax: 160,
      netTotal: 2010,
      discountTotal: 60,
      grandTotal: 1950,
      profit: 400,
    },
  ];

  // 🔹 Filtered Records
  const filteredRecords = filterDate
    ? salesData.filter((record) => record.date === filterDate)
    : salesData;

  // 🔹 Print Function
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write("<html><head><title>Sales Records</title></head><body>");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
   <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>smart super Mart</h2>
        <p>Behria Enclusive Road Chak Shezad Islamabad</p>
        <h2> Sale Record</h2>
      </div>
      {/* Filter + Print Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        {/* Date Filter */}
        <div>
          <label style={{ marginRight: "8px" }}>Filter by Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: "5px", borderRadius: "4px", border: "1px solid gray" }}
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🖨️ Print
        </button>
      </div>

      {/* Printable Section */}
      <div ref={printRef}>
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead style={{ background: "#f2f2f2" }}>
            <tr>
              <th>Invoice #</th>
              <th>Invoice Date</th>
              <th>Cashier Name</th>
              <th>Total</th>
              <th>Disc. on Items</th>
              <th>Sale Tax</th>
              <th>Net Total</th>
              <th>Disc. on Total</th>
              <th>G. Total</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.invoiceNo}</td>
                  <td>{record.date}</td>
                  <td>{record.cashier}</td>
                  <td>{record.total}</td>
                  <td>{record.discountItems}</td>
                  <td>{record.saleTax}</td>
                  <td>{record.netTotal}</td>
                  <td>{record.discountTotal}</td>
                  <td>{record.grandTotal}</td>
                  <td>{record.profit}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "10px" }}>
                  ❌ No records found for this date
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesRecord;
