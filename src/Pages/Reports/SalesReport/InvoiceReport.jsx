import React, { useState, useEffect,useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { getInvoiceReport } from "../../../UserService";
import { ProfileContext } from "../../../Context/ProfileContext";

const InvoiceReport = () => {
  const today = new Date().toISOString().split("T")[0]; // ✅ format: YYYY-MM-DD

  const [invoices, setInvoices] = useState([]);
  const [startDate, setStartDate] = useState(today); // default today
  const [endDate, setEndDate] = useState(today);     // default today
  const [loading, setLoading] = useState(false);
  const {ProfileData}=useContext(ProfileContext)

  // ✅ Fetch invoices from backend
 const fetchInvoices = async () => {
  try {
    setLoading(true);
    const data = await getInvoiceReport({ startDate, endDate });

    // 🔄 Transform Sequelize data → UI-friendly structure
    const formatted = (data || []).map(inv => ({
      invoiceNo: inv.id,
      date: inv.invoice_date,
      customer: inv.Customer?.name || "Unknown",
      salesperson: inv.cashier_name,
      paymentMode: inv.payment_method,
      items: (inv.InvoiceItems || []).map(it => ({
        name: it.Product?.name || "N/A",
        qty: Number(it.quantity),
        rate: Number(it.price),
        discount: Number(it.discount || 0),
        tax: Number(it.tax_percent || 0)
      })),
      netAmount: Number(inv.final_total)
    }));

    console.log("Formatted invoices:", formatted);
    setInvoices(formatted);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    setInvoices([]);
  } finally {
    setLoading(false);
  }
};

  // auto-fetch on date change
  useEffect(() => {
    fetchInvoices();
  }, [startDate, endDate]);

  // ✅ Calculate Net Amount safely
  const calculateNetAmount = (items = []) =>
    items.reduce(
      (sum, item) =>
        sum + (Number(item.qty) * Number(item.rate) - Number(item.discount) + Number(item.tax)),
      0
    );

  // ✅ Summary Data
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce(
    (sum, inv) => sum + calculateNetAmount(inv.items || []),
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "center", padding: "5px" }}>
          <h2>{ProfileData.shopName}</h2>
          <p>{ProfileData.location}</p>
          <p>{ProfileData.number1} , {ProfileData.number2}</p>
          <h2>Invoice Report</h2>
        </div>
      
      {/* Date Range Filter */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label>From: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <label>To: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Summary Section */}
      <div
        style={{
          border: "1px solid #333",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: "#f2f2f2",
        }}
      >
        <h3>Summary</h3>
        <p><b>Total Invoices:</b> {totalInvoices}</p>
        <p><b>Total Net Amount:</b> Rs. {totalAmount}</p>
      </div>

      {/* Invoice List */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : invoices.length > 0 ? (
        invoices.map((invoice, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>Invoice No: {invoice.invoiceNo}</h3>
            <p><b>Date:</b> {new Date(invoice.date).toLocaleDateString()}</p>
            <p><b>Customer:</b> {invoice.customer}</p>
            <p><b>Salesperson:</b> {invoice.salesperson}</p>
            <p><b>Payment Mode:</b> {invoice.paymentMode}</p>

            <table
              border="1"
              cellPadding="6"
              cellSpacing="0"
              style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
            >
              <thead style={{ backgroundColor: "#f9f9f9" }}>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.rate}</td>
                    <td>{item.discount}</td>
                    <td>{item.tax}</td>
                    <td>
                      {Number(item.qty) * Number(item.rate) - Number(item.discount) + Number(item.tax)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: "right", marginTop: "10px", fontWeight: "bold" }}>
              Net Amount: Rs. {calculateNetAmount(invoice.items || [])}
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>
          No invoices found in this date range.
        </p>
      )}

      {/* Print Button */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
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

export default InvoiceReport;
