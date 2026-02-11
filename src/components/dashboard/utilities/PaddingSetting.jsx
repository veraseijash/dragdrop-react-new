import NumberStepper from "../utilities/NumberStepper";

export default function PaddingSetting({ style = {}, onChange }) {
  const getNumber = (value) => {
    if (!value) return 0;
    return parseInt(value, 10); // "20px" -> 20
  };

  const updatePadding = (key, value) => {
    onChange({
      ...style,
      [key]: `${value}px`, // 20 -> "20px"
    });
  };

  return (
    <div className="content-setting-dos">
      <div className="content-col-column">
        <label>Arriba</label>
        <NumberStepper
          value={getNumber(style.paddingTop)}
          step={5}
          min={0}
          max={60}
          onChange={(value) => updatePadding("paddingTop", value)}
        />

        <label className="mt-2">Abajo</label>
        <NumberStepper
          value={getNumber(style.paddingBottom)}
          step={5}
          min={0}
          max={60}
          onChange={(value) => updatePadding("paddingBottom", value)}
        />
      </div>

      <div className="content-col-column">
        <label>Derecha</label>
        <NumberStepper
          value={getNumber(style.paddingRight)}
          step={5}
          min={0}
          max={60}
          onChange={(value) => updatePadding("paddingRight", value)}
        />

        <label className="mt-2">Izquierda</label>
        <NumberStepper
          value={getNumber(style.paddingLeft)}
          step={5}
          min={0}
          max={60}
          onChange={(value) => updatePadding("paddingLeft", value)}
        />
      </div>
    </div>
  );
}
