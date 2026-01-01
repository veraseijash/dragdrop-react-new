import { FontFamily } from "../../../data/FontFamily";

export default function FontFamilySetting({ value, onChange }) {
  return (
    <select
      className="form-select form-select-sm"
      aria-label="Font family selector"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Seleccionar fuente...</option>

      {FontFamily.map((font, index) => (
        <option 
          key={index} 
          value={font.content}
          style={{ fontFamily: font.content }}
        >
          {font.label}
        </option>
      ))}
    </select>
  );
}