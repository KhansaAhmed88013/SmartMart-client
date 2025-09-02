import React, { useState, useEffect, useRef } from "react"; 
import { FaPrint, FaPlus ,FaEdit} from "react-icons/fa";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";
import './DiscountOfferSummary.css'
import { AddDiscount, GetProductNameCode, GetDiscount ,getProfile,UpdateDiscountStatus,UpdateDiscount} from "../../../UserService";

const DiscountOfferSummary = () => {
  const [data, setData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDiscount, setEditDiscount] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [profiledata, setProfileData] = useState({
    shopName: "",
    number1: "",
    number2: "",
    location: "",
    });

    const [loading, setLoading] = useState(true);
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
  contentRef: componentRef,   // ✅ v3 syntax
  documentTitle: "Discount Offer Summary",
});

useEffect(() => {
  async function fetchData() {
    try {
      const profile = await getProfile();  // res.data is already the object
      
      if (profile) {
        setProfileData({
          shopName: profile.shopName || "",
          number1: profile.number1 || "",
          number2: profile.number2 || "",
          location: profile.location || "",
          });
      }
    } catch (err) {
      console.log("No existing data or error:", err);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
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

  useEffect(() => {
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
  
  const handleEditClick = (discount) => {
    setEditDiscount(discount);
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setEditDiscount(null);
  };

  const handleModalSave = async () => {
    if (!editDiscount) return;

    try {
      await UpdateDiscount(editDiscount);
      handleModalClose();
      fetchDiscounts();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };


const handleStatusChange = async (id, newStatus) => {
  try {
    await UpdateDiscountStatus({ id, newStatus });
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    setMessage("Status updated successfully!");
    setMessageType("success");
    setTimeout(() => setMessage(null), 3000);
  } catch (err) {
    console.error("Error updating status:", err);
    setMessage("Failed to update status");
    setMessageType("error");
    setTimeout(() => setMessage(null), 3000);
  }
};

  const filteredData = data.filter((d) => {
    if (!startDate || !endDate) return true;
   return (
  (!startDate || d.endDate >= startDate) &&
  (!endDate || d.startDate <= endDate)
);

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
      setMessage(err.message);
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
    }
  };
  if (loading) return <div>Loading...</div>;
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0px" }}>
      
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
      <div ref={componentRef} className="print-area">
        {/* Header */}
        <div className="discount-header" style={{ textAlign: "center", padding: "5px" }}>
          <h2>{profiledata.shopName}</h2>
          <span>
  <p style={{ margin: 0,fontSize:'12px' }}>{profiledata.location}</p>
  <p style={{ margin: 0,fontSize:'12px'  }}>{profiledata.number1}</p>
  <p style={{ margin: 0,fontSize:'12px'  }}>{profiledata.number2}</p>
</span>

         <h2   style={{fontSize: "18px",}}>Discounts & Offers</h2>
        </div>
{/* Add Discount Button */}
<div style={{ margin: "20px 0", textAlign: "right" }}>
  <button className="add-discount-btn"
    onClick={() => setShowForm(!showForm)}
    style={{
      padding: "8px 12px",
      background: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    <FaPlus /> Add Discount
  </button>
</div>

      {/* ---------- Overlay Modal ---------- */}
      {showEditModal && editDiscount && (
        <div className="overlay">
          <div className="modal">
            <h3>Edit Discount</h3>

            <label>Product</label>
<Select
  options={productOptions}
  value={{
    value: editDiscount.productCode,
    label: editDiscount.item || editDiscount.productCode,
  }}
  onChange={(e) =>
    setEditDiscount({ ...editDiscount, productCode: e.value, item: e.label })
  }
/>

<label>Status</label>
<select
  value={editDiscount.status}
  onChange={(e) =>
    setEditDiscount({ ...editDiscount, status: e.target.value })
  }
>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
</select>

            <label>Type</label>
            <input
              type="text"
              value={editDiscount.type}
              onChange={(e) =>
                setEditDiscount({ ...editDiscount, type: e.target.value })
              }
            />

            <label>Description</label>
            <input
              type="text"
              value={editDiscount.description}
              onChange={(e) =>
                setEditDiscount({
                  ...editDiscount,
                  description: e.target.value,
                })
              }
            />

            <label>Start Date</label>
            <input
              type="date"
              value={editDiscount.startDate}
              onChange={(e) =>
                setEditDiscount({
                  ...editDiscount,
                  startDate: e.target.value,
                })
              }
            />

            <label>End Date</label>
            <input
              type="date"
              value={editDiscount.endDate}
              onChange={(e) =>
                setEditDiscount({
                  ...editDiscount,
                  endDate: e.target.value,
                })
              }
            />

            <label>Amount</label>
            <input
              type="number"
              value={editDiscount.amount}
              onChange={(e) =>
                setEditDiscount({ ...editDiscount, amount: e.target.value })
              }
            />

            <label>Status</label>
            <select
              value={editDiscount.status}
              onChange={(e) =>
                setEditDiscount({ ...editDiscount, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleModalSave}>
                Save
              </button>
              <button className="cancel-btn" onClick={handleModalClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Date Filters */}
        <div
        className="discountPage-div"
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
  className="table"
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
      <th>Effective Status</th>
      <th>Actions</th> {/* ✅ new column */}
    </tr>
  </thead>
  <tbody>
    {filteredData.length > 0 ? (
      filteredData.map((d) => {
        const today = new Date().toISOString().split("T")[0]; 
        let validity = "";
        if (today < d.startDate) validity = "Upcoming";
        else if (today > d.endDate) validity = "Expired";
        else validity = "Ongoing";

        let effectiveStatus = "";
        let color = "";
        if (d.status === "Active") {
          effectiveStatus =
            validity === "Ongoing"
              ? "Active & Ongoing"
              : validity === "Upcoming"
              ? "Active but Upcoming"
              : "Active but Expired";
          color = validity === "Ongoing" ? "green" : validity === "Upcoming" ? "blue" : "red";
        } else {
          effectiveStatus = `Inactive (${validity})`;
          color = "gray";
        }

        return (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td>{d.item}</td>
            <td>{d.type}</td>
            <td>{d.description}</td>
            <td>{d.startDate}</td>
            <td>{d.endDate}</td>
            <td>{d.amount}</td>
            <td style={{ color, fontWeight: "bold" }}>{effectiveStatus}</td>
            <td>
  <button
    onClick={() => setSelectedDiscount(d)} // <-- Set the selected discount
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#007bff",
      fontSize: "12px"
    }}
    title="View Details"
  >
    View
  </button>
  <button
    onClick={() => handleEditClick(d)}
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#007bff",
      fontSize: "12px"
    }}
    title="Edit Discount"
  >
    <FaEdit />
  </button>
</td>

          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="9" style={{ textAlign: "center", color: "red" }}>
          No records found for selected date range.
        </td>
      </tr>
    )}
  </tbody>
</table>

        {/* ✅ Modal also inside printable section */}
        {/* ✅ Overlay for selected discount details */}
{selectedDiscount && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10000,
    }}
    onClick={() => setSelectedDiscount(null)} // close when clicking outside
  >
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        width: "500px",
        maxHeight: "80vh",
        overflowY: "auto",
        position: "relative",
      }}
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      <div
        type="button"
        onClick={() => setSelectedDiscount(null)}
        style={{
          cursor: "pointer",
        }}
      >
        ❌
      </div>

      <h3
        style={{
          fontSize: "20px",
          marginBottom: "15px",
          borderBottom: "2px solid #28a745",
          paddingBottom: "6px",
          color: "#28a745",
          textAlign: "center",
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
            <td>
  <select
  value={selectedDiscount.status}
  onChange={(e) => handleStatusChange(selectedDiscount.id, e.target.value)}
  style={{
    padding: "4px",
    borderRadius: "4px",
    fontWeight: "bold",
    color: selectedDiscount.status === "Active" ? "green" : "red",
  }}
>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
</select>
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
  </div>
)}

      </div>

      {/* Print Button */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
        className="print-btn"
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
