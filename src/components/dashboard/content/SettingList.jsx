import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef } from "react";
import FontFamilySetting from "../utilities/FontFamilySetting";
import ColorSetting from "../utilities/ColorSetting";
import NumberStepper from "../utilities/NumberStepper";
import PaddingSetting from "../utilities/PaddingSetting";

export default function SettingButton({ content, onUpdate }) {
  if (!content) return null;

  const editorRef = useRef(null);

  const fontSizeNumber =
    typeof content?.style?.fontSize === "string"
      ? parseInt(content.style.fontSize, 10)
      : content?.style?.fontSize || 16;

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

  // 👇 aplica el estilo a TODOS los <ul> del editor
  const applyListStyleInEditor = (style) => {
    const editor = editorRef.current;
    if (!editor) return;

    const dom = editor.dom;
    const body = editor.getBody();

    dom.select("ul", body).forEach((ul) => {
      dom.setStyle(ul, "list-style-type", style);
      dom.setStyle(ul, "padding-left", "20px"); // email safe
    });
  };

  // 👇 sincroniza cuando cambia desde fuera (select / carga inicial)
  useEffect(() => {
    if (content?.style?.listStyleType) {
      applyListStyleInEditor(content.style.listStyleType);
    }
  }, [content?.style?.listStyleType]);

  return (
    <>
      <div className="row-setting-content accordion-scroll">
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button accordion-zero-rounded"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Contenido
              </button>
            </h2>

            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
            >
              <div className="accordion-body p-0">
                <div className="p-2">
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    value={content.content.text}
                    onEditorChange={handleEditorChange}
                    onInit={(evt, editor) => {
                      editorRef.current = editor;

                      // 👇 aplica estilo inicial
                      applyListStyleInEditor(
                        content?.style?.listStyleType || "disc"
                      );
                    }}
                    init={{
                      height: 220,
                      menubar: false,
                      inline: false,
                      toolbar_mode: "wrap",
                      toolbar:
                        "undo redo | bold italic underline | forecolor backcolor | bullist numlist | link unlink | code",
                      plugins: "link lists code",
                      resize: true,
                      statusbar: true,
                      branding: false,
                    }}
                  />
                </div>

                <div className="content-setting-dos border-bottom-0">
                  <div className="content-col">
                    Tipo de estilo de lista
                  </div>

                  <div className="content-col">
                    <select
                      className="form-select"
                      style={{ width: "145px" }}
                      value={content?.style?.listStyleType || "disc"}
                      onChange={(e) => {
                        const style = e.target.value;

                        // 1️⃣ guardar en estado
                        onUpdate({
                          ...content,
                          style: {
                            ...content.style,
                            listStyleType: style,
                          },
                        });

                        // 2️⃣ aplicar en TinyMCE en vivo
                        applyListStyleInEditor(style);
                      }}
                    >
                      <option value="disc">Redondo</option>
                      <option value="circle">Circular</option>
                      <option value="square">Cuadrado</option>
                    </select>
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
                <div className="content-setting-dos border-bottom-0 pt-0">
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
                          style: {
                            ...content.style,
                            fontSize: `${val}px`,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="content-setting-dos border-bottom-0 pt-0">
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
                <div className="ms-2 mt-2">Relleno en el área de la lista</div>
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
                <div className="ms-2 mt-2">Margen de la lista</div>
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
      </div>
    </>
  );
}
