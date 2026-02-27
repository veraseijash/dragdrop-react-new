import { useState, useEffect } from "react";
import { dataRows } from "../../data/DataRows";
import { getDefaults } from "../../services/Services";

export default function Rows({ onDragStart }) {
  const [option, setOption] = useState("empty");
  const [defaults, setDefaults] = useState([]);
  const [loadingDefaults, setLoadingDefaults] = useState(false);

  useEffect(() => {
    if (option === "default") {
      loadDefaults();
    }
  }, [option]);

  const loadDefaults = async () => {
    try {
      setLoadingDefaults(true);
      const data = await getDefaults();
      setDefaults(data);
    } catch (error) {
      console.error("Error cargando defaults", error);
    } finally {
      setLoadingDefaults(false);
    }
  };

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
          <div
            style={{
              width: "100%",
              overflowY: "auto",
              overflowX: 'hidden',
            }}
          >
            {loadingDefaults && <div>Cargando...</div>}

            {!loadingDefaults && defaults.length === 0 && (
              <div className="text-muted">No hay plantillas predeterminadas</div>
            )}

            {defaults.map((item) => (
              <div
                key={item.id}
                className="card mb-3 card-rows"
                draggable={true}
                onDragStart={() =>
                  onDragStart({
                    type: "new default",
                    data: item.template_list, // 👈 aquí mandas el template guardado
                  })
                }
              >
                <div className="card-body">
                  <div className="card-img">
                    <img
                      src={item.image} // 👈 base64 directo desde BD
                      alt={item.name}
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <label className="text-primary-lite">{item.name}</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}