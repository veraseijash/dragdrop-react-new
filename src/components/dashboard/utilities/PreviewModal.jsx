import { useState, useEffect } from "react";
import PreviewHeader from "./PreviewHeader";
import EmailPreview from "./EmailPreview";

export default function ImageModal({ open = false, onClose, pageData }) {

  const [viewMode, setViewMode] = useState("pc");
  const [size, setSize] = useState({ width: 1024, height: 1078 });

  const calculatePcHeight = () => window.innerHeight - 200;

  /* Cambia tamaño según modo */
  useEffect(() => {
    if (viewMode === "pc") {
      setSize({ width: 1024, height: calculatePcHeight() });
    }

    if (viewMode === "tablet") {
      setSize({ width: 1024, height: 768 });
    }

    if (viewMode === "mobile") {
      setSize({ width: 320, height: 480 });
    }
  }, [viewMode]);

  /* Resize solo PC */
  useEffect(() => {
    const handleResize = () => {
      if (viewMode === "pc") {
        setSize((prev) => ({
          ...prev,
          height: calculatePcHeight(),
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

  return (
    <div className={`image-setting-panel ${open ? "open" : ""}`}>

      <PreviewHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        size={size}
        onClose={onClose}
      />

      <EmailPreview
        pageData={pageData}
        viewMode={viewMode}
        size={size}
      />

    </div>
  );
}
