import React, { useEffect, useState,useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { getPurchases } from "../../../UserService";
import { ProfileContext } from "../../../Context/ProfileContext";

const PurchaseReport = () => {
  const [purchases, setPurchases] = useState([]);
  const [msg, setMsg] = useState(null);
  const [showOverdue, setShowOverdue] = useState(false);
  const [search, setSearch] = useState("");
  const {ProfileData}=useContext(ProfileContext)

  // 🔹 Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const purchasesData = await getPurchases();

        // 🔹 Transform API response into frontend-friendly structure
        const formatted = purchasesData.map((p) => ({
          id: p.id,
          invoiceNo: `PUR-${p.id}`,
          supplier: p.supplier?.supplier_name || "Unknown",
          date: p.purchase_date,
          due_date: p.due_date || null,
          status: p.payment_status,
          remarks: p.remarks,
          total_amount: parseFloat(p.total_amount),
          products: p.PurchaseItems
            ? p.PurchaseItems.map((item) => ({
                item: item.Product?.name || "N/A",
                quantity: Number(item.quantity),
                rate: Number(item.price),
              }))
            : [],
        }));

        setPurchases(formatted);
      } catch (err) {
        console.error(err);
        setMsg("❌ Failed to fetch Purchase data from server.");
      }
    };
    fetchPurchase();
  }, []);

  // 🔹 Date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔹 Filter purchases by purchase date
  const dateFiltered = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    return (!from || purchaseDate >= from) && (!to || purchaseDate <= to);
  });

  // 🔹 Overdue filter
  const overduePurchases = dateFiltered.filter((purchase) => {
    const isDueVisible =
      purchase.status === "Pending" || purchase.status === "Partial";
    return (
      isDueVisible &&
      purchase.due_date &&
      new Date(purchase.due_date) < new Date()
    );
  });

  // 🔹 Apply overdue toggle
  const filteredByToggle = showOverdue ? overduePurchases : dateFiltered;

  // 🔹 Apply search filter
  const finalPurchases = filteredByToggle.filter((p) => {
    const searchLower = search.toLowerCase();
    return (
      p.supplier.toLowerCase().includes(searchLower) ||
      p.invoiceNo.toLowerCase().includes(searchLower) ||
      p.status.toLowerCase().includes(searchLower) ||
      p.products.some((prod) =>
        prod.item.toLowerCase().includes(searchLower)
      )
    );
  });

  // 🔹 Summary Calculations
  const totalAmount = finalPurchases.reduce(
    (sum, p) =>
      sum +
      p.products.reduce((s, prod) => s + prod.quantity * prod.rate, 0),
    0
  );
  const totalQuantity = finalPurchases.reduce(
    (sum, p) => sum + p.products.reduce((s, prod) => s + prod.quantity, 0),
    0
  );
  const totalTransactions = finalPurchases.length;
  const averageBill =
    totalTransactions > 0 ? (totalAmount / totalTransactions).toFixed(2) : 0;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "5px" }}>
          <h2>{ProfileData.shopName}</h2>
          <p>{ProfileData.location}</p>
          <p>{ProfileData.number1} , {ProfileData.number2}</p>
          <h2>Daily Purchase Report</h2>
        </div>
      
      {/* 🔹 Error Message */}
      {msg && (
        <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
          {msg}
        </p>
      )}

      {/* Date Filter */}
      <div style={{ marginBottom: "20px", textAlign: "center" }} className="row">
        <label>
          From Date:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "15px" }}>
          To Date:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
      </div>

      {/* 🔹 Search & Toggle Buttons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Supplier, Invoice, Status, Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "50%",
            marginRight: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={() => setShowOverdue(false)}
          style={{
            padding: "8px 12px",
            marginRight: "10px",
            background: !showOverdue ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          All Purchases
        </button>
        <button
          onClick={() => setShowOverdue(true)}
          style={{
            padding: "8px 12px",
            background: showOverdue ? "red" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Overdue Purchases
        </button>
      </div>
      
      {/* Summary Section */}
      <div
        style={{
          marginBottom: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          textAlign: "center",
        }}
      >
        <div style={{ background: "#f8f9fa", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h4>Total Purchases</h4>
          <p style={{ fontWeight: "bold" }}>Rs. {totalAmount}</p>
        </div>
        <div style={{ background: "#f8f9fa", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h4>Total Quantity</h4>
          <p style={{ fontWeight: "bold" }}>{totalQuantity}</p>
        </div>
        <div style={{ background: "#f8f9fa", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h4>Transactions</h4>
          <p style={{ fontWeight: "bold" }}>{totalTransactions}</p>
        </div>
        <div style={{ background: "#f8f9fa", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h4>Average Bill</h4>
          <p style={{ fontWeight: "bold" }}>Rs. {averageBill}</p>
        </div>
      </div>

      {/* Purchases */}
      {finalPurchases.length > 0 ? (
        finalPurchases.map((purchase) => {
          const isDueVisible =
            purchase.status === "Pending" || purchase.status === "Partial";
          const isOverdue =
            isDueVisible &&
            purchase.due_date &&
            new Date(purchase.due_date) < new Date();

          return (
            <div
              key={purchase.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            >
              <h3>Invoice No: {purchase.invoiceNo}</h3>
              <p>
                <b>Supplier:</b> {purchase.supplier}
              </p>
              <p>
                <b>Date:</b> {formatDate(purchase.date)}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    color: purchase.status === "Paid" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {purchase.status}
                </span>
              </p>

              {isDueVisible && (
                <p>
                  <b>Due Date:</b>{" "}
                  <span
                    style={{
                      color: isOverdue ? "red" : "black",
                      fontWeight: isOverdue ? "bold" : "normal",
                    }}
                  >
                    {formatDate(purchase.due_date)}
                  </span>
                </p>
              )}

              {/* Products Table */}
              <table
                border="1"
                cellPadding="8"
                cellSpacing="0"
                style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
              >
                <thead style={{ backgroundColor: "#f2f2f2" }}>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Rate (PKR)</th>
                    <th>Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.products.map((prod, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{prod.item}</td>
                      <td>{prod.quantity}</td>
                      <td>{prod.rate}</td>
                      <td>{prod.quantity * prod.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Invoice Total */}
              <div style={{ textAlign: "right", marginTop: "10px", fontWeight: "bold" }}>
                Invoice Total: Rs.{" "}
                {purchase.products.reduce(
                  (s, prod) => s + prod.quantity * prod.rate,
                  0
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>
          No records found for selected date range
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

export default PurchaseReport;
