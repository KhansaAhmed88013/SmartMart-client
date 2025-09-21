import React, { useState, useEffect } from "react";
import { GetCategories, EditCategory, DelCategory } from "../../../../../UserService";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./CategoryView.css";

function CategoryView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetCategories();
        setCategories(res.data || res);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="category-view-message error">{error}</p>;

  const handleEditClick = (category) => setSelectedCategory(category);
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setSaveSuccess("");
    setSaveError("");

    try {
      const res = await DelCategory(id);
      if (res?.message) {
        setSaveSuccess(res.message);
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setTimeout(() => setSaveSuccess(""), 2000);
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || "Failed to delete category");
    }
  };

  const handleInputChange = (key, value) => setSelectedCategory({ ...selectedCategory, [key]: value });
  const handleSave = async () => {
    try {
      setSaveSuccess("");
      const res = await EditCategory(selectedCategory);
      if (res?.message) {
        setSaveSuccess(res.message);
        setSaveError("");
        setCategories((prev) =>
          prev.map((c) => (c.id === selectedCategory.id ? { ...selectedCategory } : c))
        );
        setSelectedCategory(null);
        setTimeout(() => setSaveSuccess(""), 2000);
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <div className="category-view-container">
      <h2>All Categories</h2>
      {saveError && <p className="category-view-message error">{saveError}</p>}
      {saveSuccess && <p className="category-view-message success">{saveSuccess}</p>}

      <table className="category-view-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <tr key={index}>
                <td data-label="#">{index + 1}</td>
                <td data-label="Category Name">{category.name}</td>
                <td data-label="Description">{category.description}</td>
                <td data-label="" className="action-td">
                  <div className="action-b" onClick={() => handleEditClick(category)}>
                    <FaEdit className="action-box" />
                  </div>
                  <div className="action-b" onClick={() => handleDeleteClick(category.id)}>
                    <FaTrash className="action-trash-box" />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No categories found</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedCategory && (
        <div className="category-view-modal-overlay" onClick={() => setSelectedCategory(null)}>
          <div className="category-view-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Category</h3>
            <form
              className="category-view-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={selectedCategory.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={selectedCategory.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setSelectedCategory(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryView;
