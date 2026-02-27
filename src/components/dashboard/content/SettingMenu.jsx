import { useState  } from "react";
import gridHorizontal from "../../../assets/images/grid-horizontal.svg";
import imgWeb from "../../../assets/images/web.svg";
import imgCall from "../../../assets/images/call.svg";
import imgEmail from "../../../assets/images/email.svg";
import FontFamilySetting from "../utilities/FontFamilySetting";
import NumberStepper from "../utilities/NumberStepper";
import ColorSetting from "../utilities/ColorSetting";
import CenterSetting from "../utilities/centerSetting";
import PaddingSetting from "../utilities/PaddingSetting";
import BorderSetting from "../utilities/BorderSetting";

export default function SettingMenu({ content, onUpdate }) {
  const menu = content.content.menu;
  const imgItem = {
  web: imgWeb,
  call: imgCall,
  email: imgEmail,
};
      
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragOver = (e, index) => {
    e.preventDefault(); // obligatorio
    if (index !== dragIndex) {
      setDragOverIndex(index);
    }
  };

  const handleRemove = (index) => {
    const updatedMenu = menu.filter((_, i) => i !== index);

    onUpdate({
      ...content,
      content: {
        ...content.content,
        menu: updatedMenu,
      },
    });
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updatedMenus = [...menu];
    const draggedItem = updatedMenus[dragIndex];

    updatedMenus.splice(dragIndex, 1);
    updatedMenus.splice(dropIndex, 0, draggedItem);

    onUpdate({
      ...content,
      content: {
        ...content.content,
        menu: updatedMenus,
      },
    });

    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleChange = (index, field, value) => {
    const updatedMenus = [...menu];
    updatedMenus[index] = {
      ...updatedMenus[index],
      [field]: value,
    };

    onUpdate({
      ...content,
      content: {
        ...content.content,
        menu: updatedMenus,
      },
    });
  };

  const updateFeature = (index, changes) => {
    const updatedMenus = [...menu];

    updatedMenus[index] = {
      ...updatedMenus[index],
      feature: {
        ...(updatedMenus[index].feature || {}),
        ...changes,
      },
    };

    onUpdate({
      ...content,
      content: {
        ...content.content,
        menu: updatedMenus,
      },
    });
  };

  const handleTypeChange = (menuIndex, newType) => {
    const updatedMenus = [...menu];

    let newFeature = {};

    switch (newType) {
      case "web":
        newFeature = { href: "" };
        break;

      case "email":
        newFeature = { mailTo: "", subject: "", body: "" };
        break;

      case "call":
        newFeature = { tel: "" };
        break;

      default:
        newFeature = {};
    }

    updatedMenus[menuIndex] = {
      ...updatedMenus[menuIndex],
      type: newType,
      feature: newFeature,
    };

    onUpdate({
      ...content,
      content: {
        ...content.content,
        menu: updatedMenus,
      },
    });
  };

  const handleAddItem = () => {
    const newItem = {
      text: "menú web",
      type: "web",
      target: "_blank",
      feature: {
        href: "#",
      },
    };

    const updatedMenus = [...menu, newItem];

    onUpdate({
      ...content,
      content: {
        ...content.content,
        menu: updatedMenus,
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

  const menuSpacing =
  typeof content?.content?.spacing === "string"
    ? parseFloat(content.content.spacing)
    : content?.content?.spacing ?? 20;

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

  const borderRadioNumber =
    typeof content?.style?.borderRadius === "string"
      ? parseInt(content.style.borderRadius, 10)
      : content?.style?.borderRadius || 0;
  
  return (
    <>
      <div className="row-setting-content accordion-scroll">
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Contenido
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show">
              <div className="accordion-body p-0">
                <div className="m-2 mt-2">
                  Configurar la colección de menú
                  <div className="mt-2">
                    {menu.map((item, index) => {
                      const type = item.type;
                      const feature = item.feature || {};
                      return (
                        <div
                          key={index}
                          className="card mb-2"
                          style={{
                            position: "relative",
                            backgroundColor:
                              dragOverIndex === index ? "#e5f7ff" : undefined,
                            border:
                              dragOverIndex === index
                                ? "2px solid var(--bs-primary)"
                                : undefined,
                            transition: "background-color 0.15s ease, border 0.15s ease",
                          }}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={() => handleDrop(index)}
                        >
                          <div className="drag-social">
                            <button
                              className="btn p-0"
                              draggable
                              onDragStart={() => handleDragStart(index)}
                              onDragEnd={handleDragEnd}
                            >
                              <img width="32px" src={gridHorizontal} alt="drag" />
                            </button>
                          </div>
                          <div className="card-body">
                            <div className="mb-3 d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  alt="página web"
                                  height="32"
                                  src={imgItem[item.type]}
                                />
                                <label>{item.text}</label>
                              </div>
                              <button
                                className="btn p-0"
                                onClick={() => handleRemove(index)}
                              >
                                <i className="bi bi-trash fs-4 text-primary-lite"></i>
                              </button>
                            </div>
                            <div className="input-group">
                              <span className="input-group-text">Texto</span>
                              <input
                                type="text"
                                className="form-control"
                                value={item.text}
                                onChange={(e) =>
                                  handleChange(index, "text", e.target.value)
                                }
                              />
                            </div>
                            <div className="content-setting-dos border-bottom-0">
                              <div className="content-col">Tipo de link</div>
                              <div className="content-col">
                                <select
                                  className="form-select"
                                  value={item.type}
                                  onChange={(e) => handleTypeChange(index, e.target.value)}
                                >
                                  <option value="web">Abrir página web</option>
                                  <option value="email">Enviar correo</option>
                                  <option value="call">Hacer una llamada</option>
                                </select>
                              </div>
                            </div> 
                            {/* ===== WEB ===== */}
                            {type === "web" && (           
                              <div className="input-group mb-2">
                                <span className="input-group-text">URL</span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="https://ejemplo.com"
                                  value={feature.href || ""}
                                  onChange={(e) => updateFeature(index, { href: e.target.value })}
                                />
                              </div>
                            )}
                            {/* ===== EMAIL ===== */}
                            {type === "email" && (
                              <div className="p-2">
                                <div className="input-group mb-3">
                                  <span className="input-group-text">Enviar a</span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="correo@correo.com"
                                    value={feature.mailTo || ""}
                                    onChange={(e) => updateFeature(index, { mailTo: e.target.value })}
                                  />
                                </div>

                                <div className="input-group mb-3">
                                  <span className="input-group-text">Asunto</span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={feature.subject || ""}
                                    onChange={(e) => updateFeature(index, { subject: e.target.value })}
                                  />
                                </div>

                                <div className="input-group">
                                  <span className="input-group-text">Cuerpo</span>
                                  <textarea
                                    className="form-control"
                                    value={feature.body || ""}
                                    onChange={(e) => updateFeature(index, { body: e.target.value })}
                                  />
                                </div>
                              </div>
                            )}
                            {/* ===== CALL ===== */}
                            {type === "call" && (
                              <div className="p-2">
                                <div className="input-group mb-3">
                                  <span className="input-group-text">Teléfono</span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="+56111111111"
                                    value={feature.tel || ""}
                                    onChange={(e) => updateFeature(index, { tel: e.target.value })}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    <div className="d-grid">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleAddItem}
                      >
                        <span className="ico ico-plus-alt me-2"></span>
                        Agregar nuevo item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
                Opciones
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse show">
              <div className="accordion-body p-0">
                <div className="content-setting-dos border-bottom-0 pb-0">
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
                <div className="content-setting-dos border-bottom-0 pb-0">
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
                <div className="content-setting-dos border-bottom-0 pb-0">
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
                <div className="content-setting-dos border-bottom-0 pb-0">
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
                <div className="content-setting-dos border-bottom-0 pb-0">
                  <div className="content-col">
                    Color de fondo
                  </div>
                  <div className="content-col">
                    <ColorSetting
                      color={content?.style?.backgroundColor || "transparent"}
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
                <div className="content-setting-dos border-bottom-0 pb-0">
                  <div className="content-col">
                    Color del texto
                  </div>
                  <div className="content-col">
                    <ColorSetting
                      color={content?.style?.color || "#000000"}
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
                <div className="content-setting-dos">
                  <div className="content-col">
                    Espacio entre menú
                  </div>
                  <div className="content-col" style={{width: "120px"}}>
                    <select
                      className="form-select"
                      value={menuSpacing}
                      onChange={(e) => {
                        const value = e.target.value;

                        onUpdate({
                          ...content,
                          content: {
                            ...content.content,
                            spacing: `${value}px`,
                          },
                        });
                      }}
                    >
                      <option value="20">20 px</option>
                      <option value="25">25 px</option>
                      <option value="30">30 px</option>
                      <option value="35">35 px</option>
                    </select>
                  </div>
                </div>
                <div className="ms-2 mt-2">Relleno del área del menú</div>
                <PaddingSetting
                  style={content.style}
                  onChange={(newStyle) => {
                    onUpdate({
                      ...content,
                      style: {
                        ...content.style,
                        ...newStyle,
                      },
                    });
                  }}
                />
                <div className="ms-2 mt-2">Margen del menú</div>
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
  )
}