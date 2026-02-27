import { useMemo } from "react";
import { buildEmailHtml } from "../../../data/EmailBuilder";

export default function EmailPreview({ pageData, viewMode, size }) {

  const htmlGenerated = useMemo(() => {
    if (!pageData) return "";
    return buildEmailHtml(pageData);
  }, [pageData]);

  const EMAIL_BASE_WIDTH = pageData?.maxwidth || 700;

  const previewClass = {
    pc: "preview-wrapper pc",
    tablet: "preview-wrapper table",
    mobile: "preview-wrapper movil",
  }[viewMode];

  /* 👇 CLAVE: ahora React desmonta TODO el preview */
  const previewKey = `${viewMode}-${size.width}-${size.height}`;

  const iframeKey = useMemo(() => {
    return `${viewMode}-${size.width}-${size.height}`;
  }, [viewMode, size.width, size.height]);

  return (
    <div className="row-setting-content p-3" key={previewKey}>      
      <div
        className={previewClass}
        style={{
          width: size.width,
          height: size.height,
          overflow: "auto",
          margin: "0 auto",
          background: "#e5e5e5",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <iframe
          key={iframeKey} // 🔴 fuerza recalculo real del contenido
          srcDoc={htmlGenerated}
          title="preview"
          sandbox="allow-same-origin"
          style={{
            width: "100%",
            height: "100%",
            border: "0",
            display: "block",
            overflowX: "hidden", // 🔴 importante
          }}
        />
      </div>
    </div>
  );
}
