import { useState } from "react";

export default function StageInner({ pageData, onDropOnRowItem, onSelectRow }) {
  const [hoverRow, setHoverRow] = useState(null); // rowPosition actualmente resaltado
  const [hoverSide, setHoverSide] = useState(null); // "top" o "bottom"

  const [selectedRow, setSelectedRow] = useState(null);

  const handleDragOver = (event, rowPosition) => {
    event.preventDefault();

    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const middle = rect.height / 2;

    if (offsetY < middle) {
      setHoverRow(rowPosition);
      setHoverSide("top");
    } else {
      setHoverRow(rowPosition);
      setHoverSide("bottom");
    }
  };

  const handleDrop = (event, rowPosition) => {
    event.preventDefault();
    onDropOnRowItem({
      rowPosition,
      side: hoverSide,
    });

    // Limpiar resaltado
    setHoverRow(null);
    setHoverSide(null);
  };

  const handleDragLeave = () => {
    setHoverRow(null);
    setHoverSide(null);
  };

  return (
    <div className="stage-inner">
      <div className="stageContainer" style={pageData?.style}>          
        {pageData?.rows.map((row, index) => {
          const isHover = hoverRow === row.rowPosition;
          return (
            <div className="row-container-outer" key={row.rowPosition}>           
              <div className={`rows-content 
                    ${isHover && hoverSide === "top" ? "hover-top" : ""} 
                    ${isHover && hoverSide === "bottom" ? "hover-bottom" : ""}
                  `} 
                style={row.template_list.style}            
                data-name="arrástralo aquí"
                onClick={() => onSelectRow(row.rowPosition)}
                onDragOver={(e) => handleDragOver(e, row.rowPosition)}
                onDrop={(e) => handleDrop(e, row.rowPosition)}
                onDragLeave={handleDragLeave}
              >
                <div
                  data-position={row.rowPosition}
                  className="row-item"
                  style={{
                    ...row.style,
                    transition: "border 0.1s",
                  }}
                >

                  {row.cols?.map((col, cIndex) => (
                    <div
                      key={`${index}-${cIndex}`}
                      data-position={col.colPosition}
                      className="col-item"
                      style={col.style}
                    >
                      {col.content?.map((item, iIndex) => {
                        if (item.class === "module-empty") {
                          return (
                            <div
                              key={`${index}-${cIndex}-${iIndex}`}
                              className={item.class}
                              data-position={item.position}
                              style={item.style}
                              data-label="Soltar bloques de contenido aquí"
                            >
                              <span className="ico ico-arrow-up-alt1"></span>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={`${index}-${cIndex}-${iIndex}`}
                              className="content-item"
                              data-position={item.position}
                              style={item.style}
                            ></div>
                          );
                        }
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
