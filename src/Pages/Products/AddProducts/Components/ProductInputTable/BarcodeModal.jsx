import React, { useEffect } from "react";
import Barcode from "react-barcode";

const BarcodeModal = ({ open, setOpen, code, setCode, handleSubmit }) => {
  useEffect(() => {
    if (open) {
      const randomCode = Math.floor(100000000 + Math.random() * 900000000).toString();
      setCode(randomCode);
    }
  }, [open, setCode]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setOpen(false)}>
      <div className="modal-content">
        <div className="p-4">
          <h2 className="text-lg font-bold">Barcode Generator</h2>
          <div className="mt-4">
            {code && (
              <>
                <p className="mb-2">Generated Code: {code}</p>
                <Barcode value={code} />
              </>
            )}
          </div>
        </div>
        <button onClick={handleSubmit} className="close-btn">Submit</button>
      </div>
    </div>
  );
};

export default BarcodeModal;
