import React, { useState, useEffect, useRef } from "react";
import { FaPrint, FaPlus, FaEdit, FaTrash, FaList } from "react-icons/fa";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";
import "./ItemsDiscount.css";
import {
  AddDiscount,
  GetProductNameCode,
  GetDiscount,
  getProfile,
  DelDiscount,
  UpdateDiscount,
} from "../../../../../UserService";

function ItemsDiscount() {
  const [data, setData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
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
    items: [],
    productCodes: [],
    type: "Percent", // default to percent
    description: "",
    startDate: "",
    endDate: "",
    amount: "",
    status: "Active",
  });

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Discount Offer Summary",
  });

  // Load profile
  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getProfile();
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

  // Load discounts
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

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await GetProductNameCode();
        const formatted = products.map((p) => ({
          value: p.code,
          label: p.name,
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

    // ✅ Validation
    if (
      editDiscount.type === "Percent" &&
      (editDiscount.amount <= 0 || editDiscount.amount > 100)
    ) {
      setMessage("Percentage discount must be between 1 and 100.");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (editDiscount.type === "Value") {
  const amt = parseFloat(editDiscount.amount);
  const salePrice = parseFloat(editDiscount.product?.sale_price || 0);

  if (amt <= 0) {
    setMessage("Value discount must be greater than 0.");
    setMessageType("error");
    setTimeout(() => setMessage(null), 3000);
    return;
  }

  if (amt > salePrice) {
    setMessage(`Discount cannot exceed product sale price (Rs. ${salePrice})`);
    setMessageType("error");
    setTimeout(() => setMessage(null), 3000);
    return;
  }
}

    try {
      const updatedDiscount = await UpdateDiscount(editDiscount);
      handleModalClose();
      fetchDiscounts();

      setMessage("Discount updated successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage(err.message || "Failed to update discount");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredData = data.filter((d) => {
    if (!startDate || !endDate) return true;
    return !(
      (endDate && d.startDate > endDate) ||
      (startDate && d.endDate < startDate)
    );
  });

  const totalAmount = filteredData.reduce((sum, d) => sum + d.amount, 0);

  const handleChange = (e) => {
    setNewDiscount({ ...newDiscount, [e.target.name]: e.target.value });
  };

  const handleProductSelect = (selected) => {
    setSelectedProducts(selected);
    setNewDiscount({
      ...newDiscount,
      items: selected.map((s) => s.label),
      productCodes: selected.map((s) => s.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      setMessage("Please select at least one product!");
      setMessageType("error");
      return;
    }

    // ✅ Validation
    if (
      newDiscount.type === "Percent" &&
      (newDiscount.amount <= 0 || newDiscount.amount > 100)
    ) {
      setMessage("Percentage discount must be between 1 and 100.");
      setMessageType("error");
      return;
    }
    if (newDiscount.type === "Value" && newDiscount.amount <= 0) {
      setMessage("Value discount must be greater than 0.");
      setMessageType("error");
      return;
    }

    try {
      const newEntry = {
        ...newDiscount,
        items: selectedProducts.map((p) => p.label),
        productCodes: selectedProducts.map((p) => p.value),
        amount: parseFloat(newDiscount.amount),
      };

      await AddDiscount(newEntry);

      const newRows = selectedProducts.map((p, index) => ({
        id: data.length + index + 1,
        item: p.label,
        productCode: p.value,
        type: newDiscount.type,
        description: newDiscount.description,
        startDate: newDiscount.startDate,
        endDate: newDiscount.endDate,
        amount: parseFloat(newDiscount.amount),
        status: newDiscount.status,
      }));

      setData((prev) => [...prev, ...newRows]);

      setMessage("Discount(s) added successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(null), 3000);

      setNewDiscount({
        items: [],
        productCodes: [],
        type: "Percent",
        description: "",
        startDate: "",
        endDate: "",
        amount: "",
        status: "Active",
      });
      setSelectedProducts([]);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving discount:", err);
      setMessage(err.message);
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelClick = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete discount with id : ${id} ?`
    );
    if (!confirmDelete) return;

    try {
      const res = await DelDiscount(id);

      setMessage(res.message);
      setMessageType("success");
      setTimeout(() => setMessage(null), 3000);
      setData((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting discount:", err);
      setMessage(err.message);
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="discount-container">
      {message && (
        <div
          className={`message ${messageType}`}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            padding: "10px 15px",
            borderRadius: "5px",
            color: "#fff",
            fontWeight: "bold",
            backgroundColor: messageType === "success" ? "#28a745" : "#dc3545",
          }}
        >
          {message}
        </div>
      )}

      <div ref={componentRef} className="print-area">
        {/* Header */}
        <div className="discount-header">
          <h2>{profiledata.shopName}</h2>
          <span>
            <p>{profiledata.location}</p>
            <p>{profiledata.number1}</p>
            <p>{profiledata.number2}</p>
          </span>
          <h2>Discounts & Offers</h2>
        </div>

        {/* Add Discount */}
        <div className="add-btn-container">
          <button
            className="btn btn-green"
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus /> Add Items Discount
          </button>
        </div>

        {showForm && (
  <div className="modal-overlay" onClick={() => setShowForm(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <h3 className="modal-header green">Add New Discount</h3>
      <form onSubmit={handleSubmit}>
        <label>Products</label>
        <Select
          options={productOptions}
          value={selectedProducts}
          onChange={handleProductSelect}
          placeholder="Select products..."
          isMulti
        />

        <label>Description</label>
        <input
          type="text"
          name="description"
          value={newDiscount.description}
          onChange={handleChange}
          required
        />

          <div >
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={newDiscount.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div >
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={newDiscount.endDate}
              onChange={handleChange}
              required
            />
          </div>

        <label>Discount Type</label>
        <select
          name="type"
          value={newDiscount.type}
          onChange={handleChange}
          required
        >
          <option value="Percent">Percentage (%)</option>
          <option value="Value">Fixed Value (PKR)</option>
        </select>

        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={newDiscount.amount}
          placeholder={
            newDiscount.type === "Percent"
              ? "Enter % (max 100)"
              : "Enter value in PKR"
          }
          onChange={handleChange}
          required
        />

        <label>Status</label>
        <select
          name="status"
          value={newDiscount.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="form-actions">
          <button type="submit" className="btn btn-green">
            Save
          </button>
          <button
            type="button"
            className="btn btn-red"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        {/* Date Filters */}
        <div className="discountPage-div">
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

        {/* Summary */}
        <div className="summary">
          Total Discounts & Offers Amount: Rs. {totalAmount}
        </div>

        {/* Table */}
        <table className="table" border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Type</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Amount</th>
              <th>Effective Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((d) => {
                const today = new Date().toISOString().split("T")[0];
                let validity =
                  today < d.startDate
                    ? "Upcoming"
                    : today > d.endDate
                    ? "Expired"
                    : "Ongoing";
                let effectiveStatus = "";
                let color = "";
                if (d.status === "Active") {
                  effectiveStatus =
                    validity === "Ongoing"
                      ? "Active & Ongoing"
                      : validity === "Upcoming"
                      ? "Active but Upcoming"
                      : "Active but Expired";
                  color =
                    validity === "Ongoing"
                      ? "green"
                      : validity === "Upcoming"
                      ? "blue"
                      : "red";
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
                    <td>
                      {d.type === "Percent"
                        ? `${d.amount}%`
                        : `Rs. ${d.amount}`}
                    </td>
                    <td className={`status ${color}`}>{effectiveStatus}</td>
                    <td>
                      <button
                        className="icon-btn"
                        onClick={() => setSelectedDiscount(d)}
                        title="View Details"
                      >
                        <FaList />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => handleEditClick(d)}
                        title="Edit Discount"
                      >
                        <FaEdit />
                      </button>
                      <button
                        style={{ background: "white", color: "red" }}
                        className="icon-btn"
                        onClick={() => handleDelClick(d.id)}
                        title="Delete Discount"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="no-records">
                  No records found for selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* View Details Modal */}
        {selectedDiscount && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedDiscount(null)}
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div
                className="close-btn"
                onClick={() => setSelectedDiscount(null)}
              >
                ❌
              </div>
              <h3 className="modal-header">Discount / Offer Details</h3>
              <table className="modal-table">
                <tbody>
                  <tr>
                    <td>ID</td>
                    <td>{selectedDiscount.id}</td>
                  </tr>
                  <tr>
                    <td>Type</td>
                    <td>{selectedDiscount.type}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{selectedDiscount.description}</td>
                  </tr>
                  <tr>
                    <td>Start Date</td>
                    <td>{selectedDiscount.startDate}</td>
                  </tr>
                  <tr>
                    <td>End Date</td>
                    <td>{selectedDiscount.endDate}</td>
                  </tr>
                  <tr>
                    <td>Amount</td>
                    <td>
                      {selectedDiscount.type === "Percent"
                        ? `${selectedDiscount.amount}%`
                        : `Rs. ${selectedDiscount.amount}`}
                    </td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{selectedDiscount.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editDiscount && (
          <div className="modal-overlay" onClick={handleModalClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-header blue">Edit Discount</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleModalSave();
                }}
              >
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
                  required
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
                  required
                />
                <label>End Date</label>
                <input
                  type="date"
                  value={editDiscount.endDate}
                  onChange={(e) =>
                    setEditDiscount({ ...editDiscount, endDate: e.target.value })
                  }
                  required
                />

                <label>Discount Type</label>
                <select
                  value={editDiscount.type}
                  onChange={(e) =>
                    setEditDiscount({ ...editDiscount, type: e.target.value })
                  }
                  required
                >
                  <option value="Percent">Percentage (%)</option>
                  <option value="Value">Fixed Value (PKR)</option>
                </select>

                <label>Amount</label>
                <input
                  type="number"
                  value={editDiscount.amount}
                  placeholder={
                    editDiscount.type === "Percent"
                      ? "Enter % (max 100)"
                      : "Enter value in PKR"
                  }
                  onChange={(e) =>
                    setEditDiscount({
                      ...editDiscount,
                      amount: e.target.value,
                    })
                  }
                  required
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
                <div className="form-actions">
                  <button type="submit" className="btn btn-blue">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-red"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Print */}
      <div className="print-btn-container">
        <button className="btn btn-blue" onClick={handlePrint}>
          <FaPrint /> Print
        </button>
      </div>
    </div>
  );
}

export default ItemsDiscount;
