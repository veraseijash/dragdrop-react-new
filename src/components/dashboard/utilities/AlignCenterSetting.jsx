export default function AlignSetting({
  value = "center",
  onChange,
  name = "textAlign",
  label = "Alinear",
  showJustify = true,
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
          {/* LEFT */}
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={`${name}-left`}
            autoComplete="off"
            checked={value === "left"}
            onChange={() => onChange("left")}
          />
          <label
            className="btn btn-outline-primary"
            htmlFor={`${name}-left`}
          >
            <span className="ico ico-paragraph-left"/>
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
            <span className="ico ico-paragraph-center"/>
          </label>

          {/* JUSTIFY */}
          {showJustify && (
            <>
              <input
                type="radio"
                className="btn-check"
                name={name}
                id={`${name}-justify`}
                autoComplete="off"
                checked={value === "justify"}
                onChange={() => onChange("justify")}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor={`${name}-center`}
              >
                <span className="ico ico-paragraph-justify"/>
              </label>
            </>
          )}

          {/* RIGHT */}
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={`${name}-right`}
            autoComplete="off"
            checked={value === "right"}
            onChange={() => onChange("right")}
          />
          <label
            className="btn btn-outline-primary"
            htmlFor={`${name}-right`}
          >
            <span className="ico ico-paragraph-right"/>
          </label>
        </div>
      </div>
    </div>
  )
}