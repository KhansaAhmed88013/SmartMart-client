import React, { useEffect, useState } from "react";
import { CreateCategory, GetProducts } from "../../../UserService"; // axios wrapper
import "./Categories.css";

function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState("");   
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [globalSearch, setGlobalSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState({});

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await GetProducts();
      setProducts(result);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-dismiss messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = product.Category?.name || "No Category";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(product);
    return acc;
  }, {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await CreateCategory(formData);
      setMsgType("success");
      setMessage(result.data.message);
      setShowModal(false);
      setFormData({ name: "", description: "" });
      await fetchProducts(); // Refresh products after adding category
    } catch (err) {
      setMsgType("error");
      setMessage(err.message);
    }
  };

  if (loading) return <p>Loading products...</p>;

  // Filtered grouped products by global and category search
const getFilteredProducts = (categoryName) => {
  let filtered = groupedProducts[categoryName] || [];

  // Global search across code, name, category, supplier
  if (globalSearch) {
    filtered = filtered.filter((p) => {
      const categoryMatch = (p.Category?.name || "").toLowerCase().includes(globalSearch.toLowerCase());
      return (
        p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(globalSearch.toLowerCase()) ||
        categoryMatch 
      );
    });
  }

  // Category-specific search across code, name, supplier
  if (categorySearch[categoryName]) {
    filtered = filtered.filter((p) => {
      const supplierMatch = (p.Supplier?.supplier_name || "").toLowerCase().includes(categorySearch[categoryName].toLowerCase());
      return (
        p.name.toLowerCase().includes(categorySearch[categoryName].toLowerCase()) ||
        p.code.toLowerCase().includes(categorySearch[categoryName].toLowerCase()) ||
        supplierMatch
      );
    });
  }

  return filtered;
};

  return (
    <div className="categories-page">
      {/* Global Search */}
      <div className="categories-header">
  <div className="header-left">
    <button className="btn-create" onClick={() => setShowModal(true)}>
      + Create Category
    </button>
    <button className="btn-all" onClick={() => window.location.href = '/allCategories'}>
      All Categories
    </button>
  </div>

  <div className="header-search">
    <input
      type="text"
      placeholder="Search all products by code, name, or category..."
      value={globalSearch}
      onChange={(e) => setGlobalSearch(e.target.value)}
    />
  </div>
</div>

      {/* Success/Error Message */}
      {message && (
        <div className={`alert ${msgType}`}>
          {message}
        </div>
      )}

      {/* Products grouped by category */}
      {/* Products grouped by category */}
<div className="categories-list">
  {Object.keys(groupedProducts)
    // Sort categories: those with filtered products first
    .sort((a, b) => {
      const aCount = getFilteredProducts(a).length;
      const bCount = getFilteredProducts(b).length;
      return bCount === 0 && aCount !== 0 ? -1 : aCount === 0 && bCount !== 0 ? 1 : 0;
    })
    .map((catName) => {
      const filteredProducts = getFilteredProducts(catName);
      return (
        <div key={catName} className="category-block">
          <div className="category-header ">
  <h3 className="category-heading">{catName}</h3>
  <input
    type="text"
    className="category-search "
    placeholder="Search by code or name..."
    value={categorySearch[catName] || ""}
    onChange={(e) =>
      setCategorySearch({
        ...categorySearch,
        [catName]: e.target.value,
      })
    }
  />
</div>
          <div className="table-wrapper">
            <table className="products-table">
  <thead>
    <tr>
      <th>#</th>
      <th>Item Code</th>
      <th>Product Name</th>
      <th>QTY</th>
      <th>Cost Price</th>
      <th>Sale Price</th>
      <th>Total on Sale</th>      {/* NEW */}
      <th>Total on Cost</th>      {/* NEW */}
      </tr>
  </thead>
  <tbody>
    {filteredProducts.map((product, index) => {
      const totalOnSale = product.qty * product.sale_price;
      const totalOnCost = product.cost_price * product.qty; 
      return (
        <tr key={product.id}>
  <td data-label="#">{index + 1}</td>
  <td data-label="Item Code">{product.code}</td>
  <td data-label="Product Name">{product.name}</td>
  <td data-label="QTY">{product.qty}</td>
  <td data-label="Cost Price">{product.cost_price}</td>
  <td data-label="Sale Price">{product.sale_price}</td>
  <td data-label="Total on Sale">{totalOnSale.toFixed(2)}</td>
  <td data-label="Total on Cost">{totalOnCost.toFixed(2)}</td>
</tr>
      );
    })}
    {filteredProducts.length > 0 && (
   <tr className="category-summary">
  <td colSpan="3" data-label=""><strong>Category Totals</strong></td>
  <td data-label="QTY">{filteredProducts.reduce((sum, p) => sum + p.qty, 0)}</td>
  <td data-label="Cost Price">{filteredProducts.reduce((sum, p) => sum + Number(p.cost_price), 0)}</td>
  <td data-label="Sale Price">{filteredProducts.reduce((sum, p) => sum + Number(p.sale_price), 0)}</td>
  <td data-label="Total on Sale">{filteredProducts.reduce((sum, p) => sum + p.qty * p.sale_price, 0)}</td>
  <td data-label="Total on Cost">{filteredProducts.reduce((sum, p) => sum + p.qty * p.cost_price, 0)}</td>
</tr>

  )}
  </tbody>
</table>

            {filteredProducts.length === 0 && <p>No products found.</p>}
          </div>
        </div>
      );
    })}
</div>

      {/* Create Category Modal */}
      {showModal && (
        <div className="overlay">
          {message && (
            <div className={`alert ${msgType} overlay-alert`}>
              {message}
            </div>
          )}
          <div className="modal">
            <h2>Create New Category</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">Save</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
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

export default Categories;
