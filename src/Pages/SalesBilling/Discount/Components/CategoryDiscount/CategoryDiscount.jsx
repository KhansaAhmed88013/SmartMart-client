import { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import AddCategoryDiscountOverlay from "./Components/AddCategoryDiscountOverlay";
import EditCategoryDiscountOverlay from "./Components/EditCategoryDiscountOverlay";
import { AddCategoryDiscount,GetCategoryDiscounts,UpdateCategoryDiscount,DelCategoryDiscount,GetCategories} from "../../../../../UserService";
import "./CategoryDiscount.css";

function CategoryDiscount() {
  const [discounts, setDiscounts] = useState([]);
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [form, setForm] = useState({
    category: "",
    percent: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });
  const [editForm, setEditForm] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [categories,setCategories]=useState([])

  const componentRef = useRef();
  const today = new Date().toISOString().split("T")[0];

  // ✅ Fetch discounts on load
  const fetchCategoryDiscounts = async () => {
    try {
      const result = await GetCategoryDiscounts();
      setDiscounts(result);
    } catch (err) {
      console.error("Error fetching discounts:", err);
      showMessage("Failed to load discounts", "error");
    }
  };
  const fetchCategories = async () => {
    try {
      const result = await GetCategories();
      setCategories(result);
    } catch (err) {
      console.error("Error fetching categories:", err);
      showMessage("Failed to load categories", "error");
    }
  };

  useEffect(() => {
    fetchCategoryDiscounts();
    fetchCategories();
  }, []);
  // ✅ Show message with auto-hide
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleAdd = async () => {
  if (!form.category || !form.percent || !form.startDate || !form.endDate) {
    return showMessage("Please fill all fields", "error");
  }

  if (form.percent <= 0 || form.percent > 100) {
    return showMessage("Percentage must be between 1 and 100", "error");
  }

  try {
    // 🔑 Map category → category_id for backend
    const payload = {
      category_id: form.category,
      percent: form.percent,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
    };

    console.log("📤 Sending Add payload:", payload);
const response = await AddCategoryDiscount(payload);

// find category name locally
const categoryObj = categories.find(c => c.id === parseInt(form.category));

setDiscounts([
  ...discounts,
  {
    ...response.discount,
    category: categoryObj ? categoryObj.name : ""
  }
]);

    setForm({ category: "", percent: "", startDate: "", endDate: "", status: "Active" });
    setShowAddOverlay(false);
    showMessage("Discount added successfully!");
  } catch (err) {
    console.error("Error adding discount:", err);
    showMessage("Failed to add discount", "error");
  }
};

// ✅ Update Discount
const handleUpdate = async () => {
  if (!editForm.category || !editForm.percent || !editForm.startDate || !editForm.endDate) {
    return showMessage("Please fill all fields", "error");
  }

  if (editForm.percent <= 0 || editForm.percent > 100) {
    return showMessage("Percentage must be between 1 and 100", "error");
  }

  try {
    const payload = {
      id: editForm.id,
      category_id: editForm.category, // send ID to backend
      percent: editForm.percent,
      startDate: editForm.startDate,
      endDate: editForm.endDate,
      status: editForm.status,
    };

    console.log("📤 Sending Update payload:", payload);

    const result = await UpdateCategoryDiscount(payload);

    // 🔑 Find category name locally
    const categoryObj = categories.find(c => c.id === parseInt(editForm.category));

    setDiscounts(
      discounts.map((d) =>
        d.id === editForm.id
          ? {
              ...editForm,
              category: categoryObj ? categoryObj.name : "", // show name in table
              category_id: editForm.category, // keep id too
            }
          : d
      )
    );

    setShowEditOverlay(false);
    showMessage(result.message || "Discount updated successfully!");
  } catch (err) {
    console.error("Error updating discount:", err);
    showMessage("Failed to update discount", "error");
  }
};
  const handleEditClick = (discount) => {
  setEditForm({
    id: discount.id,
    category: discount.category_id,  // ✅ use id
    percent: discount.percent,
    startDate: discount.startDate,
    endDate: discount.endDate,
    status: discount.status,
  });
  setShowEditOverlay(true);
};
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?")) return;

    try {
      const result = await DelCategoryDiscount(id);
      setDiscounts(discounts.filter((d) => d.id !== id));
      showMessage(result.message || "Discount deleted successfully!");
    } catch (err) {
      console.error("Error deleting discount:", err);
      showMessage("Failed to delete discount", "error");
    }
  };

  // ✅ Filter
  const filteredDiscounts = discounts.filter((d) => {
    if (fromDate && d.endDate < fromDate) return false;
    if (toDate && d.startDate > toDate) return false;
    return true;
  });

  // ✅ Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Category Discounts Summary",
  });

  const getEffectiveStatus = (d) => {
    let validity = today < d.startDate ? "Upcoming" : today > d.endDate ? "Expired" : "Ongoing";

    if (d.status === "Active") {
      if (validity === "Ongoing") return { text: "Active & Ongoing", color: "green" };
      if (validity === "Upcoming") return { text: "Active but Upcoming", color: "blue" };
      return { text: "Active but Expired", color: "red" };
    } else {
      return { text: `Inactive (${validity})`, color: "gray" };
    }
  };

  return (
    <div className="Bill-discount-page">
      <div className="page-header">
        <h2>Category Discounts</h2>
        <div className="header-actions">
          <button className="btn btn-green" onClick={() => setShowAddOverlay(true)}>
            <FaPlus /> Add Discount
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`msg ${message.type === "success" ? "msg-success" : "msg-error"}`}>
          {message.text}
        </div>
      )}

      {/* Date Filters */}
      <div className="date-filters">
        <label>From: </label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <label>To: </label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>

      {/* Table */}
      <div ref={componentRef}>
        <table className="table" border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Percent (%)</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Effective Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.length ? (
              filteredDiscounts.map((d, index) => {
                const { text, color } = getEffectiveStatus(d);
                return (
                  <tr key={d.id || index}>
                    <td>{index + 1}</td>
                    <td>{d.category}</td>
                    <td>{Number(d.percent).toFixed(0)}%</td>
                    <td>{d.startDate}</td>
                    <td>{d.endDate}</td>
                    <td style={{ color }}>{text}</td>
                    <td>
                      <button className="icon-action-btn" title="Edit" onClick={() => handleEditClick(d)}>
                        <FaEdit />
                      </button>
                      <button
                        className="icon-action-btn"
                        style={{ color: "red" }}
                        title="Delete"
                        onClick={() => handleDelete(d.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-records">No category discounts available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
{showAddOverlay && (
  <AddCategoryDiscountOverlay
    form={form}
    setForm={setForm}
    onSave={handleAdd}
    onClose={() => setShowAddOverlay(false)}
    categories={categories}   
  />
)}
{showEditOverlay && editForm && (
  <EditCategoryDiscountOverlay
    form={editForm}
    setForm={setEditForm}
    onSave={handleUpdate}
    onClose={() => setShowEditOverlay(false)}
    categories={categories}   
  />
)}

      {/* Print Button */}
      <div style={{ marginTop: "20px" }}>
        <button className="btn btn-blue" onClick={handlePrint}>
          <FaPrint /> Print
        </button>
      </div>
    </div>
  );
}

export default CategoryDiscount;
