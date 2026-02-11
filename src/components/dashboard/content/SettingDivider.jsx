import NumberStepper from "../utilities/NumberStepper";
import ColorSetting from "../utilities/ColorSetting";
import RangeSetting from "../utilities/RangeSetting";
import CenterSetting from "../utilities/centerSetting";
import PaddingSetting from "../utilities/PaddingSetting";

export default function SettingDivider({ content, onUpdate }) {
  const borderWidth = parseInt(content.style.borderTopWidth, 10) || 2;
  const widthValue = content.style?.width;
  const width =
    typeof widthValue === "string" && widthValue.endsWith("%")
      ? parseInt(widthValue, 10)
      : 100;
  const handleWidthChange = (newValue) => {
    onUpdate({
      ...content,
      style: {
        ...content.style,
        width: `${newValue}%`,
      },
    });
  };

  const marginMap = {
    left: "0 auto 0 0",
    center: "0 auto",
    right: "0 0 0 auto",
  };

  const reverseMarginMap = {
    "0 auto 0 0": "left",
    "0 auto": "center",
    "0 0 0 auto": "right",
  };


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
                <div className="mt-2">
                  <div className="div-border">
                    <div>Línea</div>
                    <div className="border-controls">
                      <select
                        className="form-control form-select-sm"
                        value={content.style.borderTopStyle}
                        onChange={(e) => {
                          onUpdate({
                            ...content,
                            style: {
                              ...content.style,
                              borderTopStyle: e.target.value,
                            },
                          });
                        }}
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
                        onChange={(val) => {
                          onUpdate({
                            ...content,
                            style: {
                              ...content.style,
                              borderTopWidth: val,
                            },
                          });
                        }}
                      />  
                      <ColorSetting
                        color={content.style.borderTopColor}
                        onChange={(val) => {
                          onUpdate({
                            ...content,
                            style: {
                              ...content.style,
                              borderTopColor: val,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <RangeSetting
                  id="dividerWidth"
                  label="Ancho"
                  min={20}
                  max={100}
                  step={5}
                  value={width}
                  unit="%"
                  onChange={handleWidthChange}
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
            <div id="collapseThree" className="accordion-collapse collapse show">
              <div className="accordion-body p-0">
                <CenterSetting
                  value={reverseMarginMap[content?.style?.margin] || "center"}
                  name="divider-align"
                  onChange={(val) => {
                    onUpdate({
                      ...content,
                      style: {
                        ...content.style,
                        margin: marginMap[val],
                      },
                    });
                  }}
                />
                <div className="ms-2 mt-2">Relleno del área</div>
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
    </>
  )
}