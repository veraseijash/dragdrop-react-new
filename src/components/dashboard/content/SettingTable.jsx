import NumberStepper from "../utilities/NumberStepper";
import ColorSetting from "../utilities/ColorSetting";
import AlignCenterSetting from "../utilities/AlignCenterSetting";
import PaddingSetting from "../utilities/PaddingSetting";

export default function SettingTable({ content, onUpdate }) {
  const colNumber = content.content.heads[0].cols.length;
  const rowNumber = content.content.rows.length;

  const borderStyle = content.content.headStyle.borderStyle || "solid";
  const borderWidth = parseInt(content.content.headStyle.borderWidth, 10) || 1;
  const borderColor = content.content.headStyle.borderColor || "#DDDDDD";

  const adjustCols = (cols, newLength) => {
    const result = [...cols];

    if (newLength > result.length) {
      while (result.length < newLength) result.push("");
    } else if (newLength < result.length) {
      result.length = newLength;
    }

    return result;
  };

  const handleChangeColumns = (val) => {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        heads: content.content.heads.map(head => ({
          ...head,
          cols: adjustCols(head.cols, val),
        })),
        rows: content.content.rows.map(row => ({
          ...row,
          cols: adjustCols(row.cols, val),
        })),
      },
    });
  };

  const handleChangeRows = (val) => {
    const colCount = content.content.heads[0].cols.length;
    let newRows = [...content.content.rows];

    if (val > newRows.length) {
      while (newRows.length < val) {
        newRows.push({ cols: Array(colCount).fill("") });
      }
    } else {
      newRows = newRows.slice(0, val);
    }

    onUpdate({
      ...content,
      content: {
        ...content.content,
        rows: newRows,
      },
    });
  };

  const handleChangeBorderStyle = (e) => {
    const value = e.target.value;

    onUpdate({
      ...content,
      content: {
        ...content.content,
        headStyle: {
          ...content.content.headStyle,
          borderStyle: value,
        },
        colStyle: {
          ...content.content.colStyle,
          borderStyle: value,
        },
      },
    });
  };

  const handleChangeBorderWidth = (value) => {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        headStyle: {
          ...content.content.headStyle,
          borderWidth: `${value}px`,
        },
        colStyle: {
          ...content.content.colStyle,
          borderWidth: `${value}px`,
        },
      },
    });
  };

  const handleChangeBorderColor = (value) => {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        headStyle: {
          ...content.content.headStyle,
          borderColor: value,
        },
        colStyle: {
          ...content.content.colStyle,
          borderColor: value,
        },
      },
    });
  };

  const fontSizeNumber = parseInt(
    content?.content?.headStyle?.fontSize || "14",
    10
  );
  const fontSizeNumberContent = parseInt(
    content?.content?.colStyle?.fontSize || "14",
    10
  );

  return (
    <div className="row-setting-content accordion-scroll">
      <div className="accordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button accordion-zero-rounded"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
            >
              Disposición
            </button>
          </h2>

          <div id="collapseOne" className="accordion-collapse collapse show">
            <div className="accordion-body p-0">

              <div className="content-setting-dos border-bottom-0">
                <div className="content-col">Columnas</div>
                <div className="content-col">
                  <NumberStepper
                    value={colNumber}
                    step={1}
                    min={1}
                    max={10}
                    onChange={handleChangeColumns}
                  />
                </div>
              </div>

              <div className="content-setting-dos pt-0">
                <div className="content-col">Filas</div>
                <div className="content-col">
                  <NumberStepper
                    value={rowNumber}
                    step={1}
                    min={1}
                    max={10}
                    onChange={handleChangeRows}
                  />
                </div>
              </div>
              <div className="mt-2">
                <div className="div-border">
                  <div>Borde</div>
                  <div className="border-controls">
                    <select
                      className="form-control form-select-sm"
                      value={borderStyle}
                      onChange={handleChangeBorderStyle}
                    >
                      <option value="solid">Sólida</option>
                      <option value="dashed">Discontinua</option>
                      <option value="dotted">Punteada</option>
                      <option value="double">Doble</option>
                    </select>

                    <NumberStepper
                      value={borderWidth}
                      step={1}
                      min={0}
                      max={30}
                      onChange={handleChangeBorderWidth}
                    />

                    <ColorSetting
                      color={borderColor}
                      onChange={handleChangeBorderColor}
                    />
                  </div>
                </div>
              </div>
              <div className="content-setting-dos border-bottom-0 pt-0">
                <div className="content-col">
                  Color de fondo
                </div>
                <div className="content-col">
                  <ColorSetting
                    color={content?.preStyle?.backgroundColor || "transparent"}
                    onChange={(val) => {
                      onUpdate({
                        ...content,
                        preStyle: {
                          ...content.preStyle,
                          backgroundColor: val,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="ms-2 mt-2">Relleno del área de la tabla</div>
              <PaddingSetting
                style={content.preStyle}
                onChange={(newStyle) => {
                  onUpdate({
                    ...content,
                    preStyle: {
                      ...content.preStyle,
                      ...newStyle,
                    },
                  });
                }}
              />
              <div className="ms-2 mt-2">Margen de la tabla</div>
              <PaddingSetting
                style={content.outerStyle}
                onChange={(newStyle) => {
                  onUpdate({
                    ...content,
                    outerStyle: {
                      ...content.outerStyle,
                      ...newStyle,
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
          <h2 className="accordion-header" id="headingTwo">
            <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
              Encabezado
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse show">
            <div className="accordion-body p-0">
              <div className="content-setting-dos">
                <div className="content-col">
                  Fila de encabezado
                </div>
                <div className="content-col">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={content?.activeHeads ?? true}
                      onChange={(e) => {
                        onUpdate({
                          ...content,
                          activeHeads: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              {content?.activeHeads && (
                <>
                  <div className="content-setting-dos border-bottom-0">
                    <div className="content-col">
                      Color de fondo
                    </div>
                    <div className="content-col">
                      <ColorSetting
                        color={content?.content?.headStyle?.backgroundColor || "transparent"}
                        onChange={(val) => {
                          onUpdate({
                            ...content,
                            content: {
                              ...content.content,
                              headStyle: {
                                ...content.content.headStyle,
                                backgroundColor: val,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="content-setting-dos border-bottom-0 pt-0">
                    <div className="content-col">
                      Color del texto
                    </div>
                    <div className="content-col">
                      <ColorSetting
                        color={content?.content?.headStyle?.color || "transparent"}
                        onChange={(val) => {
                          onUpdate({
                            ...content,
                            content: {
                              ...content.content,
                              headStyle: {
                                ...content.content.headStyle,
                                color: val,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="content-setting-dos border-bottom-0 pt-0">
                    <div className="content-col">
                      Grosor de fuente
                    </div>
                    <div className="content-col">
                      <select
                        className="form-select"
                        value={content?.content?.headStyle?.fontWeight || "400"}
                        onChange={(e) => {
                          onUpdate({
                            ...content,
                            content: {
                              ...content.content,
                              headStyle: {
                                ...content.content.headStyle,
                                fontWeight: e.target.value,
                              },
                            },
                          });
                        }}
                      >
                        <option value="400">Regular</option>
                        <option value="700">Negrita</option>
                      </select>
                    </div>
                  </div>
                  <div className="content-setting-dos border-bottom-0 pt-0">
                    <div className="content-col">
                      Tamaño de fuente
                    </div>
                    <div className="content-col" style={{width: "120px"}}>
                      <NumberStepper
                        value={fontSizeNumber}
                        step={1}
                        min={1}
                        max={200}
                        onChange={(val) => {
                          onUpdate({
                            ...content,
                            content: {
                              ...content.content,
                              headStyle: {
                                ...content.content.headStyle,
                                fontSize: `${val}px`,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <AlignCenterSetting
                    value={content?.content?.headStyle?.textAlign}
                    name={`align-1`}
                    onChange={(val) => {
                      onUpdate({
                        ...content,
                        content: {
                          ...content.content,
                          headStyle: {
                            ...content.content.headStyle,
                            textAlign: val,
                          },
                        },
                      });
                    }}
                  />   
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="accordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
              Contenido
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse show">
            <div className="accordion-body p-0">
              <div className="content-setting-dos border-bottom-0">
                <div className="content-col">
                  Color de fondo
                </div>
                <div className="content-col">
                  <ColorSetting
                    color={content?.content?.colStyle?.backgroundColor || "transparent"}
                    onChange={(val) => {
                      onUpdate({
                        ...content,
                        content: {
                          ...content.content,
                          colStyle: {
                            ...content.content.colStyle,
                            backgroundColor: val,
                          },
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="content-setting-dos border-bottom-0 pt-0">
                <div className="content-col">
                  Color del texto
                </div>
                <div className="content-col">
                  <ColorSetting
                    color={content?.content?.colStyle?.color || "transparent"}
                    onChange={(val) => {
                      onUpdate({
                        ...content,
                        content: {
                          ...content.content,
                          colStyle: {
                            ...content.content.colStyle,
                            color: val,
                          },
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="content-setting-dos border-bottom-0 pt-0">
                <div className="content-col">
                  Grosor de fuente
                </div>
                <div className="content-col">
                  <select
                    className="form-select"
                    value={content?.content?.colStyle?.fontWeight || "400"}
                    onChange={(e) => {
                      onUpdate({
                        ...content,
                        content: {
                          ...content.content,
                          colStyle: {
                            ...content.content.colStyle,
                            fontWeight: e.target.value,
                          },
                        },
                      });
                    }}
                  >
                    <option value="400">Regular</option>
                    <option value="700">Negrita</option>
                  </select>
                </div>
              </div>
              <div className="content-setting-dos border-bottom-0 pt-0">
                <div className="content-col">
                  Tamaño de fuente
                </div>
                <div className="content-col" style={{width: "120px"}}>
                  <NumberStepper
                    value={fontSizeNumberContent}
                    step={1}
                    min={1}
                    max={200}
                    onChange={(val) => {
                      onUpdate({
                        ...content,
                        content: {
                          ...content.content,
                          colStyle: {
                            ...content.content.colStyle,
                            fontSize: `${val}px`,
                          },
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <AlignCenterSetting
                value={content?.content?.colStyle?.textAlign}
                name={`align-2`}
                onChange={(val) => {
                  onUpdate({
                    ...content,
                    content: {
                      ...content.content,
                      colStyle: {
                        ...content.content.colStyle,
                        textAlign: val,
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
  );
}
