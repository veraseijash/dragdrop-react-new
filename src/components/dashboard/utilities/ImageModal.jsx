import { useState } from "react";
import ImagesList from "../utilities/ImagesList";
import UploadImageDropdown from "../utilities/UploadImageDropdown";
import { uploadImageCloudinary, searchImages } from "../../../services/Services";

export default function ImageModal({
  open = false,
  onClose,
  onSelectImage,
}) {
  // 🔄 controla el refresco de ImagesList
  const [refreshImages, setRefreshImages] = useState(0);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredImages, setFilteredImages] = useState(null);

  async function handleUploadImage(file, tags) {
    try {
      setLoadingUpload(true);
      const cleanTags = tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
        .join(',');
      // ☁️ subir a Cloudinary
      await uploadImageCloudinary(file, cleanTags);

      // 🔄 forzar recarga de la lista
      setRefreshImages((prev) => prev + 1);
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setLoadingUpload(false); // 🔓 liberar lista
    }
  }

  const handleSearch = async () => {
    try {
      // limpiar espacios
      const cleanText = searchText.trim();

      // si está vacío → reset
      if (!cleanText) {
        setFilteredImages(null);
        return;
      }

      // convertir "shopping, mall" → "shopping mall"
      const query = cleanText
        .split(',')
        .map(word => word.trim())
        .filter(Boolean)
        .join(' ');

      const result = await searchImages(query);

      setFilteredImages(result.data || []);
    } catch (error) {
      console.error('Error buscando imágenes:', error);
    }
  };

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
              style={{ width: "410px" }}
              data-bs-auto-close="outside"
              onClick={(e) => e.stopPropagation()}
            >
              <UploadImageDropdown
                onSubmit={handleUploadImage}
              />
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              style={{ width: '380px' }}
              placeholder='Separa con coma (",") si hay más de una palabra.'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleSearch}
            >
              Buscar
            </button>
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
          images={filteredImages} // 🔥 nuevo prop
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
