import NumberStepper from "../utilities/NumberStepper";

export default function SettingSpacer({ content, onUpdate }) {
  const heightNumber =
    typeof content?.style?.height === "string"
      ? parseInt(content.style.height, 10)
      : content?.style?.height || 60;
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
                <div className="content-setting-dos border-bottom-0">
                  <div className="content-col">
                    Altura
                  </div>
                  <div className="content-col" style={{width: "120px"}}>
                    <NumberStepper
                      value={heightNumber}
                      step={5}
                      min={5}
                      max={200}
                      onChange={(val) => {
                        onUpdate({
                          ...content,
                          style: {
                            ...content.style,
                            height: `${val}px`,
                            lineHeight: `${val}px`,
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