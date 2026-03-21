import { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function UploadImageDropdown({ onSubmit }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState("");

  function handleSelectFile(e) {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setTags("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }


  function closeDropdown() {
    // 1️⃣ limpiar estado
    setFile(null);
    setPreview(null);
    setTags("");

    // 2️⃣ limpiar input file
    if (fileRef.current) {
      fileRef.current.value = "";
    }

    // 3️⃣ cerrar dropdown correcto
    const dropdown = fileRef.current?.closest(".dropdown");
    if (!dropdown) return;

    const toggle = dropdown.querySelector(".dropdown-toggle");
    toggle?.click();
  }



  return (
    <div className="upload-box">
      {!preview ? (
        <button
          type="button"
          className="upload-placeholder"
          onClick={() => fileRef.current.click()}
        >
          <span className="ico ico-cloud-upload1" style={{fontSize: '32px'}} />
          <span>Subir imagen</span>
        </button>
      ) : (
        <div className="upload-preview">
          <img src={preview} alt="preview" />
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleSelectFile}
      />
      <div className="mt-3">
        <label htmlFor="setTags" className="form-label">
          Coloque las etiquetas que identifiquen la imagen.
        </label>

        <input
          id="setTags"
          className="form-control"
          type="text"
          placeholder='Separa con coma "," si hay más de una etiqueta.'
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={() => {
            reset();
            closeDropdown();
          }}
        >
          Cancelar
        </button>


        <button
          className="btn btn-primary btn-sm"
          type="button"
          disabled={!file}
          onClick={() => {
            closeDropdown();
            onSubmit?.(file, tags);
          }}
        >
          Registrar
        </button>

      </div>
    </div>
  );
}
