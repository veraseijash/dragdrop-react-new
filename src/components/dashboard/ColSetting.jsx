import ColorSetting from "../../components/dashboard/utilities/ColorSetting";
import NumberStepper from "../../components/dashboard/utilities/NumberStepper";
import BorderSetting from "../../components/dashboard/utilities/BorderSetting";
import PaddingSetting from "./utilities/PaddingSetting";
import AlignSetting from "./utilities/AlignSetting";

export default function ColSetting({
  col,
  index,
  onDelete,
  onChange,
}) {
  if (!col) return null;
  return (
    <div className="col-setting">
      <div className="content-setting-dos">
        <div>Columna {index + 1}</div>        
        <button
          className="btn btn-link btn-sm text-danger text-decoration-none pb-0"
          style={{ fontSize: "12px" }}
          onClick={() => onDelete(index)}
        >
          <i className="bi bi-trash me-2"></i>
          Eliminar
        </button>
      </div>
      <div className="content-setting-dos">
        <div className="content-col">Fondo de la columna</div>
        <div className="content-col">
          <ColorSetting
            color={col.style.backgroundColor}
            onChange={(newColor) =>
              onChange(index, {
                ...col,
                style: {
                  ...col.style,
                  backgroundColor: newColor,
                },
              })
            }
          />
        </div>
      </div>
      <AlignSetting
        value={col.style?.justifyContent || "flex-start"}
        name={`col-justify-${col.id}`}
        onChange={(newValue) => {
          onChange(index, {
            ...col,
            style: {
              ...col.style,
              justifyContent: newValue,
            },
          });
        }}
      />
      <div className="ms-2 mt-2">Relleno del área de la columna</div>
      <PaddingSetting
        style={col.style}
        onChange={(newStyle) => {
          onChange(index, {
            ...col,
            style: {
              ...col.style,
              ...newStyle,
            },
          });
        }}
      />
      <div className="p-2">Bordes de la columna</div>
      <BorderSetting
        style={col.style || {}}
        setStyle={(updater) => {
          const newStyle =
            typeof updater === "function"
              ? updater(col.style || {})
              : updater;

          onChange(index, {
            ...col,
            style: {
              ...col.style,
              ...newStyle,
            },
          });
        }}
      />

    </div>
  )
}