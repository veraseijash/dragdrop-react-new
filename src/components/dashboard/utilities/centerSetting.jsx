import btnLeft from "../../../assets/images/btn-left.svg";
import btnCenter from "../../../assets/images/btn-center.svg";
import btnRight from "../../../assets/images/btn-right.svg";

export default function AlignSetting({
  value = "center",
  onChange,
  name = "margin",
  label = "Alinear",
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
            <img src={btnLeft} alt="left" />
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
            <img src={btnCenter} alt="center" />
          </label>

          {/* BOTTOM */}
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
            <img src={btnRight} alt="right" />
          </label>
        </div>
      </div>
    </div>
  );
}
