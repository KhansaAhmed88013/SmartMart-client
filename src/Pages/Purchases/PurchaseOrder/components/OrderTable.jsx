import React from "react";

function OrderTable({ orderItems = [], onUpdateItem, onRemoveItem }) {
  return (
    <div className="order-table-container">
      {orderItems.length === 0 ? (
        <p className="order-empty">No items in the order.</p>
      ) : (
        <table className="order-table">
          <thead className="order-table-head">
            <tr>
              <th className="order-col order-col-product">Product</th>
              <th className="order-col order-col-qty">Qty</th>
              <th className="order-col order-col-price">Cost Price</th>
              <th className="order-col order-col-total">Total</th>
              <th className="order-col order-col-action">Action</th>
            </tr>
          </thead>
          <tbody className="order-table-body">
            {orderItems.map((item, index) => (
              <tr key={index} className="order-row">
                <td className="order-cell order-cell-product">{item.name}</td>
                <td className="order-cell order-cell-qty">
                  <input
                    className="order-input order-input-qty"
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      onUpdateItem(index, "quantity", Number(e.target.value))
                    }
                  />
                </td>
                <td className="order-cell order-cell-price">
                  <input
                    className="order-input order-input-price"
                    type="number"
                    value={item.price}
                    min="0"
                    onChange={(e) =>
                      onUpdateItem(index, "price", Number(e.target.value))
                    }
                  />
                </td>
                <td className="order-cell order-cell-total">
                  {(item.quantity * item.price).toFixed(2)}
                </td>
                <td className="order-cell order-cell-action">
                  <button
                    className="btn btn-remove"
                    onClick={() => onRemoveItem(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderTable;
