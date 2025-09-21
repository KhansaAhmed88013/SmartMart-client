import React, { useEffect, useState } from "react";
import Select from "react-select";
import styles from "./ProductViewTable.module.css"; 
import { UpdateProduct } from "../../../../../UserService";

export default function ProductUpdateModal({
  open,
  setOpen,
  categories,
  suppliers,
  onUpdate,
  setMessage,   // ✅ add this
}) {
  const [formData, setFormData] = useState({
    name: "",
    cost_price: "",
    qty: "",
    sale_price: "",
    total_price: "",
    expiry: "",
    category_id: null,
    supplier_id: null,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: open.name,
        cost_price: open.cost_price,
        qty: open.qty,
        category_id: open.category_id || null,
        supplier_id: open.supplier_id || null,
        sale_price: open.sale_price,
        total_price: open.total_price,
        expiry: open.expiry ? open.expiry.split("T")[0] : "",
      });
    }
  }, [open]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains(styles["modal--overlay"])) {
      setOpen(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await UpdateProduct({ code: open.code, ...formData });

    const updatedSupplier =
      suppliers.find((s) => s.id === formData.supplier_id) || null;
    const updatedCategory =
      categories.find((c) => c.id === formData.category_id) || null;

    onUpdate(open.code, formData, updatedSupplier, updatedCategory);

    setOpen(null);

    if (typeof setMessage === "function") {
      setMessage({ text: result.message || "Product updated successfully", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } else {
      alert(result.message || "Product updated successfully");
    }
  } catch (err) {
    if (typeof setMessage === "function") {
      setMessage({ text: err.message, type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } else {
      alert(err.message);
    }
  }
};
  if (!open) return null;

  return (
    <div className={styles["modal--overlay"]} onClick={handleOverlayClick}>
      <div className={styles["modal-content"]} onClick={e => e.stopPropagation()}>
        <h3>Update Product ({open.code})</h3>
        <form onSubmit={handleSubmit} className={styles["update-form"]}>
          <label>
            Product Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </label>
          <label>
            Cost Price:
            <input type="number" name="cost_price" value={formData.cost_price} onChange={handleInputChange} />
          </label>
          <label>
            Quantity:
            <input type="number" name="qty" value={formData.qty} onChange={handleInputChange} />
          </label>
          <label>
            Supplier:
            <Select
              options={suppliers.map(s => ({ value: s.id, label: s.supplier_name }))}
              value={suppliers.map(s => ({ value: s.id, label: s.supplier_name })).find(opt => opt.value === formData.supplier_id) || null}
              onChange={option => setFormData({...formData, supplier_id: option ? option.value : null})}
              placeholder="Select Supplier"
              isSearchable
            />
          </label>
          <label>
            Category:
            <Select
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              value={categories.map(c => ({ value: c.id, label: c.name })).find(opt => opt.value === formData.category_id) || null}
              onChange={option => setFormData({...formData, category_id: option ? option.value : null})}
              placeholder="Select Category"
              isSearchable
            />
          </label>
          <label>
            Sale Price:
            <input type="number" name="sale_price" value={formData.sale_price} onChange={handleInputChange} />
          </label>
          <label>
            Total Price:
            <input type="number" name="total_price" value={formData.total_price} onChange={handleInputChange} />
          </label>
          <label>
            Expiry:
            <input type="date" name="expiry" value={formData.expiry} onChange={handleInputChange} />
          </label>
          <div className={styles["row"]}>
            <button type="submit">Update</button>
            <button type="button" onClick={() => setOpen(null)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
