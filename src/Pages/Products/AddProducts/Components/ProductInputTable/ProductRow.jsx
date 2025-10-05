import React, { useRef, forwardRef, useImperativeHandle } from "react";
import Select from "react-select";
import Barcode from "react-barcode";

const ProductRow = forwardRef(({
  row,
  index,
  handleChange,
  categoryOptions,
  supplierOptions,
  setShowModal,
  unitOptions,
  focusNextRow,
}, ref) => {
  const inputRefs = useRef([]);

 useImperativeHandle(ref, () => ({
  focusItemCode: () => {
    inputRefs.current[0]?.focus();
    inputRefs.current[0]?.select?.();
  },
  focusNextInput: () => {
    inputRefs.current[1]?.focus(); // Product Name input
    inputRefs.current[1]?.select?.();
  }
}));


  const handleEnterKey = (e, inputIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputIndex === 9) {
        focusNextRow(index);
        return;
      }
      const nextInput = inputRefs.current[inputIndex + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select?.();
      }
    }
  };

  return (
   <tr>
      <td>{index + 1}</td>
      <td>
        <input
          type="text"
          value={row.code}
          onChange={(e) => handleChange(index, "code", e.target.value)}
          ref={(el) => (inputRefs.current[0] = el)}
          onKeyDown={(e) => handleEnterKey(e, 0)}
        />
      </td>

      <td data-label="Product Name">
        <input
          type="text"
          value={row.name}
          onChange={(e) => handleChange(index, "name", e.target.value)}
          ref={(el) => (inputRefs.current[1] = el)}
          onKeyDown={(e) => handleEnterKey(e, 1)}
        />
      </td>

     <td className="select">
  <Select
    options={categoryOptions}
    value={categoryOptions.find((opt) => opt.value === row.category) || null}
    onChange={(option) => {
      if (option.value === "add_new") {
        setShowModal(true);
      } else {
        handleChange(index, "category", option.value);
        // Move focus to next input after selection
        const nextInput = inputRefs.current[3]; // supplier input
        if (nextInput) {
          if (nextInput.focus) nextInput.focus();
          if (nextInput.select) nextInput.select();
        }
      }
    }}
    placeholder="Select Category"
    isSearchable
    menuPortalTarget={document.body}
    ref={(el) => (inputRefs.current[2] = el)}
  />
</td>


<td className="select">
  <Select
    options={supplierOptions.filter((opt) => opt.value !== "add_new")}
    value={row.supplier ? supplierOptions.find((opt) => opt.value === row.supplier) : null}
    onChange={(option) => {
      handleChange(index, "supplier", option.value);
      // move to next input (Cost Price)
      const nextInput = inputRefs.current[4];
      if (nextInput) {
        if (nextInput.focus) nextInput.focus();
        if (nextInput.select) nextInput.select();
      }
    }}
    placeholder="Select Supplier"
    isSearchable
    menuPortalTarget={document.body}
    ref={(el) => (inputRefs.current[3] = el)}
  />
</td>


      <td data-label="Cost Price">
        <input
          type="number"
          value={row.cost_price}
          onChange={(e) => handleChange(index, "cost_price", e.target.value)}
          ref={(el) => (inputRefs.current[4] = el)}
          onKeyDown={(e) => handleEnterKey(e, 4)}
        />
      </td>

      <td data-label="QTY">
        <input
          type="number"
          value={row.qty}
          onChange={(e) => handleChange(index, "qty", e.target.value)}
          ref={(el) => (inputRefs.current[5] = el)}
          onKeyDown={(e) => handleEnterKey(e, 5)}
        />
      </td>

      <td data-label="Unit">
        <select
          value={row.unit || ""}
          onChange={(e) => handleChange(index, "unit", e.target.value)}
          ref={(el) => (inputRefs.current[6] = el)}
          onKeyDown={(e) => handleEnterKey(e, 6)}
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
          ref={(el) => (inputRefs.current[7] = el)}
          onKeyDown={(e) => handleEnterKey(e, 7)}
        />
      </td>

      <td data-label="Total Price">
        <input
          type="number"
          value={(
            parseFloat(row.sale_price || 0) * parseInt(row.qty || 0)
          ).toFixed(2)}
          readOnly
          ref={(el) => (inputRefs.current[8] = el)}
          onKeyDown={(e) => handleEnterKey(e, 8)}
        />
      </td>

      <td>
        <input
          type="date"
          value={row.expiry}
          onChange={(e) => handleChange(index, "expiry", e.target.value)}
          ref={(el) => (inputRefs.current[9] = el)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              focusNextRow(index);
            }
          }}
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
});

export default ProductRow;
