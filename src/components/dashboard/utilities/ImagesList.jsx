import { useEffect, useState } from "react";
import { getImageList, deleteImage } from "../../../services/Services";
import { toast } from "react-toastify";

export default function ImagesList({ onSelect, refreshKey }) {
  const [listImg, setListImg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
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
  }, [refreshKey]);

  async function handleDelete(img) {
    try {
      setDeletingId(img.public_id); // 🔒 bloquear SOLO este item

      await deleteImage(img.public_id);

      toast.success("Imagen eliminada");

      // quitarla del estado sin recargar todo (más rápido)
      setListImg((prev) =>
        prev.filter((i) => i.public_id !== img.public_id)
      );
    } catch (error) {
      toast.error("Error al eliminar imagen");
      console.error(error);
    } finally {
      setDeletingId(null); // 🔓 liberar
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
          <div key={img.asset_id} className="np-gallery-item">
            
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
              src={img.secure_url}
              alt={img.display_name}
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
