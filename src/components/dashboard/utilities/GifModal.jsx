import { useState, useEffect } from "react";
import GifList from "./GifList";

export default function GifModal({
  open = false,
  onClose,
  onSelectGif,
}) {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = months[new Date().getMonth()];

  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectGif = (gif) => {
    onSelectGif?.(gif);
    onClose?.();
  };

  // 👉 cuando se abre el modal, inicializa con el mes actual
  useEffect(() => {
    if (open) {
      setInputValue(currentMonth);
      setSearchTerm(currentMonth);
    }
  }, [open, currentMonth]);

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    setSearchTerm(inputValue);
  };

  return (
    <div className={`image-setting-panel ${open ? "open" : ""}`}>
      {/* HEADER */}
      <div className="row-setting-header">
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: "200px" }}>Lista de Gifs</div>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar GIF..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
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
        <GifList
          search={searchTerm}
          onSelect={handleSelectGif}
        />
      </div>
    </div>
  );
}
