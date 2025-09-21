import React, { useState, useEffect } from "react";
import "./BillingPOS.css";
import { FaPrint, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import {
  AddInvoice,
  getLastInvoiceNo,
  getProfile,
  GetProductByBarcode,
  GetCutomers,
  AddCustomer,
} from "../../../../UserService";
import AddCustomerForm from "./AddCustomerForm";
import Select from "react-select";
import CustomerList from "./CustomerList";


function BillingPOS() {
  // Product rows
  const [rows, setRows] = useState([
    { selected: true, code: "", name: "", price: "", qty: "", tax: "", net: "" },
  ]);

  // Invoice/profile
  const [dateTime, setDateTime] = useState(new Date());
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [profileData, setProfileData] = useState({
    shopName: "",
    number1: "",
    number2: "",
    location: "",
    description: "",
  });

  // Customers
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({ name: "" });
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);

  // Billing states
  const [preDiscountRs, setPreDiscountRs] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [showPrePrint, setShowPrePrint] = useState(false);
  const [barcodeError, setBarcodeError] = useState("");

  // Fetch invoice number
  const fetchInvoiceNo = async () => {
    try {
      const result = await getLastInvoiceNo();
      setInvoiceNo(result && result.id ? result.id + 1 : 1);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Fetch profile + invoice
  useEffect(() => {
    fetchInvoiceNo();
    (async () => {
      try {
        const result = await getProfile();
        if (result) setProfileData(result);
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, []);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await GetCutomers();
        setCustomers(data || []);
      } catch (err) {
        console.error("Error fetching customers:", err.message);
      }
    };
    fetchCustomers();
  }, []);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerList(false);
  };

  // Add new row
  const addRow = () => {
    setRows([
      ...rows,
      { selected: true, code: "", name: "", price: "", qty: "", tax: "", net: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    const price = parseFloat(updated[index].price) || 0;
    const qty = parseFloat(updated[index].qty) || 0;
    const tax = parseFloat(updated[index].tax) || 0;

    const subtotal = price * qty;
    updated[index].net = (subtotal + (subtotal * tax) / 100).toFixed(2);

    setRows(updated);

    if (index === rows.length - 1 && value !== "") {
      addRow();
    }
  };

  // Derived values
  const filledRows = rows.filter(
    (row) => row.selected && (row.name || row.code || parseFloat(row.qty) > 0)
  );
  const grandTotal = filledRows.reduce(
    (sum, row) => sum + (parseFloat(row.net) || 0),
    0
  );
  const showTaxColumn = filledRows.some((row) => parseFloat(row.tax) > 0);
  const itemTaxTotal = filledRows.reduce((sum, row) => {
    const price = parseFloat(row.price) || 0;
    const qty = parseFloat(row.qty) || 0;
    const tax = parseFloat(row.tax) || 0;
    return sum + (price * qty * tax) / 100;
  }, 0);

  const discount = parseFloat(preDiscountRs) || 0;
  const globalTaxAmount = (grandTotal * (parseFloat(taxPercent) || 0)) / 100;
  const finalTotal = grandTotal - discount + globalTaxAmount;
  const changeAmount = (parseFloat(paidAmount) || 0) - finalTotal;

  // Barcode entry
  const handleBarcodeEnter = async (index, e) => {
    if (e.key === "Enter") {
      const barcode = e.target.value.trim();
      if (!barcode) return;
      try {
        const product = await GetProductByBarcode(barcode);
        if (product) {
          const updated = [...rows];
          updated[index].code = product.code;
          updated[index].name = product.name;
          updated[index].price = product.sale_price;
          setRows(updated);
          setBarcodeError("");
          if (index === rows.length - 1) addRow();
        } else {
          setBarcodeError("❌ Product not found");
          setTimeout(() => setBarcodeError(""), 3000);
        }
      } catch {
        setBarcodeError("❌ Product not found");
        setTimeout(() => setBarcodeError(""), 3000);
      }
    }
  };

  // Pre print
  const handlePrePrint = () => {
    setPreDiscountRs(0);
    setPaidAmount(finalTotal.toFixed(2));
    setShowPrePrint(true);
  };

  // Save + Print
  const handleSubmit = async () => {
    try {
      await AddInvoice({
  invoice: {
    account_id: "Cash",
    cashier_name: "Administrator",
    payment_method: "Cash Sale",
    remarks: "POS Billing",
    discount: preDiscountRs,
    tax_percent: taxPercent,
    final_total: finalTotal,
    paid_amount: paidAmount,
    customer_id: selectedCustomer?.id !== undefined ? selectedCustomer.id : 0, // ✅ use 0 instead of null
    is_return: false,
  },
  items: filledRows.map((row) => ({
    product_code: row.code,
    price: parseFloat(row.price) || 0,
    quantity: parseFloat(row.qty) || 0,
    return_qty: 0,
    tax_percent: parseFloat(row.tax) || 0,
  })),
});

      handlePrint();
      setRows([{ selected: true, code: "", name: "", price: "", qty: "", tax: "", net: "" }]);
      setPreDiscountRs(0);
      setPaidAmount(0);
      fetchInvoiceNo();
    } catch (err) {
      alert(err.message);
    }
  };

  // Print receipt
  const handlePrint = () => {
    let receiptContent = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { font-family: monospace; font-size: 12px; width: 80mm; margin: 0 auto; padding: 10px 0px; }
            h2 { text-align: center; font-size: 18px; margin: 5px 0; }
            .center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 5px 0; }
            .row { display: flex; justify-content: space-between; margin: 2px 0; }
            .summary { display: flex; justify-content: space-between; margin-top: 5px; }
            .summary-left { width: 37%; text-align: left; }
            .summary-right { width: 62%; text-align: left; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            td, th { padding: 2px 0; }
            .footer { text-align: center; margin-top: 5px; font-size: 10px; }
            .footer p { padding: 0; }
          </style>
        </head>
        <body>
          <h2>${profileData.shopName}</h2>
          <div class="center"><strong>Phone:</strong> ${profileData.number1}, ${profileData.number2}</div>
          <div class="center"><strong>${profileData.location}</strong></div>
          <div class="divider"></div>
          <div class="row"><div><strong>Invoice no: ${invoiceNo}</strong></div><div><strong>Type:</strong> Sale</div></div>
          <div class="row"><div><strong>Date:</strong> ${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}</div></div>
          <div class="row"><div><strong>Cashier:</strong> Administrator</div></div>
          <div class="row"><div><strong>Cust/P:</strong> ${selectedCustomer.name || "Cash"}</div></div>
          <div class="divider"></div>
          <table>
            <thead>
              <tr>
                <th>#</th><th>Item</th><th class="right">Price</th><th class="right">Qty</th>
                ${showTaxColumn ? '<th class="right">Tax %</th>' : ""}
                <th class="right">Net</th>
              </tr>
            </thead>
            <tbody>
              ${filledRows
                .map(
                  (row, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${row.name}</td>
                    <td class="right">${row.price}</td>
                    <td class="right">${row.qty}</td>
                    ${
                      showTaxColumn
                        ? `<td class="right">${
                            parseFloat(row.tax) > 0 ? row.tax + "%" : ""
                          }</td>`
                        : ""
                    }
                    <td class="right">${row.net}</td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="divider"></div>
          <div class="summary">
            <div class="summary-left">
              <div><strong>Total Items: ${filledRows.length}</strong></div>
              <div><strong>Discount: ${preDiscountRs}</strong></div>
              <div><strong>Tax: ${(itemTaxTotal + globalTaxAmount).toFixed(2)}</strong></div>
            </div>
            <div class="summary-right">
              <div><strong>Sub Total: ${grandTotal.toFixed(2)}</strong></div>
              <div><strong>Final Total: ${finalTotal.toFixed(2)}</strong></div>
              <div><strong>Paid: ${paidAmount}</strong></div>
              <div><strong>Change: ${changeAmount.toFixed(2)}</strong></div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="footer">
            <p>${profileData.description}</p>
            <p>Thank you for shopping!</p>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open("", "PRINT", "height=900,width=900");
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
     <div className="billing-container">
      {/* Header */}
      <div className="billing-header">
        {/* Part 1 */}
        <div className="header-row">
            <label>Acc ID:</label>
            <input type="text" defaultValue="Cash" />
          </div>
          <div className="header-row">
            <label>Return Quantity:</label>
            <input type="checkbox" />
          </div>
    <div className="header-row">
  <label>Customer Names</label>
  <Select
    options={[
      // 👇 Always show "Add Customer" at the top
      { value: "add_new", label: "➕ Add Customer" },
      // 👇 Then show customer list below it
      ...customers.map((cust) => ({
        value: cust.id,
        label: cust.name,
        data: cust,
      })),
    ]}
    value={
      selectedCustomer?.id
        ? { value: selectedCustomer.id, label: selectedCustomer.name }
        : null
    }
    placeholder="Select customer..."
    onChange={(option) => {
      if (option.value === "add_new") {
        setShowAddCustomerForm(true);
      } else {
        setSelectedCustomer(option.data);
      }
    }}
    isSearchable
  />
</div>

{showAddCustomerForm && (
  <AddCustomerForm
    onClose={() => setShowAddCustomerForm(false)}
    onCustomerAdded={(newCust) => {
      // ✅ Add new customer at the end of the list
      setCustomers((prev) => [...prev, newCust]);
      // ✅ Auto-select the new customer
      setSelectedCustomer(newCust);
    }}
  />
)}



       

        {/* Part 2 */}
        <div className="header-part">
          <div className="header-row">
            <label>Payment Methods:</label>
            <select>
              <option>Cash Sale</option>
              <option>Credit Card</option>
              <option>Credit Customer</option>
            </select>
          </div>
        </div>

        {/* Part 3 */}
        <div className="header-part">
          <div className="header-row">
            <label>P/Balance:</label>
            <input type="number" defaultValue="0.00" />
          </div>
          <div className="header-row">
            <label>Remarks:</label>
            <input type="text" />
          </div>
        </div>

        {/* Date & Invoice */}
        <div className="header-part">
        <div className="header-row">
          <label>Date:</label>
          <span>{dateTime.toLocaleDateString()}</span>
        </div>
        <div className="header-row">
          <label>Time:</label>
          <span>{dateTime.toLocaleTimeString()}</span>
        </div>
        <div className="header-row">
          <label>Invoice No:</label>
          <input type="number" value={invoiceNo || ""} readOnly />
        </div>
      </div>
       </div>
      {barcodeError && <div className="barcode-error">{barcodeError}</div>}

      {/* Products table */}
      <div className="table-scroll">
        <div className="products-container">
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>#</th>
                  <th>Item Code / Barcode</th>
                  <th>Product Name</th>
                  <th>Sale Price</th>
                  <th>Quantity</th>
                  <th>Sale Tax %</th>
                  <th>Net Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.selected}
                        onChange={(e) => {
                          const updated = [...rows];
                          updated[index].selected = e.target.checked;
                          setRows(updated);
                        }}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={row.code}
                        onChange={(e) => handleChange(index, "code", e.target.value)}
                        onKeyDown={(e) => handleBarcodeEnter(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.price}
                        onChange={(e) => handleChange(index, "price", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.qty}
                        onChange={(e) => handleChange(index, "qty", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.tax}
                        onChange={(e) => handleChange(index, "tax", e.target.value)}
                      />
                    </td>
                    <td>
                      <input type="text" value={row.net} readOnly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="add-btn" onClick={addRow}>
            <FaPlus /> Add Row
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-card">
        <div className="summary-row">
          <span>Grand Total:</span>
          <span>{grandTotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax %:</span>
          <input
            type="number"
            value={taxPercent}
            onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="summary-row total-row">
          <span>Final Total:</span>
          <span>{finalTotal.toFixed(2)}</span>
        </div>

        {/* Pre-print modal */}
        {showPrePrint && (
          <div className="preprint-overlay">
            <div className="preprint-modal">
              <h3>Finalize Sale</h3>
              <div className="modal-row">
                <label>Discount Rs:</label>
                <input
                  type="number"
                  value={preDiscountRs}
                  onChange={(e) => setPreDiscountRs(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="modal-row">
                <label>Paid Amount:</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="modal-row">
                <label>Change:</label>
                <span>{changeAmount.toFixed(2)}</span>
              </div>
              <div className="modal-buttons">
                <button className="btn save" onClick={handleSubmit}>
                  <FaSave /> Save & Print
                </button>
                <button className="btn cancel" onClick={() => setShowPrePrint(false)}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="summary-actions">
          <button className="btn preprint" onClick={handlePrePrint}>
            <FaPrint /> Pre Print
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillingPOS;
