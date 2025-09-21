import React from "react";
import Select from "react-select";
import Barcode from "react-barcode";

const ProductRow = ({
  row,
  index,
  handleChange,
  categoryOptions,
  supplierOptions,
  setShowModal,
  unitOptions, // ✅ add this
}) => {
  return (
    <tr>
      <td data-label="#">{index + 1}</td>
      <td data-label="Item Code">
        <input
          type="text"
          value={row.code}
          onChange={(e) => handleChange(index, "code", e.target.value)}
        />
      </td>
      <td data-label="Product Name">
        <input
          type="text"
          value={row.name}
          onChange={(e) => handleChange(index, "name", e.target.value)}
        />
      </td>
      <td className="select">
        <Select
          options={categoryOptions}
          value={
            categoryOptions.find((opt) => opt.value === row.category) || null
          }
          onChange={(option) => {
            if (option.value === "add_new") setShowModal(true);
            else handleChange(index, "category", option.value);
          }}
          placeholder="Select Category"
          isSearchable
          menuPortalTarget={document.body}
        />
      </td>
      <td className="select">
        <Select
          options={supplierOptions.filter((opt) => opt.value !== "add_new")}
          value={
            row.supplier
              ? supplierOptions.find((opt) => opt.value === row.supplier)
              : null
          }
          onChange={(option) => handleChange(index, "supplier", option.value)}
          placeholder="Select Supplier"
          isSearchable
          menuPortalTarget={document.body}
        />
      </td>
      <td data-label="Cost Price">
        <input
          type="number"
          value={row.cost_price}
          onChange={(e) => handleChange(index, "cost_price", e.target.value)}
        />
      </td>
      <td data-label="QTY">
        <input
          type="number"
          value={row.qty}
          onChange={(e) => handleChange(index, "qty", e.target.value)}
        />
      </td>
      <td data-label="Unit">
        <select
          value={row.unit || ""}
          onChange={(e) => handleChange(index, "unit", e.target.value)}
        >
          <option value="">Select Unit</option>
          {unitOptions.map((unit) => (
            <option key={unit.value} value={unit.value}>
              {unit.label}
            </option>
          ))}
        </select>
      </td>
      <td data-label="Sale Price">
        <input
          type="number"
          value={row.sale_price}
          onChange={(e) => handleChange(index, "sale_price", e.target.value)}
        />
      </td>
      <td data-label="Total Price">
        <input
          type="number"
          value={(
            parseFloat(row.sale_price || 0) * parseInt(row.qty || 0)
          ).toFixed(2)}
          readOnly
        />
      </td>
      <td data-label="Expiry">
        <input
          type="date"
          value={row.expiry}
          onChange={(e) => handleChange(index, "expiry", e.target.value)}
        />
      </td>
      <td data-label="Barcode">
        {row.code ? (
          <div id={`barcode-${row.code}`} style={{ textAlign: "center" }}>
            <Barcode
              value={row.code}
              width={0.6}
              height={30}
              fontSize={10}
              margin={0}
            />
            <button
              className="print-btn mt-2"
              onClick={() => {
                const barcodeElement = document.querySelector(
                  `#barcode-${row.code} svg`
                );
                if (!barcodeElement) return alert("Barcode not found!");
                const printWindow = window.open(
                  "",
                  "PRINT",
                  "height=400,width=600"
                );
                printWindow.document.write(barcodeElement.outerHTML);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
              }}
            >
              Print
            </button>
          </div>
        ) : (
          <span>No Barcode</span>
        )}
      </td>
    </tr>
  );
};

export default ProductRow;
