import { useState } from "react";
import GifModal from "../utilities/GifModal";
import RangeSetting from "../utilities/RangeSetting";
import PaddingSetting from "../utilities/PaddingSetting";
import CenterSetting from "../utilities/centerSetting";
import NumberStepper from "../utilities/NumberStepper";

export default function SettingGif({ content, onUpdate }) {
  const [openGifModal, setOpenGifModal] = useState(false);

  const handleSelectGif = (gif) => {
    console.log('paso el gif: ', gif)
    onUpdate({
      ...content,
      content: {
        ...content.content,
        src: gif.images.fixed_height.url,
        alt: gif.title,
      },
    });

    setOpenGifModal(false);
  };

  function handleGifUrlChange(value) {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        src: value || "", // si no es YouTube guarda lo que escribió
      },
    });
  }

  const widthValue = content.content?.width;
  const width =
    typeof widthValue === "string" && widthValue.endsWith("%")
      ? parseInt(widthValue, 10)
      : 100;
  const handleWidthChange = (newValue) => {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        width: `${newValue}%`,
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
                    onClick={() => setOpenGifModal(true)}
                  >
                    Cambiar Gif
                  </button>
                  <div className="input-group mt-2">
                    <span className="input-group-text" id="basic-addon1">Url</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Coloque..."
                      value={content?.content?.src || ""}
                      onChange={(e) => handleGifUrlChange(e.target.value)}
                    />
                  </div>
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
                <RangeSetting
                  id="botonWidth"
                  label="Ancho"
                  min={20}
                  max={100}
                  step={5}
                  value={width}
                  unit="%"
                  onChange={handleWidthChange}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 👇 PANEL */}
      <GifModal
        open={openGifModal}
        onClose={() => setOpenGifModal(false)}
        onSelectGif={handleSelectGif}
      />
    </>
  )
}