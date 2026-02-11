import { useEffect } from "react";
import ColorSetting from "../utilities/ColorSetting";
import NumberStepper from "../utilities/NumberStepper";

const SIDES = [
  { key: "Top", label: "Tope" },
  { key: "Right", label: "Derecha" },
  { key: "Bottom", label: "Abajo" },
  { key: "Left", label: "Izquierda" },
];

export default function BorderSetting({ style = {}, setStyle }) {

  // Inicializar valores por defecto
  useEffect(() => {
    const nextStyle = {};
    let hasChange = false;

    SIDES.forEach(({ key }) => {
      const base = `border${key}`;

      if (!style[`${base}Style`]) {
        nextStyle[`${base}Style`] = "solid";
        hasChange = true;
      }

      if (!style[`${base}Width`]) {
        nextStyle[`${base}Width`] = "0px";
        hasChange = true;
      }

      if (!style[`${base}Color`]) {
        nextStyle[`${base}Color`] = "transparent";
        hasChange = true;
      }
    });

    if (!hasChange) return;

    setStyle((prev) => ({
      ...prev,
      ...nextStyle,
    }));
  }, [style, setStyle]);

  const updateStyle = (key, prop, value) => {
    setStyle((prev) => ({
      ...prev,
      [`border${key}${prop}`]: value,
    }));
  };

  return (
    <div className="mt-2">
      {SIDES.map(({ key, label }) => {
        const width = parseInt(style[`border${key}Width`] || 0, 10);

        return (
          <div key={key} className="div-border">
            <label>{label}</label>

            <div className="border-controls">
              {/* Tipo */}
              <select
                className="form-control form-select-sm"
                value={style[`border${key}Style`]}
                onChange={(e) =>
                  updateStyle(key, "Style", e.target.value)
                }
              >
                <option value="solid">Sólida</option>
                <option value="dashed">Discontinua</option>
                <option value="dotted">Punteada</option>
                <option value="double">Doble</option>
              </select>

              {/* Grosor */}
              <NumberStepper
                value={width}
                step={1}
                min={0}
                max={30}
                onChange={(val) =>
                  updateStyle(key, "Width", `${val}px`)
                }
              />

              {/* Color */}
              <ColorSetting
                color={style[`border${key}Color`]}
                onChange={(color) =>
                  updateStyle(key, "Color", color)
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
