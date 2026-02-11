import PaddingSetting from "../utilities/PaddingSetting";

export default function SettingVideo({ content, onUpdate }) {
  function getYouTubeThumbnail(url) {
    if (!url) return "";
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/|shorts\/))([\w-]{11})/
    );
    if (!match) return "";
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  function handleVideoUrlChange(value) {
    const thumbnail = getYouTubeThumbnail(value);
    onUpdate({
      ...content,
      content: {
        ...content.content,
        url: value,
        src: thumbnail || "", // si no es YouTube guarda lo que escribió
      },
    });
  }

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
                  <div className="input-group mt-2">
                    <span className="input-group-text" id="basic-addon1">Url</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Coloque..."
                      value={content?.content?.src || ""}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                    />
                  </div>
                  <div className="small text-primary-lite">
                    añadir un <a className="inter-bold" href="https://www.youtube.com/" target="_blank">YouTube</a> URL para generar automáticamente una imagen de vista previa. La imagen se vinculará a la URL proporcionada.
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
                <div className="ms-2 mt-2">Icono central</div>
                <div className="content-setting-dos border-bottom-0 pb-0">
                  <div className="content-col flex-column">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{width: '60px'}}>Color</div>                
                      <select
                        className="form-select"
                        style={{width: '106px'}}
                        value={content?.content?.iconColor || "claro"}
                        onChange={(e) => {
                          onUpdate({
                            ...content,
                            content: {
                              ...content.content,
                              iconColor: e.target.value,
                            },
                          });
                        }}
                      >
                        <option value="claro">Claro</option>
                        <option value="oscuro">Oscuro</option>
                      </select>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2 mb-2">
                      <div style={{width: '60px'}}>Tamaño</div>
                      <select
                        className="form-select"
                        style={{width: '106px'}}
                        value={content?.content?.iconSize || "65px"}
                        onChange={(e) => {
                          onUpdate({
                            ...content,
                            content: {
                              ...content.content,
                              iconSize: e.target.value,
                            },
                          });
                        }}
                      >
                        <option value="50px">50px</option>
                        <option value="55px">55px</option>
                        <option value="60px">60px</option>
                        <option value="65px">65px</option>
                        <option value="70px">70px</option>
                        <option value="75px">75px</option>
                        <option value="80px">80px</option>
                      </select>
                    </div>
                  </div>
                  <div className="content-col">
                    <div className="mb-2 icon-style d-flex justify-content-center align-items-center">
                      <img
                        src={
                          content?.content?.iconColor  === "claro"
                            ? "https://res.cloudinary.com/dpkpqgxqd/image/upload/v1741553784/hijtudccbda0woid1jjn.png"
                            : "https://res.cloudinary.com/dpkpqgxqd/image/upload/v1741553788/xyjwzg0988o0bkjjavjg.png"
                        }
                        width={content?.content?.iconSize || '64px'}
                      /> 
                    </div>                    
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
    </>
  )
}