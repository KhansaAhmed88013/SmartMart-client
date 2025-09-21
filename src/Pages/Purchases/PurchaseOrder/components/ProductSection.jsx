import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { FaPlus, FaTimes } from "react-icons/fa";
import { GetCategoriesSuppliers } from "../../../../UserService";
import CategoryModal from "../../../Products/AddProducts/Components/ProductInputTable/CategoryModal";

export default function ProductSection({
  products,
  product,
  setProduct,
  quantity,
  setQuantity,
  addItem,
  showNewProductModal,
  setShowNewProductModal,
  newProduct,
  setNewProduct,
  saveNewProduct,
}) {
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState(null);

  // Custom menu list for products
  const CustomMenuList = (props) => {
    const { children } = props;
    return (
      <components.MenuList {...props}>
        <div
          className="add-product-btn"
          style={{cursor:'pointer',color:'green',fontWeight:'bold'}}
          onClick={() => setShowNewProductModal(true)}
        >
          + Add New Product
        </div>
        {children}
      </components.MenuList>
    );
  };

  // Fetch categories & suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetCategoriesSuppliers();
        if (data) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Error fetching categories/suppliers:", err);
      }
    };
    fetchData();
  }, []);

  const categoryOptions = [
    { value: "add_new", label: "➕ Add New Category", isNew: true },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <>
      <div className="product-section">
        <div className="product-select-wrapper">
          <Select
            options={products}
            value={product}
            onChange={setProduct}
            placeholder="Choose product"
            isSearchable
            components={{ MenuList: CustomMenuList }}
            classNamePrefix="custom-select"
          />

          {product && (
            <p className="product-meta">
              <span className="product-code">Code: {product.code}</span>,{" "}
              <span className="product-stock">Stock: {product.qty}</span>,{" "}
              <span className="product-expiry">Expiry: {product.expiry}</span>
            </p>
          )}
        </div>

        <div className="quantity-wrapper">
          <label className="form-label">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="form-input"
          />
        </div>

        <button onClick={addItem} className="btn add-btn">
          <FaPlus /> Add
        </button>
      </div>

      {/* New Product Modal */}
      {showNewProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowNewProductModal(false)}
            >
              <FaTimes />
            </button>
            <h2 className="modal-title">Add New Product</h2>
            <div className="form-fields">
              <input
                type="text"
                placeholder="Code"
                value={newProduct.code}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, code: e.target.value })
                }
                className="form-input"
              />
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="form-input"
              />
              <input
                type="number"
                placeholder="Cost Price"
                value={newProduct.cost_price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, cost_price: e.target.value })
                }
                className="form-input"
              />
              <input
                type="number"
                placeholder="Sale Price"
                value={newProduct.sale_price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sale_price: e.target.value })
                }
                className="form-input"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newProduct.qty}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, qty: e.target.value })
                }
                className="form-input"
              />
              <input
                type="date"
                value={newProduct.expiry}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, expiry: e.target.value })
                }
                className="form-input"
              />

              {/* Category Select */}
              <Select
                options={categoryOptions}
                value={
                  categoryOptions.find(
                    (opt) => opt.value === newProduct.category_id
                  ) || null
                }
                onChange={(option) => {
                  if (option.value === "add_new") {
                    setShowCategoryModal(true);
                  } else {
                    setNewProduct({ ...newProduct, category_id: option.value });
                  }
                }}
                placeholder="Select Category"
                isSearchable
                classNamePrefix="custom-select"
              />

              <button onClick={saveNewProduct} className="btn save-btn">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        setCategories={setCategories}
        setMessage={setMessage}
        setMsgType={setMsgType}
      />

      {/* Toast */}
      {message && (
        <div
          className={`toast ${
            msgType === "success" ? "toast-success" : "toast-error"
          }`}
        >
          {message}
        </div>
      )}
    </>
  );
}
