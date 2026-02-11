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

  function getGridStyle(image) {
    const width = Number(image.width);
    const height = Number(image.height);

    const style = {};

    if (height > 1.5 * width) {
      style.gridRowStart = "span 2";
    }

    if (height >= 2 * width) {
      style.gridRowStart = "span 3";
    }

    if (width > 1.5 * height) {
      style.gridColumnStart = "span 2";
    }

    if (width >= 2 * height) {
      style.gridColumnStart = "span 3";
    }

    return style;
  }


  return (
    <div className="image-list">
      {listImg.map((img) => {
        // ✔ definido aquí
        const isDeleting = deletingId === img.public_id;

        return (
          <div
            key={img.asset_id}
            className="gallery-item"
            style={getGridStyle(img)}
          >
            {/* overlay SOLO para este item */}
            {isDeleting && (
              <div className="image-item-overlay">
                <div className="spinner-container">
                  <span className="ico ico-spinner10 spinner-rotate" />
                  <span>Eliminando...</span>
                </div>
              </div>
            )}

            <div className="delete-img">
              <button
                className="btn btn-sm"
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(img)}
              >
                ✕
              </button>
            </div>

            <img
              src={img.secure_url}
              alt={img.display_name}
            />

            <div className="gallery-btn">
              <button
                className="btn btn-primary btn-sm"
                type="button"
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
