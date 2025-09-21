// PurchaseOrderPage.jsx
import React, { useState, useEffect } from "react";
import {
  GetSuppliers,
  GetProducts,
  AddProduct,
  AddSupplier,
  CreatePurchaseOrder,
} from "../../../UserService";
import './PurchaseOrderPage.css'
import SupplierSection from "./components/SupplierSection";
import ProductSection from "./components/ProductSection";
import OrderTable from "./components/OrderTable";
import SummaryActions from "./components/SummaryActions";

function PurchaseOrderPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [products, setProducts] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [currency] = useState("Rs ");
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [changedItems, setChangedItems] = useState([]);

  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    cost_price: "",
    sale_price: "",
    qty: "",
    expiry: "",
    category_id: "",
  });

  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    supplier_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
    tax_number: "",
    payment_terms: "",
    bank_details: "",
    opening_balance: "",
    outstanding_balance: "",
    credit_limit: "",
    status: "Active",
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await GetSuppliers();
      const data = response.data || response;
      setSuppliers(
        data.map((s) => ({
          ...s,
          value: s.id,
          label: s.supplier_name,
        }))
      );
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await GetProducts();
      const data = response.data || response;
      setProducts(
        data.map((p) => ({
          ...p,
          value: p.id,
          label: p.name,
        }))
      );
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const addItem = () => {
    if (!product) return;
    setOrderItems([
      ...orderItems,
      {
        ...product,
        quantity,
        price: Number(product.cost_price),
        original_cost_price: Number(product.cost_price),
        sale_price: Number(product.sale_price),
      },
    ]);
    setProduct(null);
    setQuantity(1);
  };

  const updateOrderItem = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };

  const removeOrderItem = (index) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  const saveNewSupplier = async () => {
    if (!newSupplier.supplier_name) return;
    try {
      await AddSupplier(newSupplier);
      await fetchSuppliers();
      setShowNewSupplierModal(false);
      setNewSupplier({
        supplier_name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        country: "",
        tax_number: "",
        payment_terms: "",
        bank_details: "",
        opening_balance: "",
        outstanding_balance: "",
        credit_limit: "",
        status: "Active",
      });
    } catch (err) {
      console.error("Error saving supplier:", err);
    }
  };

  const saveNewProduct = async () => {
    if (!newProduct.name || !supplier) {
      alert("Please select a supplier and enter product name");
      return;
    }
    try {
      const productPayload = {
        ...newProduct,
        supplier_id: supplier.value,
      };
      await AddProduct(productPayload);
      await fetchProducts();
      setShowNewProductModal(false);
      setNewProduct({
        code: "",
        name: "",
        cost_price: "",
        sale_price: "",
        qty: "",
        expiry: "",
        category_id: "",
      });
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const calculateSubtotal = () =>
    orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submitOrder = async () => {
    if (!supplier || orderItems.length === 0) {
      alert("Please select a supplier and add at least one product.");
      return;
    }

    const itemsWithPriceChange = orderItems.filter(
      (item) => item.price !== item.original_cost_price
    );

    if (itemsWithPriceChange.length > 0) {
      setChangedItems(itemsWithPriceChange);
      setShowPriceModal(true);
      return;
    }

    await sendOrder(orderItems);
  };

 const sendOrder = async (finalItems) => {
  const total = finalItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Auto adjust status
  let finalStatus = paymentStatus;
  let finalPaidAmount = paidAmount;

  if (paidAmount === total) {
    finalStatus = "Paid";
    finalPaidAmount = total;
  } else if (paidAmount !== total && paymentStatus === "Paid") {
    finalStatus = "Partial";
    // keep whatever paidAmount user entered
  } else if (paymentStatus === "Partial") {
    finalPaidAmount = paidAmount;
  } else if (paymentStatus === "Pending") {
    finalPaidAmount = 0;
  }

  const orderPayload = {
    supplier_id: supplier.value,
    total: total,
    due_date: dueDate,
    payment_status: finalStatus,
    paid_amount: finalPaidAmount,
    purchase_date: new Date().toLocaleDateString(),
    items: finalItems.map((item) => ({
      product_id: item.value,
      quantity: item.quantity,
      cost_price: item.price,
      sale_price: item.sale_price,
    })),
  };

  try {
    const response = await CreatePurchaseOrder(orderPayload);
    alert("Purchase order submitted successfully!");
    console.log("Order submitted:", response.data);

    // reset form
    setOrderItems([]);
    setSupplier(null);
    setDueDate(null);
    setPaymentStatus("Pending");
    setPaidAmount(0);
    setShowPriceModal(false);
    setChangedItems([]);
  } catch (err) {
    console.error("Error submitting order:", err);
    alert("Failed to submit purchase order. Please try again.");
  }
};

  return (
  <div className="purchase-container">
    <h2 className="purchase-heading">Create Purchase Order</h2>

    <div className="purchase-supplier-section">
      <SupplierSection
        suppliers={suppliers}
        supplier={supplier}
        setSupplier={setSupplier}
        showNewSupplierModal={showNewSupplierModal}
        setShowNewSupplierModal={setShowNewSupplierModal}
        newSupplier={newSupplier}
        setNewSupplier={setNewSupplier}
        saveNewSupplier={saveNewSupplier}
      />
    </div>

    <div className="purchase-input purchase-due-date">
      <label>Due Date</label>
      <input
        type="date"
        name="due_date"
        value={dueDate || ""}
        onChange={(e) => setDueDate(e.target.value)}
      />
    </div>

    <div className="purchase-product-section">
      <ProductSection
        products={products}
        product={product}
        setProduct={setProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        addItem={addItem}
        showNewProductModal={showNewProductModal}
        setShowNewProductModal={setShowNewProductModal}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        saveNewProduct={saveNewProduct}
      />
    </div>

    <div className="purchase-order-table">
      <OrderTable
        orderItems={orderItems}
        onUpdateItem={updateOrderItem}
        onRemoveItem={removeOrderItem}
      />
    </div>

    <div className="purchase-payment-section">
      <div className="purchase-input purchase-payment-status">
        <label>Payment Status</label>
        <select
          name="payment_status"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {paymentStatus === "Partial" && (
        <div className="purchase-input purchase-paid-amount">
          <label>Paid Amount</label>
          <input
            type="number"
            value={paidAmount}
            required
            onChange={(e) => setPaidAmount(Number(e.target.value))}
          />
        </div>
      )}
    </div>

    <div className="purchase-summary-actions">
      <SummaryActions
        calculateSubtotal={calculateSubtotal}
        currency={currency}
        supplier={supplier}
        orderItems={orderItems}
        submitOrder={submitOrder}
      />
    </div>

    {showPriceModal && (
      <div className="price-modal">
        <div className="price-modal-content">
          <h2 className="price-modal-title">Cost Price Changed</h2>
          <p className="price-modal-text">
            The cost price of some products has changed. Update sale prices if
            needed.
          </p>

          <div className="price-modal-items">
            {changedItems.map((item, index) => (
              <div key={index} className="price-modal-item">
                <span className="price-item-name">{item.name}:</span>
                <span className="price-item-change">
                  {item.original_cost_price} → {item.price}
                </span>
                <label>Sale price</label>
                <input
                  type="number"
                  value={item.sale_price}
                  onChange={(e) => {
                    const newItems = [...changedItems];
                    newItems[index].sale_price = Number(e.target.value);
                    setChangedItems(newItems);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="price-modal-actions">
            <button
              className="btn btn-confirm"
              onClick={() => sendOrder([...orderItems])}
            >
              Confirm & Submit
            </button>
            <button
              className="btn btn-cancel"
              onClick={() => setShowPriceModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

}

export default PurchaseOrderPage;
