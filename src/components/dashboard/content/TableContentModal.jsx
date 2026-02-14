import { useState, useEffect } from "react";

export default function TableContentModal({ open, onClose, content, onSave }) {
  const [localHeads, setLocalHeads] = useState([]);
  const [localRows, setLocalRows] = useState([]);

  // 👉 cargar datos al abrir
  useEffect(() => {
    if (content && open) {
      setLocalHeads(structuredClone(content.content.heads));
      setLocalRows(structuredClone(content.content.rows));
    }
  }, [content, open]);

  if (!open) return null;

  const handleHeadChange = (colIndex, value) => {
    const updated = [...localHeads];
    updated[0].cols[colIndex] = value;
    setLocalHeads(updated);
  };

  const handleRowChange = (rowIndex, colIndex, value) => {
    const updated = [...localRows];
    updated[rowIndex].cols[colIndex] = value;
    setLocalRows(updated);
  };

  const handleSave = () => {
    onSave({
      ...content,
      content: {
        ...content.content,
        heads: localHeads,
        rows: localRows,
      },
    });

    onClose();
  };

  const colCount = localHeads?.[0]?.cols?.length || 0;

  return (
    <div className="modal fade show d-block" style={{ background: "#00000066" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar contenido de la tabla</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <table className="table table-bordered">
              {content.activeHeads && (
                <thead>
                  <tr>
                    {Array.from({ length: colCount }).map((_, colIndex) => (
                      <th key={colIndex} style={content.content.headStyle}>
                        <input
                          className="form-control"
                          value={localHeads[0].cols[colIndex] || ""}
                          onChange={(e) =>
                            handleHeadChange(colIndex, e.target.value)
                          }
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {localRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.cols.map((col, colIndex) => (
                      <td key={colIndex} style={content.content.colStyle}>
                        <input
                          className="form-control"
                          value={col || ""}
                          onChange={(e) =>
                            handleRowChange(rowIndex, colIndex, e.target.value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Aplicar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
