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
  onMoveContent,   // ← importante
}) {
  useEffect(() => {
    console.log("pageData CAMBIÓ:", pageData);
  }, [pageData]);

  const [hoverRow, setHoverRow] = useState(null);
  const [hoverSide, setHoverSide] = useState(null);
  const [hoverContent, setHoverContent] = useState(null);

  // 🔴 ahora guarda también side
  const [hoverCol, setHoverCol] = useState(null);
  // { row, col, side }

  const rowRefs = useRef({});

  /* =========================
     ROW DRAG
  ========================= */

  const handleDragOver = (event, rowPosition) => {
    if (dragData?.type === "content") return;

    event.preventDefault();

    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const middle = rect.height / 2;

    setHoverRow(rowPosition);
    setHoverSide(offsetY < middle ? "top" : "bottom");
  };

  const handleDrop = (event, rowPosition) => {
    event.preventDefault();

    onDropOnRowItem({
      rowPosition,
      side: hoverSide,
    });

    setHoverRow(null);
    setHoverSide(null);
  };

  const handleDragLeave = () => {
    if (dragData?.type === "content") return;
    setHoverRow(null);
    setHoverSide(null);
  };

  /* =========================
     COLUMN DRAG  (NUEVO)
  ========================= */

  const handleDragOverCol = (event, rowPosition, colPosition) => {
    if (dragData?.type !== "content") return;

    event.preventDefault();

    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const middle = rect.height / 2;

    const side = offsetY < middle ? "top" : "bottom";

    setHoverCol({
      row: rowPosition,
      col: colPosition,
      side,
    });
  };

  const handleDropCol = (event, rowPosition, colPosition) => {
    if (dragData?.type !== "content") return;

    event.preventDefault();

    onDropOnCol({
      rowPosition,
      colPosition,
      side: hoverCol?.side, // 🔥 ahora sabes dónde insertar
    });

    setHoverCol(null);
  };

  /* ========================= */

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
              {/* MOVE ROW */}
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
                    clone.style.border = "2px solid #0d6efd";
                    clone.style.borderRadius = "6px";
                    clone.style.boxShadow =
                      "0 10px 25px rgba(13,110,253,.35)";
                    clone.style.background = "#fff";

                    document.body.appendChild(clone);

                    e.dataTransfer.setDragImage(
                      clone,
                      rowEl.offsetWidth / 2,
                      rowEl.offsetHeight / 2
                    );

                    setTimeout(() => document.body.removeChild(clone), 0);
                  }

                  setDragData({
                    type: "move",
                    rowPosition: row.rowPosition,
                  });
                }}
              >
                <span className="ico ico-move-vertical"></span>
              </button>

              {/* ROW DROP ZONE */}
              <div
                className={`rows-content
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
                  className="template-list" 
                  style={row.preStyle}
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
                      const isColHover =
                        dragData?.type === "content" &&
                        hoverCol?.row === row.rowPosition &&
                        hoverCol?.col === col.colPosition;

                      const hasContent = col.content.length > 0;

                      return (
                        <div
                          key={col.id}
                          className={`col-item 
                            ${isColHover && hoverCol.side === "top"
                              ? "hover-top"
                              : ""}
                            ${isColHover && hoverCol.side === "bottom"
                              ? "hover-bottom"
                              : ""}
                          `}
                          style={col.style}
                          onDragOver={(e) =>
                            handleDragOverCol(e, row.rowPosition, col.colPosition)
                          }
                          onDragLeave={() => setHoverCol(null)}
                          onDrop={(e) =>
                            handleDropCol(e, row.rowPosition, col.colPosition)
                          }
                        >
                          {/* 🔵 INDICADOR DINÁMICO */}
                          {isColHover && (
                            <div                            
                              data-name="arrástralo aquí"
                              className={`col-drop-indicator ${
                                hoverCol.side === "top"
                                  ? "indicator-top"
                                  : "indicator-bottom"
                              }`}
                            />
                          )}

                          {!hasContent && (
                            <div className="module-empty">
                              <span className="ico ico-arrow-up-alt1"></span>
                              <small>Arrastra contenido aquí</small>
                            </div>
                          )}

                          {col.content.map((item) => {
                            const isHoverContent =
                              dragData?.type === "move-content" &&
                              hoverContent?.targetId === item.id &&
                              hoverContent?.row === row.rowPosition &&
                              hoverContent?.col === col.colPosition;

                            return (
                              <div key={item.id} className="outer" style={item.outerStyle}>
                                <div
                                  className={`content-item ${item.class}`}
                                  data-name={item.label}
                                  style={item.preStyle}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectContent({
                                      rowPosition: row.rowPosition,
                                      colPosition: col.colPosition,
                                      contentId: item.id,
                                    });
                                  }}
                                  onDragOver={(e) => {
                                    if (dragData?.type !== "move-content") return;

                                    e.preventDefault();
                                    e.stopPropagation();

                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const offsetY = e.clientY - rect.top;
                                    const middle = rect.height / 2;

                                    const side = offsetY < middle ? "top" : "bottom";

                                    setHoverContent({
                                      row: row.rowPosition,
                                      col: col.colPosition,
                                      targetId: item.id,
                                      side,
                                    });
                                  }}
                                  onDrop={(e) => {
                                    if (dragData?.type !== "move-content") return;

                                    e.preventDefault();
                                    e.stopPropagation();

                                    // 🔥 recalcular la posición REAL del mouse al soltar
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const offsetY = e.clientY - rect.top;
                                    const middle = rect.height / 2;

                                    const dropSide = offsetY < middle ? "top" : "bottom";

                                    onMoveContent({
                                      fromRow: dragData.fromRow,
                                      fromCol: dragData.fromCol,
                                      contentId: dragData.contentId,
                                      toRow: row.rowPosition,
                                      toCol: col.colPosition,
                                      targetId: item.id,
                                      side: dropSide, // ⚠️ YA NO usamos hoverContent.side
                                    });

                                    setHoverContent(null);
                                  }}

                                >
                                  {/* 🔥 INDICADOR */}
                                  {isHoverContent && (
                                    <div
                                      className={`content-drop-indicator ${
                                        hoverContent?.side === "top"
                                          ? "indicator-top"
                                          : "indicator-bottom"
                                      }`}
                                    />
                                  )}

                                  <button
                                    className="icon-move-component"
                                    draggable
                                    onDragStart={(e) => {
                                      e.stopPropagation();

                                      const contentEl = e.currentTarget.closest(".outer");

                                      if (contentEl) {
                                        const clone = contentEl.cloneNode(true);

                                        clone.style.position = "absolute";
                                        clone.style.top = "-1000px";
                                        clone.style.left = "0";
                                        clone.style.width = `${contentEl.offsetWidth}px`;
                                        clone.style.pointerEvents = "none";
                                        clone.style.opacity = "0.9";
                                        clone.style.border = "2px dashed #198754";
                                        clone.style.background = "#fff";

                                        document.body.appendChild(clone);

                                        e.dataTransfer.setDragImage(
                                          clone,
                                          contentEl.offsetWidth / 2,
                                          contentEl.offsetHeight / 2
                                        );

                                        setTimeout(() => document.body.removeChild(clone), 0);
                                      }

                                      setDragData({
                                        type: "move-content",
                                        fromRow: row.rowPosition,
                                        fromCol: col.colPosition,
                                        contentId: item.id,
                                      });
                                    }}
                                  >
                                    <span className="ico ico-move-vertical"></span>
                                  </button>

                                  {renderContent(item)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
