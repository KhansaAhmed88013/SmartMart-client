import React, { useState, useEffect, useContext } from "react";
import "./BillingPOS.css";
import { FaPrint, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import { ProfileContext } from "../../../../Context/ProfileContext";
import { UserContext } from "../../../../Context/UserContext";
import { AddInvoice, getLastInvoiceNo, GetProductByBarcode } from "../../../../UserService";

function BillingPOS() {
  const [rows, setRows] = useState([
    { selected: true, code: "", name: "", price: "", cost_price: "", qty: "", tax: "", net: "", discountRs: 0, itemdiscount: null, categorydiscount: null }
  ]);
  const [dateTime, setDateTime] = useState(new Date());
  const [paidAmount, setPaidAmount] = useState(0);
  const [showPrePrint, setShowPrePrint] = useState(false);
  const [barcodeError, setBarcodeError] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const { ProfileData } = useContext(ProfileContext);
  const {currentUser}=useContext(UserContext)

  // billDiscount may be present on product object — we will collect from product fetch and store at top-level
  const [billDiscountObj, setBillDiscountObj] = useState(null);

  // global tax percent after bill discount (user input)
  const [taxPercent, setTaxPercent] = useState(0);

  // 🔹 Fetch last invoice number
  const fetchInvoiceNo = async () => {
    try {
      const result = await getLastInvoiceNo();
      if (result && result.id) setInvoiceNo(result.id + 1);
      else setInvoiceNo(1);
    } catch (err) {
      setSubmitError(err.message);
      setTimeout(() => setSubmitError(""), 5000);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchInvoiceNo();
  }, []);

  const addRow = () => {
    setRows(prev => [...prev, { selected: true, code: "", name: "", price: "", cost_price: "", qty: "", tax: "", net: "", discountRs: 0, itemdiscount: null, categorydiscount: null }]);
  };

  // compute discount Rs per unit from itemdiscount/categorydiscount and price
  const computeDefaultDiscountPerUnit = (product) => {
    // product may have itemdiscount, categorydiscount
    const price = parseFloat(product.sale_price || product.price || 0);
    if (product.itemdiscount) {
      const it = product.itemdiscount;
      if (it.type === "Value" || it.type === "value") {
        return parseFloat(it.amount || 0);
      } else {
        // percent
        const percent = parseFloat(it.amount || 0);
        return (price * percent) / 100;
      }
    }
    if (product.categorydiscount) {
      const cat = product.categorydiscount;
      const percent = parseFloat(cat.percent || 0);
      return (price * percent) / 100;
    }
    return 0;
  };

  // update net for a row (index) based on price, qty, tax, discountRs (per unit)
  const recalcRowNet = (r) => {
    const price = parseFloat(r.price) || 0;
    const qty = parseFloat(r.qty) || 0;
    const tax = parseFloat(r.tax) || 0;
    const discountPerUnit = parseFloat(r.discountRs) || 0;

    const subtotal = price * qty;
    const totalDiscount = discountPerUnit * qty; // discount applied per unit
    const taxableBase = Math.max(0, subtotal - totalDiscount);
    const taxAmount = (taxableBase * tax) / 100;
    const net = taxableBase + taxAmount;
    return {
      ...r,
      net: net.toFixed(2),
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      taxAmount: taxAmount.toFixed(2)
    };
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    // if discountRs changed by user, accept it (but ensure numeric)
    if (field === "discountRs") {
      updated[index].discountRs = parseFloat(value) || 0;
    }
    // recalc net
    updated[index] = recalcRowNet(updated[index]);
    setRows(updated);

    // if user typed something in last row, add a new blank row
    if (index === rows.length - 1 && (field === "code" || field === "name" || field === "price" || field === "qty") && value !== "") {
      addRow();
    }
  };

  // handle barcode Enter -> fetch product and fill row, including discount logic
  const handleBarcodeEnter = async (index, e) => {
    if (e.key === "Enter") {
      const barcode = e.target.value.trim();
      if (!barcode) return;
      try {
        const product = await GetProductByBarcode(barcode);
        if (product) {
          const updated = [...rows];
          // fill basic fields
          updated[index].code = product.code || "";
          updated[index].name = product.name || "";
          updated[index].price = parseFloat(product.sale_price || 0).toFixed(2);
          updated[index].cost_price = product.cost_price || 0;
          updated[index].qty = updated[index].qty || 1; // default 1 if empty
          updated[index].tax = updated[index].tax || 0;

          // Save discount objects so we can use later if needed
          updated[index].itemdiscount = product.itemdiscount || null;
          updated[index].categorydiscount = product.categorydiscount || null;

          // compute default discount per unit according to priority (item > category)
          const defaultDiscPerUnit = computeDefaultDiscountPerUnit(product);
          updated[index].discountRs = parseFloat(defaultDiscPerUnit || 0).toFixed(2);

          // If API returned a billDiscount (global), store it in top-level state (we will evaluate it on totals)
          if (product.billDiscount) {
            setBillDiscountObj(product.billDiscount);
          }

          // recalc net
          updated[index] = recalcRowNet(updated[index]);

          setRows(updated);
          setBarcodeError("");
          if (index === rows.length - 1) addRow();
        } else {
          setBarcodeError("❌ Product not found");
          setTimeout(() => setBarcodeError(""), 3000);
        }
      } catch (err) {
        setBarcodeError("❌ Product not found");
        setTimeout(() => setBarcodeError(""), 3000);
      }
    }
  };

  // Filter rows that have data
  const filledRows = rows.filter(row => row.selected && (row.name || row.code || parseFloat(row.qty) > 0));

  // Grand totals before bill discount/global tax:
  // We'll sum per-row taxable base + item tax (i.e., each row.net)
  const grandSubtotalIncludingItemTax = filledRows.reduce((sum, row) => sum + (parseFloat(row.net) || 0), 0);

  // Sum of item-level discounts
  const totalItemDiscount = filledRows.reduce((sum, row) => sum + (parseFloat(row.totalDiscount) || 0), 0);

  // Sum of item-level tax (for info)
  const itemTaxTotal = filledRows.reduce((sum, row) => sum + (parseFloat(row.taxAmount) || 0), 0);

  // ===== Apply Bill Discount (if any) =====
  const computeBillDiscountValue = (baseAmount) => {
    if (!billDiscountObj) return 0;
    // check date and status? Assuming API already ensures active; still we can check status
    const bd = billDiscountObj;
    const amountCond = parseFloat(bd.amount || 0); // threshold
    const condType = bd.conditionType; // EqualOrAbove, Above, Below
    const meetsCondition = (() => {
      if (condType === "EqualOrAbove") return baseAmount >= amountCond;
      if (condType === "Above") return baseAmount > amountCond;
      if (condType === "Below") return baseAmount < amountCond;
      return false;
    })();
    if (!meetsCondition) return 0;

    if (bd.type === "Flat") {
      return parseFloat(bd.value || 0);
    } else {
      // Percentage
      return (baseAmount * parseFloat(bd.value || 0)) / 100;
    }
  };

  const billDiscountValue = computeBillDiscountValue(grandSubtotalIncludingItemTax);

  // Global tax (applied after bill discount)
  const taxableAfterBillDiscount = Math.max(0, grandSubtotalIncludingItemTax - billDiscountValue);
  const globalTaxAmount = (taxableAfterBillDiscount * (parseFloat(taxPercent) || 0)) / 100;

  const finalTotal = taxableAfterBillDiscount + globalTaxAmount;

  const changeAmount = (parseFloat(paidAmount) || 0) - finalTotal;

  const handlePrePrint = () => {
    setPaidAmount(finalTotal.toFixed(2));
    setShowPrePrint(true);
  };

  const handlePrintClick = () => {
    setShowPrePrint(false);
    handlePrint();
  };

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
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            td, th { padding: 2px 0; }
            .footer { text-align: center; margin-top: 5px; font-size: 10px; }
            .summary {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.summary-left {
  width: 37%;
  text-align: left;
}

.summary-right {
  width: 62%;
  text-align: left;
}

          .left { text-align: left; }
          .right { text-align: right; }

          </style>
        </head>
        <body>
          <h2>${ProfileData?.shopName || ""}</h2>
          <div class="center"><strong>Phone:</strong> ${ProfileData?.number1 || ""}</div>
          <div class="center"><strong>${ProfileData?.location || ""}</strong></div>
          
          <div class="divider"></div>
          <div class="row"><div><strong>Invoice no: ${invoiceNo || ""}</strong></div><div><strong>Type:</strong> Sale</div></div>
          <div class="row"><div><strong>Date:</strong> ${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}</div></div>
          <div className="row"><strong>Cashier:</strong> ${currentUser.username || ""}</div>
          <div class="divider"></div>
          <table>
            <thead>
              <tr><th>#</th><th>Item</th><th class="right">Price</th><th class="right">Qty</th><th class="right">Disc</th><th class="right">Tax</th><th class="right">Net</th></tr>
            </thead>
            <tbody>
              ${filledRows.map((row, idx) => `
                <tr>
                  <td>${idx+1}</td>
                  <td>${row.name}</td>
                  <td style="text-align:right">${parseFloat(row.price||0).toFixed(2)}</td>
                  <td style="text-align:right">${row.qty}</td>
                  <td style="text-align:right">${parseFloat(row.totalDiscount||0).toFixed(2)}</td>
                  <td style="text-align:right">${parseFloat(row.taxAmount||0).toFixed(2)}</td>
                  <td style="text-align:right">${parseFloat(row.net||0).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="divider"></div>
          <div class="summary">
  <div class="summary-left">
    <div><strong>Total Items: ${filledRows.length}</strong></div>
    <div><strong>Discount: ${billDiscountValue}</strong></div>
    <div><strong>Tax: ${(itemTaxTotal+globalTaxAmount).toFixed(2)}</strong></div>
  </div>
  <div class="summary-right">
    <div><strong>Sub Total: ${grandSubtotalIncludingItemTax.toFixed(2)}</strong></div>
    <div><strong>Final Total: ${finalTotal.toFixed(2)}</strong></div>
    <div><strong>Paid: ${paidAmount}</strong></div>
    <div><strong>Change: ${changeAmount.toFixed(2)}</strong></div>
  </div>
</div>
          <div class="divider"></div>
          <div class="footer"><p>${ProfileData?.description || ""}</p><p>Thank you for shopping!</p></div>
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

  // Submission
  const handleSubmit = async () => {
    const validItems = filledRows.filter(
      (row) =>
        (row.code || "").toString().trim() !== "" &&
        (row.name || "").toString().trim() !== "" &&
        parseFloat(row.price) > 0 &&
        parseFloat(row.qty) > 0
    );

    if (validItems.length === 0) {
      setSubmitError("❌ Cannot submit empty invoice. Please add at least one product with Code, Name, Price, and Quantity.");
      setTimeout(() => setSubmitError(""), 5000);
      return;
    }

    try {
      // Build items payload with applied discount per item (per unit discount)
      const itemsPayload = validItems.map(row => ({
        product_code: row.code,
        price: parseFloat(row.price) || 0,
        cost_price: parseFloat(row.cost_price) || 0,
        quantity: parseFloat(row.qty) || 0,
        return_qty: 0,
        tax_percent: parseFloat(row.tax) || 0,
        discount_per_unit: parseFloat(row.discountRs) || 0,
        total_discount: parseFloat(row.totalDiscount) || 0,
        net_total: parseFloat(row.net) || 0
      }));

      await AddInvoice({
        invoice: {
          account_id: "Cash",
          cashier_name: currentUser.username || "",
          payment_method: "Cash Sale",
          remarks: "POS Billing",
          discount: billDiscountValue.toFixed(2),
          tax_percent: taxPercent,
          final_total: finalTotal,
          paid_amount: paidAmount,
          customer_id: 1,
          is_return: false,
        },
        items: itemsPayload,
      });

      setSubmitError("");
      handlePrintClick();
      setRows([{ selected: true, code: "", name: "", price: "", cost_price: "", qty: "", tax: "", net: "", discountRs: 0, itemdiscount: null, categorydiscount: null }]);
      setPaidAmount(0);
      setBillDiscountObj(null);
      fetchInvoiceNo();
    } catch (err) {
      setSubmitError("❌ " + err.message);
      setTimeout(() => setSubmitError(""), 5000);
    }
  };

  // keep paid amount synced when totals change and preprint is open
  useEffect(() => {
    setPaidAmount(finalTotal.toFixed(2));
  }, [finalTotal, showPrePrint]);

  return (
    <div className="billing-container">
      {submitError && <div className="submit-error">{submitError}</div>}

      <div className="billing-header">
        <div className="header-part">
          <div className="header-row"><label>Acc ID:</label><input type="text" defaultValue="Cash" /></div>
          <div className="header-row"><label>Return Quantity:</label><input type="checkbox" /></div>
          <div className="header-row"><label>Name:</label><input type="text" defaultValue="Cash" /></div>
        </div>

        <div className="header-part">
          <div className="header-row">
            <label>Payment Methods:</label>
            <select><option>Cash Sale</option><option>Credit Card</option><option>Credit Customer</option></select>
          </div>
        </div>

        <div className="header-part">
          <div className="header-row"><label>P/Balance:</label><input type="number" defaultValue="0.00" /></div>
          <div className="header-row"><label>Remarks:</label><input type="text" /></div>
        </div>

        <div className="header-part">
          <div className="header-row"><label>Date:</label><span>{dateTime.toLocaleDateString()}</span></div>
          <div className="header-row"><label>Time:</label><span>{dateTime.toLocaleTimeString()}</span></div>
          <div className="header-row"><label>Invoice No:</label><input type="number" value={invoiceNo || ""} readOnly /></div>
        </div>
      </div>

      {barcodeError && <div className="barcode-error">{barcodeError}</div>}

      <div className="table-scroll">
        <div className="products-container">
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Select</th><th>#</th><th>Item Code / Barcode</th><th>Product Name</th>
                  <th>Sale Price</th><th>Quantity</th><th>Sale Tax %</th>
                  <th>Discount (Rs)</th><th>Net Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td><input type="checkbox" checked={row.selected} onChange={(e) => { const u = [...rows]; u[index].selected = e.target.checked; setRows(u); }} /></td>
                    <td>{index + 1}</td>
                    <td data-label="Item Code / Barcode">
                      <input type="text" value={row.code} onChange={(e) => handleChange(index, "code", e.target.value)} onKeyDown={(e) => handleBarcodeEnter(index, e)} />
                    </td>
                    <td data-label="Product Name">
                      <input type="text" value={row.name} onChange={(e) => handleChange(index, "name", e.target.value)} />
                    </td>
                    <td data-label="Sale Price">
                      <input type="number" value={row.price} onChange={(e) => handleChange(index, "price", e.target.value)} />
                    </td>
                    <td data-label="Quantity">
                      <input type="number" value={row.qty} onChange={(e) => handleChange(index, "qty", e.target.value)} />
                    </td>
                    <td data-label="Sale Tax %">
                      <input type="number" value={row.tax} onChange={(e) => handleChange(index, "tax", e.target.value)} />
                    </td>
                    <td data-label="Discount (Rs)">
                      {/* show computed discount but allow override */}
                      <input type="number" value={parseFloat(row.discountRs || 0)} onChange={(e) => handleChange(index, "discountRs", e.target.value)} />
                    </td>
                    <td data-label="Net Total">
                      <input type="text" value={row.net || "0.00"} readOnly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="add-btn" onClick={addRow}><FaPlus /> Add Row</button>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-card">
        <div class="row ">
          <div className="summary-row"><span>Items Total (incl. item tax):</span><input type="text" readOnly value={grandSubtotalIncludingItemTax.toFixed(2)} /></div>
        <div className="summary-row"><span>Total Item Discount:</span><input type="text" readOnly value={totalItemDiscount.toFixed(2)} /></div>
        </div>
        <div class="row ">
          <div className="summary-row">
          <div><span>Global Tax % (applied after bill discount): </span>
            <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div className="summary-row"><span>Bill Discount:</span><input type="text" readOnly value={billDiscountValue.toFixed(2)} /></div>
        </div>
        <div className="summary-row total-row"><span>Final Total:</span><span>{finalTotal.toFixed(2)}</span></div>

        {showPrePrint && (
          <div className="preprint-overlay">
            <div className="preprint-modal">
              <h3>Finalize Sale</h3>
              <div><label>Items Total:</label><span>{grandSubtotalIncludingItemTax.toFixed(2)}</span></div>
              <div><label>Bill Discount:</label><span>{billDiscountValue.toFixed(2)}</span></div>
              <div><label>Global Tax:</label><span>{globalTaxAmount.toFixed(2)}</span></div>
              <div><label>Final Total:</label><span>{finalTotal.toFixed(2)}</span></div>
              <div>
                <label>Paid Amount:</label>
                <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)} />
              </div>
              <div><label>Change:</label><span>{changeAmount.toFixed(2)}</span></div>
              <div className="preprint-actions">
                <button className="print-btn" onClick={handleSubmit}>Print</button>
                <button className="cancel-btn" onClick={() => setShowPrePrint(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button className="action-btn print-btn" onClick={() => handlePrePrint()}><FaPrint /> Print</button>
          <button className="action-btn save-btn" onClick={() => alert("Saved!")}><FaSave /> Save</button>
          <button className="action-btn exit-btn" onClick={() => alert("Exit clicked")}><FaTimes /> Exit</button>
        </div>
      </div>
    </div>
  );
}

export default BillingPOS;
