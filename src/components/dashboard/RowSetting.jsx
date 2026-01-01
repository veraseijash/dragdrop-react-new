import { useEffect, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import ColorSetting from "../../components/dashboard/utilities/ColorSetting";
import BorderSetting from "../../components/dashboard/utilities/BorderSetting";
import NumberStepper from "../../components/dashboard/utilities/NumberStepper";
import ColsSetting from "../../components/dashboard/ColsSetting";
import PaddingSetting from "./utilities/PaddingSetting";

export default function RowSetting({ row, onChangeRow, onDeleteRow, onCloneRow, onClose }) {
  console.log('row: ', row)
  const [colActive, setColActive] = useState(0);

  useEffect(() => {
    if (row?.cols?.length) {
      setColActive(0);
    }
  }, [row?.id]);
  useEffect(() => {
    if (!row) return;

    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    tooltipTriggerList.forEach((el) => {
      if (!el._tooltip) {
        el._tooltip = new bootstrap.Tooltip(el);
      }
    });
  }, [row]);

  if (!row) return null;

  return (
    <div className={`row-setting-panel ${row ? "open" : ""}`}>
      <div className="row-setting-header">
        <span>Propiedades de la fila</span>
        <div className="sidebar-title">
          <button
            className="btn-delete"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Eliminar"
            onClick={() => onDeleteRow(row.rowPosition)}
          >
            <i className="bi bi-trash"></i>
          </button>
          <button
            className="btn-clone"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Duplicar"
            onClick={() => onCloneRow(row)}
          >
            <i className="bi bi-copy"></i>
          </button>

          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
      </div>

      <div className="row-setting-content accordion-scroll ">
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Fondo de fila
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body p-0">
                <div className="content-setting-dos">
                  <div className="content-col">
                    Color de fondo
                  </div>
                  <div className="content-col">
                    <ColorSetting
                      color={row.template_list.style.backgroundColor}
                      onChange={(newColor) => {
                        onChangeRow({
                          ...row,
                          template_list: {
                            ...row.template_list,
                            style: {
                              ...row.template_list.style,
                              backgroundColor: newColor,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="content-setting-dos">
                  <div className="content-col">
                    Color de fondo del área de contenido
                  </div>
                  <div className="content-col">
                    <ColorSetting
                      color={row.style.backgroundColor}
                      onChange={(newColor) => {
                        onChangeRow({
                          ...row,
                          style: {
                            ...row.style,
                            backgroundColor: newColor,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                Bordes del área de contenido
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body p-0">
                <BorderSetting
                  border={row}
                  setBorder={(updater) => {
                    const updatedRow =
                      typeof updater === "function"
                        ? updater(row)
                        : updater;

                    onChangeRow({
                      ...row,
                      style: {
                        ...row.style,
                        ...updatedRow.style,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                Disposición
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
              <div className="ms-2 mt-2">Relleno del área de contenido</div>
              <PaddingSetting
                style={row.style}
                onChange={(newStyle) => {
                  onChangeRow({
                    ...row,
                    style: {
                      ...row.style,
                      ...newStyle,
                    },
                  });
                }}
              />
              <div className="ms-2 mt-2">Margen del área de contenido</div>
              <div className="content-setting-dos">
                <div className="content-col-column">
                  <label>Arriba</label>
                  <NumberStepper
                    value={row.template_list.style?.paddingTop || 0}
                    step={5}
                    min={0}
                    max={60}
                    onChange={(newPadding) => {
                      onChangeRow({
                        ...row,
                        template_list: {
                          ...row.template_list,
                          style: {
                            ...row.template_list.style,
                            paddingTop: newPadding,
                          },
                        },
                      });
                    }}
                  />
                  <label className="mt-2">Abajo</label>
                  <NumberStepper
                    value={row.template_list.style?.paddingBottom || 0}
                    step={5}
                    min={0}
                    max={60}
                    onChange={(newPadding) => {
                      onChangeRow({
                        ...row,
                        template_list: {
                          ...row.template_list,
                          style: {
                            ...row.template_list.style,
                            paddingBottom: newPadding,
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div className="content-col-column">
                  <label>Derecha</label>
                  <NumberStepper
                    value={row.template_list.style?.paddingRight || 0}
                    step={5}
                    min={0}
                    max={60}
                    onChange={(newPadding) => {
                      onChangeRow({
                        ...row,
                        template_list: {
                          ...row.template_list,
                          style: {
                            ...row.template_list.style,
                            paddingRight: newPadding,
                          },
                        },
                      });
                    }}
                  />
                  <label className="mt-2">Izquierdo</label>
                  <NumberStepper
                    value={row.template_list.style?.paddingLeft || 0}
                    step={5}
                    min={0}
                    max={60}
                    onChange={(newPadding) => {
                      onChangeRow({
                        ...row,
                        template_list: {
                          ...row.template_list,
                          style: {
                            ...row.template_list.style,
                            paddingLeft: newPadding,
                          },
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingFour">
              <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                Estructura de columnas
              </button>
            </h2>
            <div id="collapseFour" className="accordion-collapse collapse show" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
              <ColsSetting 
                cols={row.cols}
                colActive={colActive}
                setColActive={setColActive}
                setCols={(updater) => {
                  const updatedCols =
                    typeof updater === "function"
                      ? updater(row.cols)
                      : updater;

                  onChangeRow({
                    ...row,
                    cols: updatedCols,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
