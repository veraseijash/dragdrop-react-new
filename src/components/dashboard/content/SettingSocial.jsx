import { listSocial } from "../../../data/DataSocials";
import gridHorizontal from "../../../assets/images/grid-horizontal.svg";
import { useMemo, useState  } from "react";
import CenterSetting from "../utilities/centerSetting";
import PaddingSetting from "../utilities/PaddingSetting";

export default function SettingSocial({ content, onUpdate }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const socials = content.content.social;
  const availableSocials = listSocial;
  const selectedType =
    content?.content?.type || availableSocials[0].label;

  const selectedGroup = useMemo(
    () =>
      availableSocials.find((g) => g.label === selectedType) ||
      availableSocials[0],
    [selectedType]
  );

  const mergeSocialsWithHref = (newSocials, currentSocials = []) => {
    return newSocials.map((item) => {
      const existing = currentSocials.find(
        (s) => s.alt.toLowerCase() === item.name.toLowerCase()
      );

      return {
        src: item.img,
        alt: item.name,
        href: existing?.href || "#",
      };
    });
  };

  const handleChange = (index, field, value) => {
    const updatedSocials = [...socials];
    updatedSocials[index] = {
      ...updatedSocials[index],
      [field]: value,
    };

    onUpdate({
      ...content,
      content: {
        ...content.content,
        social: updatedSocials,
      },
    });
  };

  const handleRemove = (index) => {
    const updatedSocials = socials.filter((_, i) => i !== index);

    onUpdate({
      ...content,
      content: {
        ...content.content,
        social: updatedSocials,
      },
    });
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

const handleDragOver = (e, index) => {
  e.preventDefault(); // obligatorio
  if (index !== dragIndex) {
    setDragOverIndex(index);
  }
};

const handleDrop = (dropIndex) => {
  if (dragIndex === null || dragIndex === dropIndex) {
    setDragIndex(null);
    setDragOverIndex(null);
    return;
  }

  const updatedSocials = [...socials];
  const draggedItem = updatedSocials[dragIndex];

  updatedSocials.splice(dragIndex, 1);
  updatedSocials.splice(dropIndex, 0, draggedItem);

  onUpdate({
    ...content,
    content: {
      ...content.content,
      social: updatedSocials,
    },
  });

  setDragIndex(null);
  setDragOverIndex(null);
};

const handleDragEnd = () => {
  setDragIndex(null);
  setDragOverIndex(null);
};

const iconSpacing =
  typeof content?.content?.iconSpacing === "string"
    ? parseFloat(content.content.iconSpacing)
    : content?.content?.iconSpacing ?? 2.5;

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
                <div className="content-setting-dos">
                  <div className="content-col">
                    Seleccionar colección de iconos
                  </div>
                  <div className="content-col">
                    <div className="dropdown">
                      <button
                        className="btn btn-outline-dark color-gray dropdown-toggle no-caret w-100"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {/* BOTÓN */}
                        <div className="d-flex gap-2">
                          {selectedGroup.sociales.map((item) => (
                            <img
                              key={item.name}
                              src={item.img}
                              alt={item.name}
                              style={{ width: 20, height: 20 }}
                            />
                          ))}
                        </div>
                      </button>

                      <ul className="dropdown-menu p-2">
                        {availableSocials.map((group) => (
                          <li key={group.label}>
                            <button
                              type="button"
                              className={`dropdown-item color-gray ${
                                selectedType === group.label ? "active" : ""
                              }`}
                              onClick={() => {
                                onUpdate({
                                  ...content,
                                  content: {
                                    ...content.content,
                                    type: group.label,
                                    social: mergeSocialsWithHref(
                                      group.sociales,
                                      content.content.social
                                    ),
                                  },
                                });
                              }}
                            >
                              <div
                                className="d-flex gap-2"
                                style={{ pointerEvents: "none" }}
                              >
                                {group.sociales.map((item) => (
                                  <img
                                    key={item.name}
                                    src={item.img}
                                    alt={item.name}
                                    style={{ width: 20, height: 20 }}
                                  />
                                ))}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="m-2 mt-2">
                  Configurar la colección de iconos
                  <div className="mt-2">
                    {socials.map((item, index) => (
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
                                <div className="box-icon">
                                  <img
                                    alt={item.alt}
                                    height="32"
                                    src={item.src}
                                  />
                                </div>
                                <label>{item.alt}</label>
                              </div>

                              <button
                                className="btn p-0"
                                onClick={() => handleRemove(index)}
                              >
                                <i className="bi bi-trash fs-4 text-primary-lite"></i>
                              </button>
                            </div>

                            {/* URL */}
                            <div className="input-group mb-2">
                              <span className="input-group-text">Url</span>
                              <input
                                type="text"
                                className="form-control"
                                value={item.href}
                                onChange={(e) =>
                                  handleChange(index, "href", e.target.value)
                                }
                              />
                            </div>

                            {/* ALT */}
                            <div className="input-group">
                              <span className="input-group-text">Alt texto</span>
                              <input
                                type="text"
                                className="form-control"
                                value={item.alt}
                                onChange={(e) =>
                                  handleChange(index, "alt", e.target.value)
                                }
                              />
                            </div>
                          </div>
                      </div>
                    ))}
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
                <div className="content-setting-dos border-bottom-0">
                  <div className="content-col">
                    Espacio entre logo
                  </div>
                  <div className="content-col" style={{width: "120px"}}>
                    <select
                      className="form-select"
                      value={iconSpacing}
                      onChange={(e) => {
                        const value = e.target.value;

                        onUpdate({
                          ...content,
                          content: {
                            ...content.content,
                            iconSpacing: `${value}px`,
                          },
                        });
                      }}
                    >
                      <option value="2.5">5 px</option>
                      <option value="5">10 px</option>
                      <option value="7.5">15 px</option>
                      <option value="10">20 px</option>
                    </select>
                  </div>
                </div>
                <CenterSetting
                  value={content?.style?.textAlign}
                  name={`margin-1`}
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
                <div className="ms-2 mt-2">Relleno en e área de botónes</div>
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