import React, { useEffect, useState } from "react";
import styles from "./ProductViewTable.module.css";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import Barcode from "react-barcode";
import {
  GetProducts,
  DelProduct,
  GetCategoriesSuppliers,
} from "../../../../../UserService";
import ProductUpdateModal from "./ProductUpdateModal";

export default function ProductViewTable() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await GetProducts();
        setProducts(result);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchProducts();
  }, []);
  
  // Fetch categories & suppliers
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

  const handleDeleteProduct = async (code) => {
    if (!window.confirm(`Do you want to delete ${code} product?`)) return;

    try {
      await DelProduct(code);
      setProducts(products.filter((p) => p.code !== code));

      setMessage({ text: "Product deleted successfully", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleUpdateProduct = (code, formData, supplierObj, categoryObj) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.code === code
          ? {
              ...p,
              ...formData,
              Supplier: supplierObj
                ? { supplier_name: supplierObj.supplier_name }
                : null,
              Category: categoryObj ? { name: categoryObj.name } : null,
            }
          : p
      )
    );
  };

  const handlePrint = (productCode) => {
    const barcodeElement = document.querySelector(
      `#barcode-${productCode} svg`
    );
    if (!barcodeElement) return alert("Barcode not found!");
    const printWindow = window.open("", "PRINT", "height=400,width=600");
    printWindow.document.write(
      `<div style="text-align:center;">${barcodeElement.outerHTML}</div>`
    );
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const filteredProducts = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.Supplier?.supplier_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (p.Category?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles["products-container"]}>
      {message.text && (
        <div
          className={`${styles["update-msg"]} ${
            message.type === "success" ? styles.success : styles.error
          }`}
        >
          {message.text}
        </div>
      )}

      <h2 className={styles["table-title"]}>Products List</h2>
      <div className={styles["search-bar"]}>
        <input
          placeholder="Search by name,supplier,category or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
              <th>Unit</th>
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
                  <div
                    id={`barcode-${product.code}`}
                    style={{ textAlign: "center" }}
                  >
                    <Barcode
                      value={product.code}
                      width={0.6}
                      height={30}
                      fontSize={10}
                      margin={0}
                    />
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
                <td>{product.unitDetails?.name || "-"}</td>
                <td>{product.Supplier?.supplier_name || "-"}</td>
                <td>{product.Category?.name || "-"}</td>
                <td>{product.sale_price}</td>
                <td>{Number(product.total_price).toFixed(2)}</td>
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

      <ProductUpdateModal
        open={open}
        setOpen={setOpen}
        categories={categories}
        suppliers={suppliers}
        onUpdate={handleUpdateProduct}
        setMessage={setMessage} // ✅ add this
      />
    </div>
  );
}
