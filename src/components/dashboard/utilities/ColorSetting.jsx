import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";

export default function ColorSetting({ color, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Cierra el picker si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="div-color" style={{ position: "relative" }}>
      <div
        className="btn-color"
        style={{
          backgroundColor: color || "#ffffff",
          cursor: "pointer",
        }}
        onClick={() => setShowPicker(!showPicker)}
      ></div>

      <input
        type="text"
        className="form-control form-control-sm border-0 input-color"
        value={color || "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
      />

      {showPicker && (
        <div
          ref={pickerRef}
          style={{
            position: "absolute",
            top: "40px",
            left: "0",
            zIndex: 999,
            transform: "translateX(-90%)",
          }}
        >
          <SketchPicker
            color={color}
            onChange={(updated) => onChange(updated.hex)}
          />
        </div>
      )}
    </div>
  );
}
