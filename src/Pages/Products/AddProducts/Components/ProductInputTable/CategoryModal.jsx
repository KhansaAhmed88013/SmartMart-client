import React, { useState } from "react";
import { CreateCategory, GetCategoriesSuppliers } from "../../../../../UserService";

function CategoryModal({ show, onClose, setCategories, setMessage, setMsgType }) {
  const [formData, setFormData] = useState({ name: "", description: "" });

  if (!show) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await CreateCategory(formData);
      setMsgType("success");
      setMessage(result.data.message);

      const data = await GetCategoriesSuppliers();
      if (data) setCategories(data.categories || []);

      onClose();
    } catch (err) {
      setMsgType("error");
      setMessage(err.message);
    }
    setFormData({ name: "", description: "" });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Category</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Category Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter category name" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" rows="3"></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;
