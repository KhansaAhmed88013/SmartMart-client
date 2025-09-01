import React, { useEffect, useState } from "react";
import styles from "./ProductViewTable.module.css"; 
import { FaTrashCan, FaPen } from "react-icons/fa6";
import Barcode from "react-barcode";
import Select from "react-select";   // ✅ You forgot this import
import { GetProducts, DelProduct, UpdateProduct, GetCategoriesSuppliers } from "../../../../../UserService";

function ProductViewTable() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products
  useEffect(() => {
    const callProduct = async () => {
      try {
        const result = await GetProducts();
        setProducts(result);
      } catch (err) {
        alert(err.message);
      }
    };
    callProduct();
  }, []);

  // Populate form when modal opens
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

  // Fetch categories and suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetCategoriesSuppliers();
        if (data) {
          setCategories(data.categories || []);
          setSuppliers(data.suppliers || []);
        }
      } catch (err) {
        console.error("Error fetching categories/suppliers:", err);
      }
    };
    fetchData();
  }, []);

  // Delete product
  const handleDeleteProduct = async (code) => {
    const response = window.confirm(`Do you want to delete ${code} product?`);
    try {
      if (response) {
        await DelProduct(code);
        window.location.reload();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Modal overlay click
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal--overlay")) {
      setOpen(null);
    }
  };

  // Form input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await UpdateProduct({ code: open.code, ...formData });
      window.location.reload();
      setMessage(result.message);
      setOpen(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage(err.message);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Print barcode
  const handlePrint = (productCode) => {
    const barcodeElement = document.querySelector(`#barcode-${productCode} svg`);
    if (!barcodeElement) {
      alert("Barcode not found!");
      return;
    }

    const printWindow = window.open("", "PRINT", "height=400,width=600");
    printWindow.document.write("<html><head><title>Print Barcode</title></head><body>");
    printWindow.document.write(`<h3 style="text-align:center;">Product Barcode</h3>`);
    printWindow.document.write(`<div style="margin-top:20px; text-align:center;">`);
    printWindow.document.write(barcodeElement.outerHTML);
    printWindow.document.write("</div></body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered products
  const filteredProducts = products.filter(
  (product) =>
    (product.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.Supplier?.supplier_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.Category?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className={styles["products-container"]}>
  {message && <div className={styles["update-msg"]}>{message}</div>}

  <h2 className={styles["table-title"]}>Products List</h2>

  {/* Search bar */}
  <div className={styles["search-bar"]}>
    <input
      type="text"
      placeholder="Search by name,supplier,category or code..."
      value={searchQuery}
      onChange={handleSearchChange}
    />
  </div>

  <div className={styles["table-wrapper"]}>
    <table className={styles["products-table"]}>
      <thead>
        <tr>
          <th>#</th>
          <th>Item Code / Barcode</th>
          <th>Product Name</th>
          <th>Cost Price</th>
          <th>QTY</th>
          <th>Supplier</th>
          <th>Category</th>
          <th>Sale Price</th>
          <th>Total Price</th>
          <th>Expiry</th>
          <th>Other</th>
        </tr>
      </thead>
      <tbody>
        {filteredProducts.map((product, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <div id={`barcode-${product.code}`} style={{ textAlign: "center" }}>
                <Barcode value={product.code} width={0.6} height={30} fontSize={10} margin={0} />
                <button
                  className={styles["print-btn"]}
                  onClick={() => handlePrint(product.code)}
                >
                  Print
                </button>
              </div>
            </td>
            <td>{product.name}</td>
            <td>{product.cost_price}</td>
            <td>{product.qty}</td>
            <td>{product.Supplier ? product.Supplier.supplier_name : "-"}</td>
            <td>{product.Category ? product.Category.name : "-"}</td>
            <td>{product.sale_price}</td>
            <td>{product.total_price}</td>
            <td>{product.expiry}</td>
            <td className={styles["controlls"]}>
              <FaPen
                className={styles["pen"]}
                size={28}
                onClick={() => setOpen(product)}
              />
              <FaTrashCan
                className={styles["trash"]}
                size={28}
                onClick={() => handleDeleteProduct(product.code)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Modal for update */}
  {open && (
    <div className={styles["modal--overlay"]} onClick={handleOverlayClick}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Update Product ({open.code})</h3>
        <form onSubmit={handleUpdate} className={styles["update-form"]}>
          <label>
            Product Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Cost Price:
            <input
              type="number"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Quantity:
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Supplier:
            <Select
              options={suppliers.map((s) => ({
                value: s.id,
                label: s.supplier_name,
              }))}
              value={
                suppliers
                  .map((s) => ({ value: s.id, label: s.supplier_name }))
                  .find((opt) => opt.value === formData.supplier_id) || null
              }
              onChange={(option) =>
                setFormData({
                  ...formData,
                  supplier_id: option ? option.value : null,
                })
              }
              placeholder="Select Supplier"
              isSearchable
            />
          </label>

          <label>
            Category:
            <Select
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              value={
                categories
                  .map((c) => ({ value: c.id, label: c.name }))
                  .find((opt) => opt.value === formData.category_id) || null
              }
              onChange={(option) =>
                setFormData({
                  ...formData,
                  category_id: option ? option.value : null,
                })
              }
              placeholder="Select Category"
              isSearchable
            />
          </label>

          <label>
            Sale Price:
            <input
              type="number"
              name="sale_price"
              value={formData.sale_price}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Total Price:
            <input
              type="number"
              name="total_price"
              value={formData.total_price}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Expiry:
            <input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleInputChange}
            />
          </label>

          <div className={styles["row"]}>
            <button type="submit">Update</button>
            <button type="button" onClick={() => setOpen(null)}>
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

export default ProductViewTable;
