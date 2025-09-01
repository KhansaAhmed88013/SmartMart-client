import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";
const SalariesInvoiceReport = () => {
  // Sample Data
  const salaryData = [
    {
      invoiceNo: "SAL-001",
      date: "2025-08-01",
      employee: "Ali Khan",
      department: "Sales",
      basicSalary: 50000,
      allowance: 5000,
      deductions: 2000,
      netSalary: 53000,
      paymentMode: "Bank Transfer"
    },
    {
      invoiceNo: "SAL-002",
      date: "2025-08-01",
      employee: "Sara Ahmed",
      department: "Accounts",
      basicSalary: 60000,
      allowance: 7000,
      deductions: 3000,
      netSalary: 64000,
      paymentMode: "Cash"
    },
    {
      invoiceNo: "SAL-003",
      date: "2025-08-05",
      employee: "Bilal Hassan",
      department: "HR",
      basicSalary: 45000,
      allowance: 4000,
      deductions: 1000,
      netSalary: 48000,
      paymentMode: "Bank Transfer"
    }
  ];

  const [filterDept, setFilterDept] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // فلٹر شدہ ڈیٹا
  const filteredData = salaryData.filter((emp) => {
    return (
      (filterDept === "" || emp.department === filterDept) &&
      (filterDate === "" || emp.date === filterDate)
    );
  });

  // کل سیلری (فلٹر شدہ)
  const totalSalary = filteredData.reduce((sum, emp) => sum + emp.netSalary, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Salaries Invoice Wise Report</h2>

      {/* Filter Options */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>
          Department:
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="">All</option>
            <option value="Sales">Sales</option>
            <option value="Accounts">Accounts</option>
            <option value="HR">HR</option>
          </select>
        </label>

        <label style={{ marginLeft: "20px" }}>
          Date:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ marginLeft: "5px" }}
          />
        </label>
      </div>

      {/* Table */}
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>Invoice No</th>
            <th>Date</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Basic Salary</th>
            <th>Allowance</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Payment Mode</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((sal, index) => (
              <tr key={index}>
                <td>{sal.invoiceNo}</td>
                <td>{sal.date}</td>
                <td>{sal.employee}</td>
                <td>{sal.department}</td>
                <td>{sal.basicSalary}</td>
                <td>{sal.allowance}</td>
                <td>{sal.deductions}</td>
                <td>{sal.netSalary}</td>
                <td>{sal.paymentMode}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No Records Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Total Summary */}
      <div style={{ marginTop: "20px", fontWeight: "bold", textAlign: "right" }}>
        Total Salaries Paid: Rs. {totalSalary}
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

export default SalariesInvoiceReport;
