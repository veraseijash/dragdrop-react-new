import { useMemo } from "react";
import { buildEmailHtml } from "../../../data/EmailBuilder";

export default function ImageModal({open = false, onClose, pageData}) {
  const htmlGenerated = useMemo(() => {
    if (!pageData) return "";
    return buildEmailHtml(pageData);
  }, [pageData]);

  return (
    <>
      <div className={`image-setting-panel ${open ? "open" : ""}`}>
        {/* HEADER */}
        <div className="row-setting-header">
          <div className="d-flex align-items-center gap-2">
            <span>Vista preliminar</span>
          </div>
          <button
            className="btn-close me-3"
            aria-label="Cerrar"
            onClick={onClose}
          />
        </div>
        {/* CONTENT */}
        <div className="row-setting-content p-3">
          <div className="preview-wrapper">
            <iframe
              title="email-preview"
              srcDoc={htmlGenerated}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </>
  )
}