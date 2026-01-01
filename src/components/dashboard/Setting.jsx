import { useState, useEffect } from "react";
import RangeSetting from "../../components/dashboard/utilities/RangeSetting";
import ColorSetting from "../../components/dashboard/utilities/ColorSetting";
import FontFamilySetting from "../../components/dashboard/utilities/FontFamilySetting";

export default function Setting({ pageData, setPageData }) {
  const [width, setWidth] = useState(650);

  useEffect(() => {
    if (pageData?.template_list?.style?.width) {
      const rawValue = pageData.template_list.style.width; // ejemplo: "650px"
      setWidth(parseInt(rawValue)); // convierte a número
    }
  }, [pageData]);

  const handleWidthChange = (val) => {
    setWidth(val);

    setPageData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => ({
        ...row,
        style: {
          ...row.style,
          width: val + "px",
          maxWidth: val + "px",
        },
      })),
    }));

  };


  return (
    <>
      <div className="accordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button className="accordion-button accordion-zero-rounded" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              Configuración de diseño
            </button>
          </h2>
          <div id="collapseOne" className="accordion-scroll accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className="accordion-body p-0">
              <RangeSetting
                id="contentWidth"
                label="Ancho del área de contenido"
                min={480}
                max={900}
                step={5}
                value={width}
                unit="px"
                onChange={handleWidthChange}
              />
              <div className="content-setting-dos">
                <div className="content-col">
                  Alineación del área de contenido
                </div>
                <div className="content-col">
                  <div className="btn-group btn-group-sm" role="group" aria-label="Basic radio toggle button group">
                    {/* Izquierda */}
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio"
                      id="btnIzquierda"
                      autoComplete="off"
                      checked={pageData.rows[0].style?.margin === "inherit"}
                      onChange={() =>
                        setPageData(prev => ({
                          ...prev,
                          marginContent: "inherit",
                          rows: prev.rows.map(row => ({
                            ...row,
                            style: {
                              ...row.style,
                              margin: "inherit",
                            },
                          }))
                        }))
                      }
                    />
                    <label className="btn btn-outline-primary" htmlFor="btnIzquierda">
                      Izquierda
                    </label>

                    {/* Centrado */}
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio"
                      id="btnCentrado"
                      autoComplete="off"
                      checked={pageData.rows[0].style?.margin === "auto"}
                      onChange={() =>
                        setPageData(prev => ({
                          ...prev,
                          marginContent: "auto",
                          rows: prev.rows.map(row => ({
                            ...row,
                            style: {
                              ...row.style,
                              margin: "auto",
                            },
                          }))
                        }))
                      }
                    />
                    <label className="btn btn-outline-primary" htmlFor="btnCentrado">
                      Centrado
                    </label>
                  </div>
                </div>
              </div>
              <div className="content-setting-dos">
                <div className="content-col">
                  Color de fondo
                </div>
                <div className="content-col">
                  <ColorSetting
                    color={pageData?.style.backgroundColor}
                    onChange={(newColor) => {
                      setPageData((prev) => ({
                        ...prev,
                        style: {
                          ...prev.style,
                          backgroundColor: newColor,
                        },
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="content-setting-dos">
                <div className="content-col">
                  Color de fondo del área de contenido
                </div>
                <div className="content-col">
                  <ColorSetting
                    color={pageData?.backgroundColorContent}
                    onChange={(newColor) => {
                      setPageData((prev) => ({
                        ...prev,
                        backgroundColorContent: newColor,
                        rows: prev.rows.map((row) => ({
                          ...row,
                          style: {
                            ...row.style,
                            backgroundColor: newColor,
                          },
                        })),
                      }));
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
                    value={pageData?.style.fontFamily}
                    onChange={(newFont) => {
                      setPageData((prev) => ({
                        ...prev,
                        style: {
                          ...prev.style,
                          fontFamily: newFont, // Aquí guarda la font seleccionada
                        },
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="content-setting-dos">
                <div className="content-col">
                  Color Link
                </div>
                <div className="content-col">
                  <ColorSetting
                    color={pageData?.style.color}
                    onChange={(newColor) => {
                      setPageData((prev) => ({
                        ...prev,
                        style: {
                          ...prev.style,
                          color: newColor, 
                        },
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}