import NumberStepper from "../utilities/NumberStepper"

export default function PaddingSetting({ style = {}, onChange }) {
  const updatePadding = (key, value) => {
    onChange({
      ...style,
      [key]: value,
    });
  };

  return (
    <div className="content-setting-dos">
      <div className="content-col-column">
        <label>Arriba</label>
        <NumberStepper
          value={style.paddingTop || 0}
          step={5}
          min={0}
          max={60}
          onChange={(value) => updatePadding("paddingTop", value)}
        />

        <label className="mt-2">Abajo</label>
        <NumberStepper
          value={style.paddingBottom || 0}
          step={5}
          min={0}
          max={60}
          onChange={(value) => updatePadding("paddingBottom", value)}
        />
      </div>

      <div className="content-col-column">
        <label>Derecha</label>
        <NumberStepper
          value={style.paddingRight || 0}
          step={5}
          min={0}
          max={60}
          onChange={(value) => updatePadding("paddingRight", value)}
        />

        <label className="mt-2">Izquierda</label>
        <NumberStepper
          value={style.paddingLeft || 0}
          step={5}
          min={0}
          max={60}
          onChange={(value) => updatePadding("paddingLeft", value)}
        />
      </div>
    </div>
  );
}
