import React from "react";

export default function NumberStepper({
  value = 0,
  step = 1,
  min = 0,
  max = Infinity,
  onChange,
  disabled = false,
}) {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange?.(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange?.(newValue);
  };

  return (
    <div className="input-group" style={{ maxWidth: "180px" }}>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        style={{minHeight: '32px'}}
        onClick={handleDecrease}
        disabled={disabled || value <= min}
      >
        −
      </button>

      <input
        type="text"
        className="form-control form-control-sm text-center"
        style={{minHeight: '32px'}}
        value={value}
        readOnly
      />

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        style={{minHeight: '32px'}}
        onClick={handleIncrease}
        disabled={disabled || value >= max}
      >
        +
      </button>
    </div>
  );
}
