export default function AlignSetting({
  value = "flex-start",
  onChange,
  name = "justify-content",
  label = "Alineación vertical",
}) {
  return (
    <div className="content-setting-dos">
      <div className="content-col">
        {label}
      </div>

      <div className="content-col">
        <div
          className="btn-group"
          role="group"
          aria-label={label}
        >
          {/* TOP */}
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={`${name}-start`}
            autoComplete="off"
            checked={value === "flex-start"}
            onChange={() => onChange("flex-start")}
          />
          <label
            className="btn btn-outline-primary"
            htmlFor={`${name}-start`}
          >
            <i className="bi bi-align-top"></i>
          </label>

          {/* CENTER */}
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={`${name}-center`}
            autoComplete="off"
            checked={value === "center"}
            onChange={() => onChange("center")}
          />
          <label
            className="btn btn-outline-primary"
            htmlFor={`${name}-center`}
          >
            <i className="bi bi-distribute-vertical"></i>
          </label>

          {/* BOTTOM */}
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={`${name}-end`}
            autoComplete="off"
            checked={value === "flex-end"}
            onChange={() => onChange("flex-end")}
          />
          <label
            className="btn btn-outline-primary"
            htmlFor={`${name}-end`}
          >
            <i className="bi bi-align-bottom"></i>
          </label>
        </div>
      </div>
    </div>
  );
}
