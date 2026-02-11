import { useState } from "react";
import RangeSetting from "../utilities/RangeSetting";
import ImageModal from "../utilities/ImageModal";
import CenterSetting from "../utilities/centerSetting";
import PaddingSetting from "../utilities/PaddingSetting";
import BorderSetting from "../utilities/BorderSetting";
import ColorSetting from "../utilities/ColorSetting";

export default function SettingImagen({ content, onUpdate }) {
  const [openImageModal, setOpenImageModal] = useState(false);

  const widthValue = content.style?.width;
  const width =
    typeof widthValue === "string" && widthValue.endsWith("%")
      ? parseInt(widthValue, 10)
      : 50;

  const handleWidthChange = (newValue) => {
    onUpdate({
      ...content,
      style: {
        ...content.style,
        width: `${newValue}%`,
      },
      content: {
        ...content.content,
        width: `${newValue}%`,
      },
    });
  };

  const handleSelectImage = (img) => {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        src: img.secure_url,
        alt: img.display_name,
        name: img.display_name,
      },
    });

    setOpenImageModal(false);
  };

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
            <h2 className="accordion-header">
              <button
                className="accordion-button accordion-zero-rounded"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
              >
                Contenido
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show">
              <div className="accordion-body p-0">
                <div className="p-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setOpenImageModal(true)}
                  >
                    Cambiar imagen
                  </button>
                  <div className="input-group mt-2">
                    <span className="input-group-text" id="basic-addon1">Url</span>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Coloque..."
                      value={content?.content?.src || ""}
                      onChange={(e) => {
                        onUpdate({
                          ...content,
                          content: {
                            ...content.content,
                            src: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <label className="small text-primary-lite">Nombre de la imagen: <span className="inter-bold">{content?.content?.name || ""}</span></label>
                  <div className="input-group mt-2">
                    <span className="input-group-text" id="basic-addon1">Texto Alt</span>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Coloque..."
                      value={content?.content?.alt || ""}
                      onChange={(e) => {
                        onUpdate({
                          ...content,
                          content: {
                            ...content.content,
                            alt: e.target.value,
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
              <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
                Opciones
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse show">
              <div className="accordion-body p-0">
                <RangeSetting
                  id="imageWidth"
                  label="Ancho"
                  min={20}
                  max={100}
                  step={5}
                  value={width}
                  unit="%"
                  onChange={handleWidthChange}
                />
                <div className="content-setting-dos border-bottom-0">
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
                  value={content?.preStyle?.textAlign}
                  name={`margin-1`}
                  onChange={(val) => {
                    onUpdate({
                      ...content,
                      preStyle: {
                        ...content.preStyle,
                        textAlign: val,
                      },
                    });
                  }}
                />
                <div className="ms-2 mt-2">Relleno del área de la imagen</div>
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
                <div className="ms-2 mt-2">Margen de la imagen</div>
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
                <div className="ms-2 mt-2">Bordes de la imagen</div>
                <BorderSetting
                  style={content.style || {}}
                  setStyle={handleStyleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 👇 PANEL */}
      <ImageModal
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        onSelectImage={handleSelectImage}
      />
    </>
  );
}
