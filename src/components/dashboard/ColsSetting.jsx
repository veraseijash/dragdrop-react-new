import { Fragment, useRef, useState } from "react";
import ColSetting from "../dashboard/ColSetting";
import { newCol } from "../../data/pageTemplate"; // ajusta la ruta

export default function ColsSetting({
  cols,
  setCols,
  colActive,
  setColActive,
}) {
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [liveWidths, setLiveWidths] = useState({});
  const selectedCol = cols[colActive] ?? cols[0];
  const selectedIndex = colActive ?? 0;

  if (!Array.isArray(cols) || cols.length === 0) return null;

  const MIN = 5; // %

  // =========================
  // Resize columnas
  // =========================
  const startResize = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);

    const containerWidth = containerRef.current.offsetWidth;
    const startX = e.clientX;

    const leftWidth = parseInt(cols[index].style.width, 10);
    const rightWidth = parseInt(cols[index + 1].style.width, 10);

    let lastDelta = 0;

    const onMouseMove = (ev) => {
      const deltaPx = ev.clientX - startX;
      const deltaPercent = Math.round(
        (deltaPx / containerWidth) * 100
      );

      if (deltaPercent === lastDelta) return;
      lastDelta = deltaPercent;

      let newLeft = leftWidth + deltaPercent;
      let newRight = rightWidth - deltaPercent;

      if (newLeft < MIN || newRight < MIN) return;

      setLiveWidths({
        [index]: newLeft,
        [index + 1]: newRight,
      });

      const updatedCols = cols.map((col, i) => {
        if (i === index) {
          return {
            ...col,
            style: { ...col.style, width: `${newLeft}%` },
          };
        }
        if (i === index + 1) {
          return {
            ...col,
            style: { ...col.style, width: `${newRight}%` },
          };
        }
        return col;
      });

      setCols(updatedCols);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      setLiveWidths({});
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // =========================
  // nueva columna
  // =========================

  const addNewColumn = () => {
    setCols((prevCols) => {
      const cols = [...prevCols];

      // buscar desde el final una columna que pueda ceder 5%
      for (let i = cols.length - 1; i >= 0; i--) {
        const width = parseInt(cols[i].style.width, 10);

        if (width > 5) {
          // quitar 5% a esa columna
          cols[i] = {
            ...cols[i],
            style: {
              ...cols[i].style,
              width: `${width - 5}%`,
            },
          };

          // agregar nueva columna de 5%
          cols.push({
            ...newCol,
            colPosition: cols.length,
            style: {
              ...newCol.style,
              width: "5%",
            },
          });

          return cols;
        }
      }

      // si todas están en 5%, no se puede agregar
      return prevCols;
    });
  };

  const handleDeleteColumn = (deleteIndex) => {
    setCols((prevCols) => {
      if (prevCols.length <= 1) return prevCols;

      const cols = [...prevCols];
      const deletedCol = cols[deleteIndex];
      const deletedWidth = parseInt(deletedCol.style.width, 10);

      // columna que recibirá el ancho
      const targetIndex =
        deleteIndex > 0 ? deleteIndex - 1 : deleteIndex + 1;

      // sumar width
      cols[targetIndex] = {
        ...cols[targetIndex],
        style: {
          ...cols[targetIndex].style,
          width: `${
            parseInt(cols[targetIndex].style.width, 10) + deletedWidth
          }%`,
        },
      };

      // eliminar columna
      cols.splice(deleteIndex, 1);

      // reordenar colPosition
      return cols.map((col, i) => ({
        ...col,
        colPosition: i,
      }));
    });

    // 🔥 seleccionar la columna que recibió el ancho
    setColActive(deleteIndex > 0 ? deleteIndex - 1 : 0);
  };

  const handleUpdateColumn = (index, updatedCol) => {
    setCols((prevCols) =>
      prevCols.map((col, i) =>
        i === index ? updatedCol : col
      )
    );
  };

  const formatPercent = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return `${num.toFixed(2)}%`;
  };

  return (
    <div className="mt-2">
      <div className="d-flex justify-content-end mb-1">
        <button
          className="btn btn-link btn-sm text-primary text-decoration-none pb-0"
          style={{ fontSize: "12px" }}
          onClick={addNewColumn}
        >
          + Nueva columna
        </button>
      </div>

      <div className="cols-group bg-gray-200" ref={containerRef}>
        {cols.map((col, index) => {
          const isActive = colActive === index;
          const showDivider = index < cols.length - 1;

          return (
            <Fragment key={index}>
              <button
                className={`col-item ${isActive ? "active" : ""}`}
                style={{ width: col.style?.width }}
                onClick={() => setColActive(index)}
              >
                <span className="col-span">
                  {isResizing
                    ? formatPercent(col.style?.width)
                    : index + 1}
                </span>

                {isActive && <span className="panel-indicator" />}
              </button>

              {showDivider && (
                <button
                  className="col-divider"
                  onMouseDown={(e) => startResize(e, index)}
                >
                  <i className="bi bi-grip-vertical"></i>
                </button>
              )}
            </Fragment>
          );
        })}
      </div>
      <ColSetting
        col={selectedCol}
        index={selectedIndex}
        onDelete={handleDeleteColumn}
        onChange={handleUpdateColumn}
      />
    </div>
  );
}
