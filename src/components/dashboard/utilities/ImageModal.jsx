import { useState } from "react";
import ImagesList from "../utilities/ImagesList";
import UploadImageDropdown from "../utilities/UploadImageDropdown";
import { uploadImageCloudinary } from "../../../services/Services";

export default function ImageModal({
  open = false,
  onClose,
  onSelectImage,
}) {
  // 🔄 controla el refresco de ImagesList
  const [refreshImages, setRefreshImages] = useState(0);
  const [loadingUpload, setLoadingUpload] = useState(false);

  async function handleUploadImage(file) {
    try {
      setLoadingUpload(true);

      // ☁️ subir a Cloudinary
      await uploadImageCloudinary(file);

      // 🔄 forzar recarga de la lista
      setRefreshImages((prev) => prev + 1);
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setLoadingUpload(false); // 🔓 liberar lista
    }
  }

  return (
    <div className={`image-setting-panel ${open ? "open" : ""}`}>
      {/* HEADER */}
      <div className="row-setting-header">
        <div className="d-flex align-items-center gap-2">
          <span>Lista de imágenes</span>

          {/* DROPDOWN */}
          <div className="dropdown">
            <button
              className="btn btn-outline-primary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Cargar imagen
            </button>

            <div
              className="dropdown-menu p-3"
              style={{ width: "320px" }}
              data-bs-auto-close="outside"
              onClick={(e) => e.stopPropagation()}
            >
              <UploadImageDropdown
                onSubmit={handleUploadImage}
              />
            </div>
          </div>
        </div>

        <button
          className="btn-close me-3"
          aria-label="Cerrar"
          onClick={onClose}
        />
      </div>

      {/* CONTENT */}
      <div className="row-setting-content p-3">
        <ImagesList
          onSelect={onSelectImage}
          refreshKey={refreshImages}
        />
        {loadingUpload && (
          <div className="image-list-overlay">
            <div className="spinner-container">
              <span className="ico ico-spinner10 spinner-rotate" />
              <span>Subiendo imagen...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
