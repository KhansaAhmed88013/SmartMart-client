import React, { useState, useEffect } from "react";
import { Getnoofdiscount } from "../../../UserService";
import "./DiscountOffer.css";

const DiscountOffer = () => {
  const [noofdiscount, setNoofdiscount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscountNo = async () => {
      try {
        const result = await Getnoofdiscount();
        setNoofdiscount(result || {}); // fallback to empty object
      } catch (err) {
        console.error(err);
        setError("Failed to load discounts");
      }
    };
    fetchDiscountNo();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!noofdiscount) {
    return <div>Loading...</div>;
  }

  // Default 0 if API doesn't return a value
  const itemCount = noofdiscount.itemdiscountcount ?? 0;
  const categoryCount = noofdiscount.categorydiscountcount ?? 0;
  const billCount = noofdiscount.billdiscountcount ?? 0;

  return (
    <div className="discount-main">
      <div
        className="discount-card"
        onClick={() => (window.location.href = "/ItemsDiscount")}
      >
        <h2>Item Discount</h2>
        <p>{itemCount} discounts available</p>
      </div>

      <div
        className="discount-card"
        onClick={() => (window.location.href = "/CategoryDiscount")}
      >
        <h2>Category Discount</h2>
        <p>{categoryCount} discounts available</p>
      </div>

      <div
        className="discount-card"
        onClick={() => (window.location.href = "/TotalBillDiscount")}
      >
        <h2>Total Bill Discount</h2>
        <p>{billCount} discounts available</p>
      </div>
    </div>
  );
};

export default DiscountOffer;
