import RangeSetting from "../utilities/RangeSetting";
import FontFamilySetting from "../utilities/FontFamilySetting";
import NumberStepper from "../utilities/NumberStepper";
import ColorSetting from "../utilities/ColorSetting";
import CenterSetting from "../utilities/centerSetting";
import PaddingSetting from "../utilities/PaddingSetting";
import BorderSetting from "../utilities/BorderSetting";

export default function SettingButton({ content, onUpdate }) {
  const { type, feature = {} } = content.content;
  const updateContent = (changes) => {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        ...changes,
      },
    });
  };
console.log('boton: ', content)
  const updateFeature = (changes) => {
    updateContent({
      feature: {
        ...feature,
        ...changes,
      },
    });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;

    const featureByType = {
      web: { href: "" },
      email: { mailTo: "", subject: "", body: "" },
      call: { tel: "" },
    };

    updateContent({
      type: newType,
      feature: featureByType[newType],
    });
  };

  const widthValue = content.content?.width;

  const width =
    typeof widthValue === "string" && widthValue.endsWith("%")
      ? parseInt(widthValue, 10)
      : 50;

  const handleWidthChange = (newValue) => {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        width: newValue,
      },
    });
  };

  const height = content.content?.height;

  const handleHeigthChange = (newValue) => {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        height: newValue,
      },
    });
  };

  const fontSizeNumber =
    typeof content?.style?.fontSize === "string"
      ? parseInt(content.style.fontSize, 10)
      : content?.style?.fontSize || 16;

  const letterSpacingNumber =
    typeof content?.style?.letterSpacing === "string"
      ? parseInt(content.style.letterSpacing, 10)
      : content?.style?.letterSpacing || 0;

  const borderRadioNumber =
    typeof content?.style?.borderRadius === "string"
      ? parseInt(content.style.borderRadius, 10)
      : content?.style?.borderRadius || 0;
  
  const handleStyleChange = (updater) => {
    const newStyle =
      typeof updater === "function"
        ? updater(content.style || {})
        : updater;

    onUpdate({
      ...content,
      style: {
        ...content.style,
        ...newStyle,
      },
    });
  };


  return (
    <>
      <div className="row-setting-content accordion-scroll">
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Acción
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show">
              <div className="accordion-body p-0">

                {/* ===== TIPO ===== */}
                <div className="content-setting-dos">
                  <div className="content-col">Tipo de link</div>
                  <div className="content-col">
                    <select
                      className="form-select"
                      value={type}
                      onChange={handleTypeChange}
                    >
                      <option value="web">Abrir página web</option>
                      <option value="email">Enviar correo</option>
                      <option value="call">Hacer una llamada</option>
                    </select>
                  </div>
                </div>

                {/* ===== WEB ===== */}
                {type === "web" && (
                  <div className="mt-2 p-2">
                    <div className="input-group mb-3">
                      <span className="input-group-text">URL</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://ejemplo.com"
                        value={feature.href || ""}
                        onChange={(e) => updateFeature({ href: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* ===== EMAIL ===== */}
                {type === "email" && (
                  <div className="mt-2 p-2">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Enviar a</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="correo@correo.com"
                        value={feature.mailTo || ""}
                        onChange={(e) =>
                          updateFeature({ mailTo: e.target.value })
                        }
                      />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text">Asunto</span>
                      <input
                        type="text"
                        className="form-control"
                        value={feature.subject || ""}
                        onChange={(e) =>
                          updateFeature({ subject: e.target.value })
                        }
                      />
                    </div>

                    <div className="input-group">
                      <span className="input-group-text">Cuerpo</span>
                      <textarea
                        className="form-control"
                        value={feature.body || ""}
                        onChange={(e) =>
                          updateFeature({ body: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* ===== CALL ===== */}
                {type === "call" && (
                  <div className="mt-2 p-2">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Teléfono</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="+56111111111"
                        value={feature.tel || ""}
                        onChange={(e) =>
                          updateFeature({ tel: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
                Opciones de botón
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse show">
              <div className="accordion-body p-0">
                <div className="content-setting-dos">
                  <div className="content-col">
                    Contenido
                  </div>
                  <div className="content-col">
                    <input
                      type="text"
                      className="form-control"
                      value={content?.content?.text || ""}
                      onChange={(e) => {
                        onUpdate({
                          ...content,
                          content: {
                            ...content.content,
                            text: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="content-setting-dos border-bottom-0">
                  <div className="content-col">
                    Fuente predeterminada
                  </div>
                  <div className="content-col">
                    <FontFamilySetting
                      value={content?.style?.fontFamily}
                      onChange={(newFont) => {
                        onUpdate({
                          ...content,
                          style: {
                            ...content.style,
                            fontFamily: newFont,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="content-setting-dos border-bottom-0">
                  <div className="content-col">
                    Grosor de fuente
                  </div>
                  <div className="content-col">
                    <select
                      className="form-select"
                      value={content?.style?.fontWeight || "400"}
                      onChange={(e) => {
                        onUpdate({
                          ...content,
                          style: {
                            ...content.style,
                            fontWeight: e.target.value,
                          },
                        });
                      }}
                    >
                      <option value="400">Regular</option>
                      <option value="700">Negrita</option>
                    </select>
                  </div>
                </div>
                <div className="content-setting-dos border-bottom-0">
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
                          style: {
                            ...content.style,
                            fontSize: `${val}px`,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="content-setting-dos border-bottom-0">
                  <div className="content-col">
                    Espaciado entre letras
                  </div>
                  <div className="content-col" style={{width: "120px"}}>
                    <NumberStepper
                      value={letterSpacingNumber}
                      step={1}
                      min={0}
                      max={100}
                      onChange={(val) => {
                        onUpdate({
                          ...content,
                          style: {
                            ...content.style,
                            letterSpacing: `${val}px`,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="content-setting-dos border-bottom-0">
                  <div className="content-col">
                    Color de fondo
                  </div>
                  <div className="content-col">
                    <ColorSetting
                      color={content?.style?.backgroundColor || "#7747FF"}
                      onChange={(val) => {
                        onUpdate({
                          ...content,
                          style: {
                            ...content.style,
                            backgroundColor: val,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="content-setting-dos border-bottom-0">
                  <div className="content-col">
                    Color del texto
                  </div>
                  <div className="content-col">
                    <ColorSetting
                      color={content?.style?.color || "#FFFFFF"}
                      onChange={(val) => {
                        onUpdate({
                          ...content,
                          style: {
                            ...content.style,
                            color: val,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="content-setting-dos border-bottom-0">
                  <div className="content-col">
                    Altura de línea
                  </div>
                  <div className="content-col">
                    <select
                      className="form-select"
                      value={content?.style?.lineHeight || "2"}
                      onChange={(e) => {
                        onUpdate({
                          ...content,
                          style: {
                            ...content.style,
                            lineHeight: e.target.value,
                          },
                        });
                      }}
                    >
                      <option value="1.2">1.2</option>
                      <option value="1.5">1.5</option>
                      <option value="1.8">1.8</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                </div>

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
            <div id="collapseThree" className="accordion-collapse collapse show">
              <div className="accordion-body p-0">
                <CenterSetting
                  value={content?.content?.align}
                  name={`margin-1`}
                  onChange={(val) => {
                    onUpdate({
                      ...content,
                      content: {
                        ...content.content,
                        align: val,
                      },
                    });
                  }}

                />
                <div className="ms-2 mt-2">Relleno del área de botón</div>
                <RangeSetting
                  id="botonWidth"
                  label="Ancho"
                  min={5}
                  max={100}
                  step={5}
                  value={width}
                  unit="%"
                  onChange={handleWidthChange}
                />
                <RangeSetting
                  id="botonWidth"
                  label="Alto"
                  min={20}
                  max={100}
                  step={1}
                  value={height}
                  unit="px"
                  onChange={handleHeigthChange}
                />
                <div className="ms-2 mt-2">Margen del botón</div>
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
                <div className="ms-2 mt-2">Bordes del botón</div>
                <BorderSetting
                  style={content.style || {}}
                  setStyle={handleStyleChange}
                />
                <div className="content-setting-dos">
                  <div className="content-col">
                    Radio del borde
                  </div>
                  <div className="content-col" style={{width: "120px"}}>
                    <NumberStepper
                      value={borderRadioNumber}
                      step={1}
                      min={0}
                      max={100}
                      onChange={(val) => {
                        onUpdate({
                          ...content,
                          style: {
                            ...content.style,
                            borderRadius: `${val}px`,
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
      </div>
    </>
  );
}
