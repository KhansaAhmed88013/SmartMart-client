import React from "react";
import { FaFilePdf } from "react-icons/fa";

export default function SummaryActions({
  calculateSubtotal,
  currency,
  supplier,
  orderItems,
  submitOrder,
}) {
  return (
    <div className="summary-actions">
      <div className="summary-total">
        <p className="summary-total-text">
          Total: <span className="currency">{currency}</span>
          <span className="amount">{calculateSubtotal().toFixed(2)}</span>
        </p>
      </div>

      <div className="summary-buttons">
        <button className="btn btn-export" onClick={() => window.print()}>
          <FaFilePdf /> Print / Export
        </button>
        <button
          className="btn btn-submit"
          disabled={!supplier || orderItems.length === 0}
          onClick={submitOrder}
        >
          Submit Purchase Order
        </button>
      </div>
    </div>
  );
}
