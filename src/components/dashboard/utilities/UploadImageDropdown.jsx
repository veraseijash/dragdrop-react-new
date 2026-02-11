import { useRef, useState } from "react";

export default function UploadImageDropdown({ onSubmit }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  function handleSelectFile(e) {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Solo se permiten imágenes");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function reset() {
    setFile(null);
    setPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }


  function closeDropdown() {
    // 1️⃣ limpiar estado
    setFile(null);
    setPreview(null);

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
            onSubmit?.(file);
          }}
        >
          Registrar
        </button>

      </div>
    </div>
  );
}
