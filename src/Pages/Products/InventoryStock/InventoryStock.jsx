import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaDownload,
  FaUpload,
  FaListAlt,
  FaTrash,
  FaBox,
} from "react-icons/fa";
import styles from "./InventoryStock.module.css"; // import as module
import {
  GetProducts,
  DelProduct,
  GetCategoriesSuppliers,
} from "../../../UserService";
import ProductUpdateModal from "../ViewProducts/Components/ProductViewTable/ProductUpdateModal";

function InventoryStock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stock, setStock] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const itemsPerPage = 30;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await GetProducts();
        setStock(result);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetCategoriesSuppliers();
        setCategories(data.categories || []);
        setSuppliers(data.suppliers || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const deleteProduct = async (code) => {
    if (!window.confirm(`Do you want to delete ${code} product?`)) return;
    try {
      await DelProduct(code);
      setStock(stock.filter((item) => item.code !== code));
      setMessage({ text: "Product deleted successfully", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleUpdateProduct = (code, formData, supplierObj, categoryObj) => {
    setStock((prev) =>
      prev.map((item) =>
        item.code === code
          ? {
              ...item,
              ...formData,
              Supplier: supplierObj
                ? { supplier_name: supplierObj.supplier_name }
                : null,
              Category: categoryObj ? { name: categoryObj.name } : null,
            }
          : item
      )
    );
  };

  const filteredStock = stock.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.Supplier?.supplier_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const isLowStock = item.qty < 10;
    const isExpired = new Date(item.expiry) < new Date();

    if (filterType === "low" && !isLowStock) return false;
    if (filterType === "expired" && !isExpired) return false;

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
  const currentItems = filteredStock.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const lowStockCount = stock.filter((item) => item.qty < 10).length;
  const expiredCount = stock.filter(
    (item) => new Date(item.expiry) < new Date()
  ).length;

  return (
    <div className={styles["inventory-container"]}>
      {message.text && (
  <div
    className={`${styles["update-msg"]} ${
      message.type === "success" ? styles.success : styles.error
    }`}
  >
    {message.text}
  </div>
)}


      <div className={styles["inventory-header"]}>
        <button onClick={() => setFilterType("all")}>
          <FaBox className={styles.inventoryicon} /> Show All
        </button>
        <button onClick={() => setFilterType("low")}>
          <FaBox className={styles.inventoryicon} /> Low Stock ({lowStockCount})
        </button>
        <button onClick={() => setFilterType("expired")}>
          <FaBox className={styles.inventoryicon} /> Expired Stock (
          {expiredCount})
        </button>
       {/*} <button onClick={() => (window.location.href = "/auditLog")}>
          <FaListAlt className={styles.inventoryicon} /> Audit Log
        </button>
        <button onClick={() => (window.location.href = "/import")}>
          <FaUpload className={styles.inventoryicon} /> Import Stock
        </button>
        <button onClick={() => (window.location.href = "/export")}>
          <FaDownload className={styles.inventoryicon} /> Export Stock
        </button>*/}
      </div>  
      
      <div className={styles["stock-container"]}>
        <div className={styles["stock-summary"]}>
          <p>
            <strong>Total Items:</strong> {stock.length}
          </p>
          <p>
            <strong>Total Quantity:</strong>{" "}
            {stock.reduce((acc, item) => acc + item.qty, 0)}
          </p>
          <p>
            <strong>Total Inventory Cost:</strong> Rs{" "}
            {stock
              .reduce((acc, item) => acc + item.qty * item.cost_price, 0)
              .toLocaleString()}
          </p>
          <p className={styles["low-stock"]}>
            <strong>Low Stock Alerts:</strong> {lowStockCount}
          </p>
          <p className={styles.expired}>
            <strong>Expired Items:</strong> {expiredCount}
          </p>
        </div>

        <div className={styles["search-bar"]}>
          <input
            type="text"
            placeholder="Search by Name, Code or Supplier..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className={styles["stock-table"]}>
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Name</th>
              <th>Cost Price</th>
              <th>Quantity</th>
              <th>Sale Price</th>
              <th>Total Sale Price</th>
              <th>Supplier</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const rowClass =
                item.qty < 10
                  ? styles["low-stock"]
                  : new Date(item.expiry) < new Date()
                  ? styles.expired
                  : "";
              return (
                <tr key={index} className={rowClass}>
                  <td data-label="#">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td data-label="Code">{item.code}</td>
                  <td data-label="Name">{item.name}</td>
                  <td data-label="Cost Price">PKR {item.cost_price}</td>
                  <td data-label="Quantity">{item.qty}</td>
                  <td data-label="Sale Price">PKR {item.sale_price}</td>
                  <td data-label="Total Sale Price">
                    PKR {(item.qty * item.sale_price).toLocaleString()}
                  </td>
                  <td data-label="Supplier">
                    {item.Supplier?.supplier_name || "----"}
                  </td>
                  <td data-label="Expiry Date">{item.expiry}</td>
                  <td data-label="Actions">
                    <button onClick={() => setOpen(item)}>
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteProduct(item.code)}
                      className={styles["delete-btn"]}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {open && (
        <div className={styles["modal--overlay"]} onClick={() => setOpen(null)}>
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <ProductUpdateModal
              open={open}
              setOpen={setOpen}
              categories={categories}
              suppliers={suppliers}
              onUpdate={handleUpdateProduct}
              setMessage={setMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryStock;
