import { useState, useEffect } from "react";
import { generateEmailIA } from "../../../services/Services";
import { transformLayoutToRows } from "../../../utils/transformLayoutToRows"
export default function ModalIA({ open, onClose, templateIA }) {

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
      setPrompt(""); 
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const data = await generateEmailIA(prompt);
      console.log('data: ', data)
      const rows = transformLayoutToRows(data?.layout?.layout || []);
      const rowsWithPosition = rows.map(row => ({
        ...row,
        cols: row.cols.map(col => ({
          ...col,
          content: col.content.map(item => {
            // verifica tipo ignorando espacios y mayúsculas
            if ((item.type || "").trim().toLowerCase() === "module-image") {
              return { ...item, position: 0 };
            }
            return item;
          }),
        })),
      }));
      console.log('rows: ', rows)

      if (typeof templateIA === "function") {
        templateIA(rowsWithPosition); // pasa la info a Content → IniPage
      }

      onClose();
    } catch (err) {
      console.error("Error generando IA:", err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!open) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title d-flex justify-content-center align-items-center">
                <svg 
                  fill="currentColor" 
                  width="18px" 
                  height="auto" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9,15a1,1,0,1,0,1,1A1,1,0,0,0,9,15ZM2,14a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V15A1,1,0,0,0,2,14Zm20,0a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V15A1,1,0,0,0,22,14ZM17,7H13V5.72A2,2,0,0,0,14,4a2,2,0,0,0-4,0,2,2,0,0,0,1,1.72V7H7a3,3,0,0,0-3,3v9a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V10A3,3,0,0,0,17,7ZM13.72,9l-.5,2H10.78l-.5-2ZM18,19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V10A1,1,0,0,1,7,9H8.22L9,12.24A1,1,0,0,0,10,13h4a1,1,0,0,0,1-.76L15.78,9H17a1,1,0,0,1,1,1Zm-3-4a1,1,0,1,0,1,1A1,1,0,0,0,15,15Z"></path>
                </svg>
                &nbsp;Generar Email con IA
              </h5>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">

              <label className="form-label fw-bold">
                Describe el email que deseas crear
              </label>

              <textarea
                className="form-control"
                rows="6"
                placeholder="Ejemplo: Crear un email promocional con una imagen grande arriba, un título llamativo, un párrafo corto y un botón comprar..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <small className="text-muted">
                Describe columnas, textos, imágenes, botones o estilos que deseas.
              </small>

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar Email"}
              </button>

            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}