import React, { useState, useEffect, useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { getInvoiceReport } from "../../../UserService";
import { ProfileContext } from "../../../Context/ProfileContext";

const InvoiceReport = () => {
  const today = new Date().toISOString().split("T")[0];

  const [invoices, setInvoices] = useState([]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const { ProfileData } = useContext(ProfileContext);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await getInvoiceReport({ startDate, endDate });
        setInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [startDate, endDate]);
  // Calculate subtotal of an invoice
  const calculateSubtotal = (items) =>
    items.reduce((sum, item) => sum + Number(item.total_amount), 0);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "center", padding: "5px" }}>
        <h2>{ProfileData.shopName}</h2>
        <p>{ProfileData.location}</p>
        <p>
          {ProfileData.number1} , {ProfileData.number2}
        </p>
        <h2>Invoice Report</h2>
      </div>

      {/* Date Filter */}
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

      {/* Invoice List */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : invoices.length > 0 ? (
        invoices.map((invoice) => (
          <div
            key={invoice.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>Invoice ID: {invoice.id}</h3>
            <div style={{ display: "flex", gap: "30%", alignItems: "center" }}>
              <span>
                <b>Date:</b>{" "}
                {new Date(invoice.invoice_date).toLocaleDateString()}
              </span>
              <span>
                <b>Customer:</b> {invoice.Customer?.name || "Walk-in"}
              </span>
            </div>

            <div style={{ display: "flex", gap: "25%", alignItems: "center" }}>
              <span>
                <b>Payment Method:</b> {invoice.payment_method}
              </span>
              <span>
                <b>Cashier:</b> {invoice.creater?.username || "-"}
              </span>
            </div>

            <table
              border="1"
              cellPadding="6"
              cellSpacing="0"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead style={{ backgroundColor: "#f9f9f9" }}>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Discount</th>
                  <th>Tax (%)</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoice.InvoiceItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.Product?.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.total_discount || "0.00"}</td>
                    <td>{item.tax_percent}</td>
                    <td>{item.total_amount}</td>
                  </tr>
                ))}
                {/* Final row for discount, tax, net */}
                <tr style={{ fontWeight: "bold", backgroundColor: "#f2f2f2" }}>
                  <td colSpan="6">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px 0", // spreads them across the row
                        paddingRight: "10px",
                        paddingLeft: "10px",
                      }}
                    >
                      <span>
                        Discount on Bill: Rs. {invoice.discount || "0.00"}
                      </span>
                      <span>
                        Tax on Bill: Rs.{" "}
                        {(
                          ((calculateSubtotal(invoice.InvoiceItems) -
                            invoice.discount) *
                            Number(invoice.tax_percent)) /
                          100
                        ).toFixed(2)}{" "}
                        ({invoice.tax_percent}%)
                      </span>
                      <span>Net Amount: Rs. {invoice.final_total}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
