import { useState, useRef, useEffect } from "react";
import { renderContent } from "./utilities/RenderContent";

export default function StageInner({
  pageData,
  dragData,
  onDropOnRowItem,
  onDropOnCol,
  onSelectRow,
  onSelectContent,
  setDragData,
}) {

  useEffect(() => {
    console.log("pageData CAMBIÓ:", pageData);
  }, [pageData]);

  const [hoverRow, setHoverRow] = useState(null); // rowPosition actualmente resaltado
  const [hoverSide, setHoverSide] = useState(null); // "top" o "bottom"
  const [hoverCol, setHoverCol] = useState(null);
  
  
  const handleDragOver = (event, rowPosition) => {
    // 🚫 si se está arrastrando contenido, no mostrar hover de fila
    if (dragData?.type === "content") return;

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
    if (dragData?.type === "content") return;

    setHoverRow(null);
    setHoverSide(null);
  };

  const rowRefs = useRef({});
  
  return (
    <div className="stage-inner">
      <div className="stageContainer" style={pageData?.style}>          
        {pageData?.rows.map((row) => {
          const isHover = hoverRow === row.rowPosition;
          return (
            <div
              ref={(el) => (rowRefs.current[row.rowPosition] = el)}
              className="row-container-outer"
              key={row.id}
            >
              <button
                className="icon-move"
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  const rowEl = rowRefs.current[row.rowPosition];
                  if (rowEl) {
                    const clone = rowEl.cloneNode(true);

                    clone.style.position = "absolute";
                    clone.style.top = "-1000px";
                    clone.style.left = "0";
                    clone.style.width = `${rowEl.offsetWidth}px`;
                    clone.style.pointerEvents = "none";
                    clone.style.opacity = "0.95";

                    // 👉 estilos del ghost
                    clone.style.border = "2px solid #0d6efd";
                    clone.style.borderRadius = "6px";
                    clone.style.boxShadow = "0 10px 25px rgba(13,110,253,.35)";
                    clone.style.background = "#fff";

                    document.body.appendChild(clone);

                    e.dataTransfer.setDragImage(
                      clone,
                      rowEl.offsetWidth / 2,
                      rowEl.offsetHeight / 2
                    );

                    setTimeout(() => {
                      document.body.removeChild(clone);
                    }, 0);
                  }

                  setDragData({
                    type: "move",
                    rowPosition: row.rowPosition,
                  });
                }}
              >
                <span className="ico ico-move-vertical"></span>
              </button>

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
                  {row.cols?.map((col) => {
                    const hasContent = col.content.length > 0;

                    return (
                      <div
                        key={`${col.id}-${col.content.map(i => i.id).join("_")}`}
                        data-position={col.colPosition}
                        className={`col-item ${
                          dragData?.type === "content" &&
                          hoverCol?.row === row.rowPosition &&
                          hoverCol?.col === col.colPosition
                            ? "col-hover-content"
                            : ""
                        }`}
                        style={col.style}
                        onDragOver={(e) => {
                          if (dragData?.type !== "content") return;
                          e.preventDefault();
                          setHoverCol({
                            row: row.rowPosition,
                            col: col.colPosition,
                          });
                        }}
                        onDragLeave={() => {
                          if (dragData?.type !== "content") return;
                          setHoverCol(null);
                        }}
                        onDrop={(e) => {
                          if (dragData?.type !== "content") return;
                          e.preventDefault();
                          onDropOnCol({
                            rowPosition: row.rowPosition,
                            colPosition: col.colPosition,
                          });
                          setHoverCol(null);
                        }}
                      >
                        {/* 🔵 INDICADOR */}
                        {dragData?.type === "content" &&
                          hoverCol?.row === row.rowPosition &&
                          hoverCol?.col === col.colPosition && (
                            <div className="col-drop-indicator" data-name="arrástralo aquí" />
                        )}

                        {/* 🧱 PLACEHOLDER */}
                        {!hasContent && (
                          <div className="module-empty">
                            <span className="ico ico-arrow-up-alt1"></span>
                            <small>Arrastra contenido aquí</small>
                          </div>
                        )}

                        {/* 🧱 CONTENIDO */}
                        {col.content.map((item) => (
                          <div
                            key={item.id}
                            className="outer"
                            style={item.outerStyle}
                          >
                            <div
                              className={`content-item ${item.class}`}
                              data-name={item.label}
                              style={item.preStyle}
                              onClick={(e) => {
                                  e.stopPropagation(); // ⛔ evita seleccionar la fila
                                  onSelectContent({
                                    rowPosition: row.rowPosition,
                                    colPosition: col.colPosition,
                                    contentId: item.id,
                                  });
                                }}
                            >
                              {renderContent(item)}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
