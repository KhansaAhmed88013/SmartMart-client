import React, { useState, useEffect } from "react";
import "./BillingPOS.css";
import { FaPrint, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import { AddInvoice,getLastInvoiceNo,getProfile,GetProductByBarcode } from "../../../../UserService";

function BillingPOS() {
  const [rows, setRows] = useState([
  { selected: true, code: "", name: "", price: "", qty: "", tax: "", net: "" }
]);
const [dateTime, setDateTime] = useState(new Date());
   const [preDiscountRs, setPreDiscountRs] = useState(0); // Rs discount
  const [paidAmount, setPaidAmount] = useState(0);
  const [showPrePrint, setShowPrePrint] = useState(false);
  const [barcodeError, setBarcodeError] = useState(""); // new
  const [invoiceNo,setInvoiceNo]=useState(null)
  const [profileData,setProfileData]=useState({shopName: '', number1:'', number2: '', location: '', description: ''})

 // 🔹 Function to fetch last invoice and set next one
const fetchInvoiceNo = async () => {
  try {
    const result = await getLastInvoiceNo();
    if (result && result.id) {
      setInvoiceNo(result.id + 1);  // always show NEXT invoice no
    } else {
      setInvoiceNo(1); // if no invoice exists, start with 1
    }
  } catch (err) {
    console.log(err.message);
  }
};

// Run once on mount
useEffect(() => {
  fetchInvoiceNo();
  const profile=async()=>{
    try{
      const result=await getProfile()
      if(result){
        setProfileData(result)
      }
    }catch(err){
      console.log(err.message)
    }
  }
  profile()
}, []);
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  // Add this useEffect below your existing state hooks


  const addRow = () => {
  setRows([...rows, { selected: true, code: "", name: "", price: "", qty: "", tax: "", net: "" }]);
};

const [taxPercent, setTaxPercent] = useState(0);

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

// Filter rows that have data
// Only include rows that are selected and have some data
const filledRows = rows.filter(
  row => row.selected && (row.name || row.code || parseFloat(row.qty) > 0)
);

// Grand total including item-wise tax
const grandTotal = filledRows.reduce((sum, row) => sum + (parseFloat(row.net) || 0), 0);
const showTaxColumn = filledRows.some(row => parseFloat(row.tax) > 0);


// Item-wise tax total (for display)
const itemTaxTotal = filledRows.reduce((sum, row) => {
  const price = parseFloat(row.price) || 0;
  const qty = parseFloat(row.qty) || 0;
  const tax = parseFloat(row.tax) || 0;
  return sum + (price * qty * tax) / 100;
}, 0);

// Discount
const discount = parseFloat(preDiscountRs) || 0;

// Tax on grand total after discount (global taxPercent)
const globalTaxAmount = ((grandTotal) * (parseFloat(taxPercent) || 0)) / 100;

// Final total = subtotal after discount + global tax
const finalTotal = (grandTotal - discount + globalTaxAmount);

  const changeAmount = (parseFloat(paidAmount) || 0) - finalTotal;

const handlePrePrint = () => {
  setPreDiscountRs(0);
  setPaidAmount(finalTotal.toFixed(2)); // default when opening
  setShowPrePrint(true);
};
const handlePrintClick = () => {
    setShowPrePrint(false);
    handlePrint(); // call your existing handlePrint function
  };
const handlePrint = () => {
  let receiptContent = `
    <html>
      <head>
        <title>Receipt</title>
        <style>
          @page {
            size: 80mm auto; /* or 58mm depending on your printer */
            margin: 0;
          }
          body { 
            font-family: monospace; 
            font-size: 12px; 
            width: 80mm; 
            margin: 0 auto; 
            padding: 10px 0px;
          }
          h2 { text-align: center; font-size: 18px; margin: 5px 0; }
          .center { text-align: center; }
          .divider { border-top: 1px dashed #000; margin: 5px 0; }
          
          /* row alignment */
          .row {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
          }
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

          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          td, th { padding: 2px 0; }
          .footer { text-align: center; margin-top: 5px; font-size: 10px; }
          .footer p{ padding: 0;}
        </style>
      </head>
      <body>
        <h2>${profileData.shopName}</h2>
        <div class="center"><strong>Phone:</strong> ${profileData.number1}, ${profileData.number2}</div>
        <div class="center"><strong>${profileData.location}</strong></div>
        
        <div class="divider"></div>
        <div class="row">
          <div><strong>Invoice no: 12345</strong></div>
          <div><strong>Type:</strong> Sale</div>
        </div>
        <div class="row">
          <div><strong>Date:</strong> ${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}</div>
        </div>
        <div class="row">
          <div><strong>Cashier:</strong> Administrator</div>
        </div>
        <div class="row">
          <div><strong>Cust/P:</strong> Cash</div>
        </div>

        <div class="divider"></div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th class="right">Price</th>
              <th class="right">Qty</th>
              ${showTaxColumn ? '<th class="right">Tax %</th>' : ""}
              <th class="right">Net</th>
            </tr>
          </thead>
          <tbody>
            ${filledRows.map((row, idx) => {
              return `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${row.name}</td>
                  <td class="right">${row.price}</td>
                  <td class="right">${row.qty}</td>
                  ${showTaxColumn ? `<td class="right">${parseFloat(row.tax) > 0 ? row.tax + "%" : ""}</td>` : ""}
                  <td class="right">${row.net}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
        <div class="divider"></div>
<div class="summary">
  <div class="summary-left">
    <div><strong>Total Items: ${filledRows.length}</strong></div>
    <div><strong>Discount: ${preDiscountRs}</strong></div>
    <div><strong>Tax: ${(itemTaxTotal+globalTaxAmount).toFixed(2)}</strong></div>
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

        if (index === rows.length - 1) {
          addRow();
        }
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

const handleSubmit=async()=>{
    try{
      await AddInvoice({
      invoice: {
        account_id: "Cash",
        cashier_name: "Administrator",
        payment_method: "Cash Sale", // can be dynamic
        remarks: "POS Billing",
        discount: preDiscountRs,
        tax_percent: taxPercent,
        final_total: finalTotal,
        paid_amount: paidAmount,
        customer_id:1,
        is_return: false
      },
      items: filledRows.map(row => ({
        product_code: row.code,   // if code maps to product_id
        price: parseFloat(row.price) || 0,
        quantity: parseFloat(row.qty) || 0,
        return_qty: 0,
        tax_percent: parseFloat(row.tax) || 0
      }))
    })
    handlePrintClick()
     setRows([{ selected: true, code: "", name: "", price: "", qty: "", tax: "", net: "" }]);
    setPreDiscountRs(0);
    setPaidAmount(0);
    fetchInvoiceNo();
    }catch(err){
  alert(err.message)
    }

}
useEffect(() => {
  setPaidAmount(finalTotal.toFixed(2));
}, [finalTotal, showPrePrint]);
  return (
    <div className="billing-container">

      {/* Header */}
<div className="billing-header">

  {/* Part 1 */}
  <div className="header-part">
    <div className="header-row">
      <label>Acc ID:</label>
      <input type="text" defaultValue="Cash" />
    </div>
    <div className="header-row">
      <label>Return Quantity:</label>
      <input type="checkbox" />
    </div>
    <div className="header-row">
      <label>Name:</label>
      <input type="text" defaultValue="Cash" />
    </div>
  </div>

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

  {/* Part 4 */}
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
{barcodeError && (
  <div className="barcode-error">
    {barcodeError}
  </div>
)}

      {/* Table */}
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
      <td >
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
      <td >{index + 1}</td>
      <td data-label="Item Code / Barcode">
        <input
  type="text"
  value={row.code}
  onChange={(e) => handleChange(index, "code", e.target.value)}
  onKeyDown={(e) => handleBarcodeEnter(index, e)}
/>
      </td>
      <td data-label="Product Name">
        <input
          type="text"
          value={row.name}
          onChange={(e) => handleChange(index, "name", e.target.value)}
        />
      </td>
      <td data-label="Sale Price">
        <input
          type="number"
          value={row.price}
          onChange={(e) => handleChange(index, "price", e.target.value)}
        />
      </td>
      <td data-label="Quantity">
        <input
          type="number"
          value={row.qty}
          onChange={(e) => handleChange(index, "qty", e.target.value)}
        />
      </td>
      <td data-label="Sale Tax %">
        <input
          type="number"
          value={row.tax}
          onChange={(e) => handleChange(index, "tax", e.target.value)}
        />
      </td>
      <td data-label="Net Total">
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
          
      {/* Pre-print overlay */}
      {showPrePrint && (
        <div className="preprint-overlay">
          <div className="preprint-modal">
            <h3>Finalize Sale</h3>
            <div>
              <label>Grand Total: </label>
              <span>{grandTotal.toFixed(2)}</span>
            </div>
            <div>
              <label>Discount (Rs): </label>
              <input
  type="number"
  value={preDiscountRs}
  onChange={(e) => setPreDiscountRs(parseFloat(e.target.value) || 0)}
/>
            </div>
            <div>
              <label>Final Total: </label>
              <span>{finalTotal.toFixed(2)}</span>
            </div>
            <div>
              <label>Paid Amount: </label>
              <input
  type="number"
  value={paidAmount}
  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
/>

            </div>
            <div>
              <label>Change: </label>
              <span>{changeAmount.toFixed(2)}</span>
            </div>
            <div className="preprint-actions">
              <button className="print-btn" onClick={handleSubmit}>Print</button>
              <button className="cancel-btn" onClick={() => setShowPrePrint(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
        <div className="action-buttons">
          <button className="action-btn print-btn" onClick={() => handlePrePrint()}>
            <FaPrint /> Print
          </button>
          <button className="action-btn save-btn" onClick={() => alert("Saved!")}>
            <FaSave /> Save
          </button>
          <button className="action-btn exit-btn" onClick={() => alert("Exit clicked")}>
            <FaTimes /> Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillingPOS;
