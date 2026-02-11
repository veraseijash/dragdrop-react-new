import { Editor } from "@tinymce/tinymce-react";
import ColorSetting from "../utilities/ColorSetting";
import AlignCenterSetting from "../utilities/AlignCenterSetting";
import NumberStepper from "../utilities/NumberStepper";
import PaddingSetting from "../utilities/PaddingSetting";
import BorderSetting from "../utilities/BorderSetting";
import FontFamilySetting from "../utilities/FontFamilySetting";

export default function SettingButton({ content, onUpdate }) {
  if (!content) return null;

  const handleEditorChange = (value) => {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        text: value,
      },
    });
  };

  const letterSpacingNumber =
    typeof content?.style?.letterSpacing === "string"
      ? parseInt(content.style.letterSpacing, 10)
      : content?.style?.letterSpacing || 0;

  const handleStyleChange = (updater) => {
    const newStyle =
      typeof updater === "function"
        ? updater(content.preStyle || {})
        : updater;

    onUpdate({
      ...content,
      preStyle: {
        ...content.preStyle,
        ...newStyle,
      },
    });
  };

  const borderRadioNumber =
    typeof content?.preStyle?.borderRadius === "string"
      ? parseInt(content.preStyle.borderRadius, 10)
      : content?.preStyle?.borderRadius || 0;
  
  const fontSizeNumber =
    typeof content?.style?.fontSize === "string"
      ? parseInt(content.style.fontSize, 10)
      : content?.style?.fontSize || 16;

  
  function changeHeadingTag(html, newTag) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // buscar el heading real
    const oldHeading = doc.body.querySelector("h1,h2,h3,h4,h5,h6");
    if (!oldHeading) return html;

    const newHeading = doc.createElement(newTag);

    // copiar atributos
    for (const attr of oldHeading.attributes) {
      newHeading.setAttribute(attr.name, attr.value);
    }

    // copiar SOLO el contenido interno (span, p, strong, etc)
    newHeading.innerHTML = oldHeading.innerHTML;

    oldHeading.replaceWith(newHeading);

    return doc.body.innerHTML;
  }



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
                <div className="p-2">
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    value={content.content.text}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 220,
                      menubar: false,
                      inline: false,

                      toolbar_mode: "wrap",

                      toolbar:
                        "undo redo | bold italic underline | forecolor backcolor | bullist numlist | link unlink | code",

                      plugins: "link lists code",
                      resize: true,        // 👈 habilita resize
                      statusbar: true,     // 👈 NECESARIO para arrastrar
                      branding: false,
                    }}
                  />
                </div>
                {content?.label === "Título" && (
                  <div className="content-setting-dos border-bottom-0">
                    <div className="content-col">Título</div>
                    <div className="content-col">
                      <select
                        className="form-select"
                        style={{width: "145px"}}
                        value={content.content.type || "h2"}
                        onChange={(e) => {
                          const newTag = e.target.value;

                          onUpdate({
                            ...content,
                            content: {
                              ...content.content,
                              type: newTag,
                              text: changeHeadingTag(content.content.text, newTag),
                            },
                          });
                        }}
                      >
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                        <option value="h3">H3</option>
                        <option value="h4">H4</option>
                        <option value="h5">H5</option>
                        <option value="h6">H6</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="content-setting-dos pt-0">
                  <div className="content-col">Grosor del texto</div>
                  <div className="content-col">
                    <select
                      className="form-select"
                      style={{width: "145px"}}
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
                <div className="content-setting-dos pt-0">
                  <div className="content-col">
                    Color de fondo
                  </div>
                  <div className="content-col">
                    <ColorSetting
                      color={content?.preStyle?.backgroundColor || "#7747FF"}
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
                <div className="content-setting-dos">
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
                {content?.label === "Párrafo" && (
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
                )}
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
                <div className="content-setting-dos pt-0">
                  <div className="content-col">
                    Espaciado entre letras
                  </div>
                  <div className="content-col" style={{width: "120px"}}>
                    <NumberStepper
                      value={letterSpacingNumber}
                      step={1}
                      min={1}
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
                <AlignCenterSetting
                  value={content?.style?.textAlign}
                  name={`align-1`}
                  onChange={(val) => {
                    onUpdate({
                      ...content,
                      style: {
                        ...content.style,
                        textAlign: val,
                      },
                    });
                  }}
                />                
                <div className="ms-2 mt-2">Relleno en el área del título</div>
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
                <div className="ms-2 mt-2">Margen del título</div>
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
                <div className="ms-2 mt-2">Bordes del título</div>
                <BorderSetting
                  style={content.preStyle || {}}
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
                          preStyle: {
                            ...content.preStyle,
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