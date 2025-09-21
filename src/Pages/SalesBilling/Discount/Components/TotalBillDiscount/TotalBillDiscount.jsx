import { useState, useRef,useEffect } from "react";
import { FaEdit, FaTrash, FaList, FaPlus, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import AddBillDiscountOverlay from "./AddBillDiscountOverlay";
import EditBillDiscountOverlay from "./EditBillDiscountOverlay";
import { AddBillDiscount, getBillDiscount, DelBillDiscount, UpdateBillDiscount } from "../../../../../UserService";
import "./TotalBillDiscount.css";

function TotalBillDiscount() {
  const [discounts, setDiscounts] = useState([]);
const fetchBillDiscounts=async()=>{
    try{
        const result=await getBillDiscount()
        setDiscounts(result)
    }catch(err){
        console.error("Error adding discount:", 'error');
    showMessage(err, 'error');
    }
}
  useEffect(()=>{
    fetchBillDiscounts()
  },[])

  const [showOverlay, setShowOverlay] = useState(false);
  const [form, setForm] = useState({
    conditionType: "Above",
    amount: "",
    type: "Percentage",
    value: "",
    from: "",
    to: "",
    status: "Active",
    description: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editOverlay, setEditOverlay] = useState(false);
const [editForm, setEditForm] = useState(null);
  const today = new Date().toISOString().split("T")[0];
 const componentRef = useRef();

const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: "Total Bill Discount Summary",
});
const handleEditClick = (discount) => {
  setEditForm({ ...discount }); // pre-fill form
  setEditOverlay(true);
};
const handleUpdate = async () => {
  if (!editForm.amount || !editForm.value || !editForm.from || !editForm.to) {
    return showMessage("Please fill all required fields.", "error");
  }

  if (Number(editForm.amount) <= 0) {
    return showMessage("Amount must be greater than 0.", "error");
  }

  if (new Date(editForm.from) > new Date(editForm.to)) {
    return showMessage("Start date cannot be after end date.", "error");
  }

  if (editForm.type === "Percentage" && (editForm.value <= 0 || editForm.value > 100)) {
    return showMessage("Percentage discount must be between 1 and 100.", "error");
  }

  if (editForm.type === "Flat" && editForm.value < 0) {
    return showMessage("Flat discount cannot be negative.", "error");
  }

  try {
    const result = await UpdateBillDiscount(editForm);
    showMessage(result.message, "success");
    setDiscounts(discounts.map(d => d.id === editForm.id ? editForm : d));
    setEditOverlay(false);
  } catch (err) {
    console.error("Error updating discount:", err);
    showMessage(err.message || "Something went wrong.", "error");
  }
};


 const showMessage = (text, type = "success") => {
  setMessage({ text, type });
  setTimeout(() => setMessage({ text: "", type: "" }), 5000); // Hide after 5 seconds
};

const handleAdd = async () => {
  // Validation
  if (!form.amount || !form.value || !form.from || !form.to) {
    return showMessage("Please fill all required fields.", "error");
  }

  if (Number(form.amount) <= 0) {
    return showMessage("Amount must be greater than 0.", "error");
  }

  if (new Date(form.from) > new Date(form.to)) {
    return showMessage("Start date cannot be after end date.", "error");
  }

  if (form.type === "Percentage" && (form.value <= 0 || form.value > 100)) {
    return showMessage("Percentage discount must be between 1 and 100.", "error");
  }

  if (form.type === "Flat" && form.value < 0) {
    return showMessage("Flat discount cannot be negative.", "error");
  }

  const newDiscount = {
    ...form,
    amount: Number(form.amount),
    value: Number(form.value),
  };

  try {
    const response = await AddBillDiscount(newDiscount);
    if (response.ok) {
      setDiscounts([...discounts, newDiscount]);
      setForm({
        conditionType: "Above",
        amount: "",
        type: "Percentage",
        value: "",
        from: "",
        to: "",
        status: "Active",
        description: "",
      });
      setShowOverlay(false);
      showMessage("Discount added successfully!", "success");
    } else {
      const data = await response.json();
      showMessage(data.message || "Failed to add discount.", "error");
    }
  } catch (error) {
    console.error("Error adding discount:", error);
    showMessage("Something went wrong while adding the discount.", "error");
  }
};

const handleDelClick = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this discount?");
  if (!confirmDelete) return; // user cancelled

  try {
    const result = await DelBillDiscount(id);
    showMessage(result.message || "Discount deleted successfully.", "success");
    setDiscounts(discounts.filter((d) => d.id !== id));
  } catch (err) {
    console.error("Error deleting discount:", err);
    showMessage(err.message || "Something went wrong.", "error");
  }
};
 const getEffectiveStatus = (d) => {
    let validity =
      today < d.from ? "Upcoming" : today > d.to ? "Expired" : "Ongoing";

    if (d.status === "Active") {
      if (validity === "Ongoing") return { text: "Active & Ongoing", color: "green" };
      if (validity === "Upcoming") return { text: "Active but Upcoming", color: "blue" };
      return { text: "Active but Expired", color: "red" };
    } else {
      return { text: `Inactive (${validity})`, color: "gray" };
    }
  };

  const filteredDiscounts = discounts.filter((d) => {
    if (!startDate || !endDate) return true;
    return !((endDate && d.from > endDate) || (startDate && d.to < startDate));
  });



  return (
    <div className="Bill-discount-page">
      <div className="page-header">
         {/* Message */}
      {message.text && (
        <div className={`msg ${message.type === "success" ? "msg-success" : "msg-error"}`}>
          {message.text}
        </div>
      )}
        <h2>Total Bill Discounts</h2>
        <button className="btn btn-green" onClick={() => setShowOverlay(true)}>
          <FaPlus /> Add Discount
        </button>
      </div>

      {/* Filters */}
      <div className="filter-row">
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

      <div ref={componentRef}>
        {/* Table */}
        <table className="table" border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th>Condition</th>
              <th>Type</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Discount</th>
              <th>Effective Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredDiscounts.length > 0 ? (
    filteredDiscounts.map((d, index) => {
      const { text, color } = getEffectiveStatus(d);
      return (
        <tr key={d.id}>
          {/* Use index + 1 for numbering */}
          <td>{index + 1}</td>
          <td>
            {d.conditionType} {d.amount} PKR
          </td>
          <td>{d.type}</td>
          <td>{d.description}</td>
          <td>{d.from}</td>
          <td>{d.to}</td>
          <td>
            {d.type === "Percentage" ? `${d.value}%` : `Rs. ${d.value}`}
          </td>
          <td style={{ color }}>{text}</td>
          <td>
            <button
  className="icon-action-btn"
  title="Edit Discount"
  onClick={() => handleEditClick(d)}
>
  <FaEdit />
</button>
            <button
              style={{ background: "white", color: "red" }}
              className="icon-action-btn"
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
      </div>
{editOverlay && editForm && (
  <EditBillDiscountOverlay
    form={editForm}
    setForm={setEditForm}
    onSave={handleUpdate}
    onClose={() => setEditOverlay(false)}
  />
)}

      {/* Print Button */}
      <div className="print-btn-container">
        <button className="btn btn-blue" onClick={handlePrint}>
          <FaPrint /> Print
        </button>
      </div>

      {/* Overlay */}
      {showOverlay && (
        <AddBillDiscountOverlay
          form={form}
          setForm={setForm}
          onSave={handleAdd}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
}

export default TotalBillDiscount;
