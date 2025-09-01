import React, { useRef, useState } from "react";
import { useSymbologyScanner } from "@use-symbology-scanner/react";

const BarcodeDetection = () => {
  const videoRef = useRef(null);
  const [scannedCode, setScannedCode] = useState("");

  // ✅ Hook called at top level of the component
  useSymbologyScanner(
    (barcode) => {
      setScannedCode(barcode);
      console.log("Scanned:", barcode);
    },
    {
      video: videoRef.current, // Pass the video element
    }
  );

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Barcode Scanner Demo</h2>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "400px", height: "300px", border: "1px solid #333" }}
      />
      <p>{scannedCode || "Show any barcode to the camera"}</p>
    </div>
  );
};

export default BarcodeDetection;
