import { useState } from "react";

export default function RangeSetting({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  unit = "",
  onChange,
  id
}) {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange && onChange(newValue); // retorna valor al padre
  };

  return (
    <div className="content-setting">
      <div className="d-flex justify-content-between align-items-center">
        <label htmlFor={id} className="form-label mb-0">
          {label}
        </label>

        <span className="text-muted" style={{ fontSize: "0.8rem" }}>
          {internalValue} {unit}
        </span>
      </div>

      <input
        type="range"
        className="form-range mt-2"
        id={id}
        min={min}
        max={max}
        step={step}
        value={internalValue}
        onChange={handleChange}
      />
    </div>
  );
}
