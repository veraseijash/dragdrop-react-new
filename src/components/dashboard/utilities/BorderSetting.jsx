import { useEffect } from "react";
import ColorSetting from "../utilities/ColorSetting";
import NumberStepper from "../utilities/NumberStepper";

const SIDES = [
  { key: "Top", label: "Tope" },
  { key: "Right", label: "Derecha" },
  { key: "Bottom", label: "Abajo" },
  { key: "Left", label: "Izquierda" },
];

export default function BorderSetting({ border, setBorder }) {

  // Inicializar estilos si no existen
  useEffect(() => {
    const style = border?.style || {};
    const nextStyle = {};
    let hasChange = false;

    SIDES.forEach(({ key }) => {
      const styleKey = `border${key}`;

      if (!style[`${styleKey}Style`]) {
        nextStyle[`${styleKey}Style`] = "solid";
        hasChange = true;
      }

      if (!style[`${styleKey}Width`]) {
        nextStyle[`${styleKey}Width`] = "0px";
        hasChange = true;
      }

      if (!style[`${styleKey}Color`]) {
        nextStyle[`${styleKey}Color`] = "transparent";
        hasChange = true;
      }
    });

    if (!hasChange) return;

    setBorder((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        ...nextStyle,
      },
    }));
  }, [border, setBorder]);

  const updateStyle = (key, prop, value) => {
    setBorder((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        [`border${key}${prop}`]: value,
      },
    }));
  };

  return (
    <div className="mt-2">
      {SIDES.map(({ key, label }) => {
        const width = parseInt(border?.style?.[`border${key}Width`] || 0, 10);

        return (
          <div key={key} className="div-border">
            <label>{label}</label>

            <div className="border-controls">
              {/* Tipo */}
              <select
                className="form-control form-select-sm"
                value={border?.style?.[`border${key}Style`]}
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
                color={border?.style?.[`border${key}Color`]}
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
