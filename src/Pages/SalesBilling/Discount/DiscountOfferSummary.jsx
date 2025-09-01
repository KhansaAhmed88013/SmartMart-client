import React, { useState, useEffect, useRef } from "react"; 
import { FaPrint, FaPlus } from "react-icons/fa";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";
import { AddDiscount, GetProductNameCode, GetDiscount } from "../../../UserService";

const DiscountOfferSummary = () => {
  const [data, setData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    item: "",
    type: "Discount",
    description: "",
    startDate: "",
    endDate: "",
    amount: "",
    status: "Active",
    productCode: ""
  });

  // Ref for printing
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discounts = await GetDiscount();
        const formatted = discounts.map((d) => ({
          id: d.id,
          item: d.product?.name || "N/A",
          type: d.type,
          description: d.description,
          startDate: d.startDate,
          endDate: d.endDate,
          amount: parseFloat(d.amount),
          status: d.status,
          product: d.product,
        }));
        setData(formatted);
      } catch (err) {
        console.error("Error fetching discounts:", err);
      }
    };
    fetchDiscounts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await GetProductNameCode();
        const formatted = products.map((p) => ({
          value: p.code,
          label: p.name
        }));
        setProductOptions(formatted);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredData = data.filter((d) => {
    if (!startDate || !endDate) return true;
    return d.startDate >= startDate && d.endDate <= endDate;
  });

  const totalAmount = filteredData.reduce((sum, d) => sum + d.amount, 0);

  const handleChange = (e) => {
    setNewDiscount({ ...newDiscount, [e.target.name]: e.target.value });
  };

  const handleProductSelect = (selected) => {
    setSelectedProduct(selected);
    setNewDiscount({
      ...newDiscount,
      item: selected.label,
      productCode: selected.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEntry = {
      ...newDiscount,
      amount: parseFloat(newDiscount.amount),
    };

    try {
      await AddDiscount(newEntry);
      setData([...data, { id: data.length + 1, ...newEntry }]);
      setMessage("Data submitted successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(null), 3000);

      setNewDiscount({
        item: "",
        type: "Discount",
        description: "",
        startDate: "",
        endDate: "",
        amount: "",
        status: "Active",
        productCode: ""
      });
      setSelectedProduct(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving discount:", err);
      setMessage("Error submitting data. Please try again.");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {message && (
        <div
          style={{
            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
            color: messageType === "success" ? "#155724" : "#721c24",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          {message}
        </div>
      )}

      {/* ✅ Everything inside here will be printable */}
      <div ref={componentRef}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>Smart Super Mart</h2>
          <p>Behria Enclusive Road Chak Shehzad Islamabad</p>
          <h2>Discounts & Offers</h2>
        </div>

        {/* Date Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <label>From: </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label>To: </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Total Summary */}
        <div
          style={{
            margin: "15px 0",
            fontWeight: "bold",
            textAlign: "right",
            fontSize: "16px",
          }}
        >
          Total Discounts & Offers Amount: Rs. {totalAmount}
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
              <th>#</th>
              <th>Item</th>
              <th>Type</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Amount (PKR)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((d) => (
                <tr key={d.id} style={{ cursor: "pointer" }} onClick={() => setSelectedDiscount(d)}>
                  <td>{d.id}</td>
                  <td>{d.item}</td>
                  <td>{d.type}</td>
                  <td>{d.description}</td>
                  <td>{d.startDate}</td>
                  <td>{d.endDate}</td>
                  <td>{d.amount}</td>
                  <td
                    style={{
                      color: d.status === "Active" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {d.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", color: "red" }}>
                  No records found for selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Modal also inside printable section */}
        {selectedDiscount && (
          <div
            style={{
              marginTop: "30px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              background: "#fff",
            }}
          >
            <h3
              style={{
                fontSize: "22px",
                marginBottom: "15px",
                borderBottom: "2px solid #28a745",
                paddingBottom: "6px",
                color: "#28a745",
              }}
            >
              Discount / Offer Details
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "6px", borderBottom: "1px solid #ddd" }}>ID</td>
                  <td style={{ padding: "6px", borderBottom: "1px solid #ddd" }}>{selectedDiscount.id}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "6px", borderBottom: "1px solid #ddd" }}>Type</td>
                  <td style={{ padding: "6px", borderBottom: "1px solid #ddd" }}>{selectedDiscount.type}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "6px", borderBottom: "1px solid #ddd" }}>Description</td>
                  <td style={{ padding: "6px", borderBottom: "1px solid #ddd" }}>{selectedDiscount.description}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "6px", borderBottom: "1px solid #ddd" }}>Start Date</td>
                  <td style={{ padding: "6px", borderBottom: "1px solid #ddd" }}>{selectedDiscount.startDate}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "6px", borderBottom: "1px solid #ddd" }}>End Date</td>
                  <td style={{ padding: "6px", borderBottom: "1px solid #ddd" }}>{selectedDiscount.endDate}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "6px", borderBottom: "1px solid #ddd" }}>Amount</td>
                  <td style={{ padding: "6px", borderBottom: "1px solid #ddd" }}>{selectedDiscount.amount}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "6px" }}>Status</td>
                  <td style={{ padding: "6px", color: selectedDiscount.status === "Active" ? "green" : "red", fontWeight: "bold" }}>
                    {selectedDiscount.status}
                  </td>
                </tr>
              </tbody>
            </table>

            {selectedDiscount.product && (
              <>
                <h4
                  style={{
                    fontSize: "18px",
                    marginTop: "15px",
                    marginBottom: "10px",
                    color: "#007bff",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "4px",
                  }}
                >
                  Product Info
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "6px", borderBottom: "1px solid #ddd" }}>Code</td>
                      <td style={{ padding: "6px", borderBottom: "1px solid #ddd" }}>{selectedDiscount.product.code}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "6px", borderBottom: "1px solid #ddd" }}>Name</td>
                      <td style={{ padding: "6px", borderBottom: "1px solid #ddd" }}>{selectedDiscount.product.name}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "6px", borderBottom: "1px solid #ddd" }}>Sale Price</td>
                      <td style={{ padding: "6px", borderBottom: "1px solid #ddd" }}>{selectedDiscount.product.sale_price}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", padding: "6px" }}>Quantity</td>
                      <td style={{ padding: "6px" }}>{selectedDiscount.product.qty}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>

      {/* Print Button */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
          onClick={handlePrint}
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

export default DiscountOfferSummary;
