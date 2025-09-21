import React, { useState, useEffect } from "react";
import "./SupplierInvoicePage.css";
import { FaTrash } from "react-icons/fa";
import {
  getPurchases,
  updatePurchaseStatus,
  DelPurchase,
} from "../../../UserService";

function SupplierInvoicePage() {
  // ✅ Get today's date
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  // ✅ Get same day of previous month
  const prevMonth = new Date(today);
  prevMonth.setMonth(today.getMonth() - 1);
  prevMonth.setDate(today.getDate());
  const formattedPrevMonth = prevMonth.toISOString().split("T")[0];

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [fromDate, setFromDate] = useState(formattedPrevMonth);
  const [toDate, setToDate] = useState(formattedToday);
 const [editStatus, setEditStatus] = useState("");
const [editPaid, setEditPaid] = useState(0);  // ✅ added

// when invoice selected, sync local states
useEffect(() => {
  if (selectedInvoice) {
    setEditPaid(selectedInvoice.paidAmount || 0);
    setEditStatus(selectedInvoice.status || "Pending");
  }
}, [selectedInvoice]);

  const showMessage = (msg, type = "success") => {
    if (type === "success") {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const gettingPurchase = async () => {
    try {
      const result = await getPurchases();
      console.log(result);
      const mappedInvoices = result.map((inv) => {
        const total = parseFloat(inv.total_amount) || 0;
        const paid = inv.paid_amount ? parseFloat(inv.paid_amount) : 0;
        return {
          invoiceNumber: inv.id,
          supplier: inv.supplier,
          purchaseDate: new Date(inv.purchase_date),
          date: new Date(inv.purchase_date).toLocaleDateString(),
          dueDate: inv.due_date
            ? new Date(inv.due_date).toLocaleDateString()
            : "N/A",
          status: inv.payment_status,
          total,
          paidAmount: paid,
          pendingAmount: total - paid, // ✅ always a number
          items: inv.PurchaseItems.map((item) => ({
            product: item.Product.name,
            qty: parseFloat(item.quantity),
            price: parseFloat(item.cost_price),
          })),
        };
      });

      setInvoices(mappedInvoices);
    } catch (err) {
      showMessage("Failed to fetch purchases!", "error");
    }
  };

  useEffect(() => {
    gettingPurchase();
  }, []);

  const getTotals = (items) => {
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return { subtotal };
  };

  
 const handleUpdate = async () => {
  try {
    let newStatus = editStatus;

    // ✅ Auto adjust status based on amounts
    if (editPaid === selectedInvoice.total) {
      newStatus = "Paid";
    } else if (editPaid !== selectedInvoice.total && editStatus === "Paid") {
      newStatus = "Partial";
    }

    await updatePurchaseStatus({
      id: selectedInvoice.invoiceNumber,
      payment_status: newStatus,
      paid_amount: editPaid,
    });

    // update list + selected invoice
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceNumber === selectedInvoice.invoiceNumber
          ? {
              ...inv,
              status: newStatus,
              paidAmount: editPaid,
              pendingAmount: inv.total - editPaid,
            }
          : inv
      )
    );

    setSelectedInvoice((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            paidAmount: editPaid,
            pendingAmount: prev.total - editPaid,
          }
        : prev
    );

    showMessage("Invoice updated successfully!");
  } catch (err) {
    showMessage("Failed to update!", "error");
  }
};

  const statusOptions = ["Pending", "Partial", "Paid", "Cancelled"];

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this purchase?"
    );
    if (!confirmDelete) return;

    try {
      await DelPurchase(id);

      setInvoices((prev) => prev.filter((inv) => inv.invoiceNumber !== id));
      if (selectedInvoice?.invoiceNumber === id) setSelectedInvoice(null);

      showMessage("Purchase deleted successfully!");
    } catch (err) {
      showMessage("Failed to delete purchase!", "error");
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const supplierMatch = inv.supplier.supplier_name
      .toLowerCase()
      .includes(searchSupplier.toLowerCase());

    const statusMatch = searchStatus === "" || inv.status === searchStatus;

    const dateMatch =
      (!fromDate || inv.purchaseDate >= new Date(fromDate)) &&
      (!toDate || inv.purchaseDate <= new Date(toDate));

    return supplierMatch && statusMatch && dateMatch;
  });

  return (
    <div className="supplier-invoices">
      {successMsg && <div className="success-msg">{successMsg}</div>}
      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      <h2>Supplier Invoices</h2>

      {!selectedInvoice && (
        <div className="search-filters row">
          <input
            type="text"
            placeholder="Search by Supplier Name"
            value={searchSupplier}
            onChange={(e) => setSearchSupplier(e.target.value)}
          />
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* From and To date filters */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      )}

      {!selectedInvoice && (
        <table className="invoice-list">
          <thead>
            <tr>
              <th>#</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>No of diff products</th>
              <th>Total (PKR)</th>
              <th>Paid (PKR)</th>
              <th>Pending (PKR)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.invoiceNumber}>
                <td data-label="Invoice #">{inv.invoiceNumber}</td>
                <td data-label="Supplier">{inv.supplier.supplier_name}</td>
                <td data-label="Date">{inv.date}</td>
                <td data-label="Due Date">{inv.dueDate}</td>
                <td data-label="Status">{inv.status}</td>
                <td data-label="No of diff products">{inv.items.length}</td>
                <td data-label="Total (PKR)">
                  {(inv.total || 0).toLocaleString()}
                </td>
                <td data-label="Paid (PKR)">
                  {(inv.paidAmount || 0).toLocaleString()}
                </td>
                <td data-label="Pending (PKR)">
                  {(inv.pendingAmount || 0).toLocaleString()}
                </td>
                <td data-label="Action">
                  <button
                    className="view-btn"
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    View
                  </button>
                  <button
                    className="view-btn"
                    onClick={() => handleDelete(inv.invoiceNumber)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedInvoice && (
        <div className="invoice-detail">
          <button
            className="back"
            onClick={() => setSelectedInvoice(null)}
            style={{ backgroundColor: "blue" }}
          >
            ⬅ Back
          </button>
          <h3>Invoice #{selectedInvoice.invoiceNumber}</h3>
          <p>
            <strong>Supplier:</strong> {selectedInvoice.supplier.supplier_name}
          </p>
          <p>
            <strong>Date:</strong> {selectedInvoice.date}
          </p>
          <p>
            <strong>Due Date:</strong> {selectedInvoice.dueDate}
          </p>
          <p className="row">
  <strong>Status:</strong>{" "}
  <select
    value={editStatus}
    onChange={(e) => setEditStatus(e.target.value)}
  >
    {statusOptions.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </select>
</p>

{/* ✅ Paid input only for Pending / Partial */}
{(editStatus === "Pending" || editStatus === "Partial") && (
  <p className="row">
    <strong>Paid Amount:</strong>{" "}
    <input
      type="number"
      min="0"
      max={selectedInvoice.total}
      value={editPaid}
      onChange={(e) => {
        const value = Math.min(Number(e.target.value), selectedInvoice.total);
        setEditPaid(value);
      }}
    />
  </p>
)}

{/* ✅ Update button */}
<button onClick={handleUpdate} style={{ backgroundColor: "green", color: "white" }}>
  Update
</button>

          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.product}</td>
                  <td>{i.qty}</td>
                  <td>{i.price.toLocaleString()}</td>
                  <td>{(i.qty * i.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {(() => {
            const totals = getTotals(selectedInvoice.items);
            return (
              <div className="summary">
                <h3>Subtotal: {totals.subtotal.toLocaleString()} PKR</h3>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default SupplierInvoicePage;
