import { useState } from "react";
import { dataRows } from "../../data/DataRows";

export default function Rows({ onDragStart }) {
  const [option, setOption] = useState("empty");

  return (
    <>
      <div className="p-3 pb-0">
        <select
          className="form-select"
          value={option}
          onChange={(e) => setOption(e.target.value)}
        >
          <option value="empty">Vacías</option>
          <option value="default">Filas predeterminadas</option>
        </select>
      </div>
      {option === "empty" && (
        <div 
          className="p-3" 
          style={{ 
            width: "100%", 
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}>
          {dataRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="card mb-3 card-rows"
              style={{ width: "100%" }}
              data-id={rowIndex}
              draggable={true}
              onDragStart={() =>
                onDragStart({
                  type: "new",
                  rowIndex
                })
              }

            >
              <div className="card-body d-flex gap-2">
                {row.cols.map((col, colIndex) => (
                  <div
                    key={colIndex}
                    style={{
                      width: `${col}%`,
                      background: "#e9ecef",
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "4px",
                      textAlign: "center",
                      height: "30px",
                    }}
                  >                    
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {option === "default" && (
        <div className="p-3 border rounded">
          <h4>Filas predeterminadas</h4>
          <p>Aquí irán las filas configuradas por defecto.</p>
        </div>
      )}
    </>
  )
}