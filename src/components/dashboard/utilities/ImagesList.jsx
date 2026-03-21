import { useEffect, useState } from "react";
import { getImageList, deleteImage } from "../../../services/Services";
import { toast } from "react-toastify";

export default function ImagesList({ onSelect, refreshKey, images }) {
  const [listImg, setListImg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // 🔥 CARGA NORMAL (cuando NO hay búsqueda)
  useEffect(() => {
    // si hay imágenes de búsqueda → NO cargar desde API
    if (images) return;

    setLoading(true);

    getImageList()
      .then((data) => {
        setListImg(data || []);
      })
      .catch(() => {
        toast.error("Error al cargar imágenes");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshKey, images]);

  // 🔥 CUANDO VIENEN RESULTADOS DE BÚSQUEDA
  useEffect(() => {
    if (images) {
      setListImg(images);
    }
  }, [images]);

  async function handleDelete(img) {
    try {
      setDeletingId(img.public_id);

      await deleteImage(img.public_id);

      toast.success("Imagen eliminada");

      setListImg((prev) =>
        prev.filter((i) => i.public_id !== img.public_id)
      );
    } catch (error) {
      toast.error("Error al eliminar imagen");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="p-3">Cargando imágenes...</div>;
  }

  if (!listImg.length) {
    return <div className="p-3">No hay imágenes disponibles</div>;
  }

  return (
    <div className="np-gallery">
      {listImg.map((img) => {
        const isDeleting = deletingId === img.public_id;

        return (
          <div key={img.public_id || img.asset_id} className="np-gallery-item">
            
            {/* Overlay de eliminación */}
            {isDeleting && (
              <div className="np-loading">
                <span className="ico ico-spinner10 spinner-rotate" />
                <span>Eliminando...</span>
              </div>
            )}

            {/* Botón eliminar */}
            <button
              className="np-delete-btn"
              disabled={isDeleting}
              onClick={() => handleDelete(img)}
            >
              ✕
            </button>

            {/* Imagen */}
            <img
              src={img.secure_url || img.url} // 🔥 soporta search y normal
              alt={img.display_name || "image"}
              loading="lazy"
            />

            {/* Hover actions */}
            <div className="np-overlay">
              <button
                disabled={isDeleting}
                onClick={() => onSelect?.(img)}
              >
                Seleccionar
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}
