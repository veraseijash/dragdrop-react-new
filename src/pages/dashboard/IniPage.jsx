import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Rows from "../../components/dashboard/DataRows";
import Content from "../../components/dashboard/Content";
import Setting from "../../components/dashboard/Setting";
import StageInner from "../../components/dashboard/StageInner";
import { defaultPageTemplate, rowCols } from "../../data/pageTemplate";
import RowSetting from "../../components/dashboard/RowSetting";
import { getTypeContent } from "../../data/TypeContent";
import logoSmall from "../../assets/images/logo-black.svg";
import ContentSetting from "../../components/dashboard/ContentSetting";
import { createTemplate, updateTemplate, getTemplate, generateImage } from "../../services/Services";
import { buildEmailHtml } from "../../data/EmailBuilder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tippy from '@tippyjs/react';
import PreviewModal from "../../components/dashboard/utilities/PreviewModal";

export default function IniPage() {
  const [activeTab, setActiveTab] = useState("content");
  const { id } = useParams();  
  const [pageData, setPageData] = useState(null);
  const [dragData, setDragData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  if (pageData?.name) {
    setTemplateName(pageData.name);
  }
}, [pageData]);

  const handleDragStart = (data) => {
    setDragData(data);
  };

  const handleDropOnRowItem = ({ rowPosition, side }) => {
    if (!dragData) return;
    if (dragData.type === 'content') return;
    let newRows = [...pageData.rows];

    const targetIndex = newRows.findIndex(
      (r) => r.rowPosition === rowPosition
    );

    if (targetIndex === -1) return;

    // ==============================
    // 🔹 MOVER FILA EXISTENTE
    // ==============================
    if (dragData.type === "move") {
      const fromIndex = newRows.findIndex(
        (r) => r.rowPosition === dragData.rowPosition
      );

      if (fromIndex === -1) return;

      const [movedRow] = newRows.splice(fromIndex, 1);

      let insertIndex = side === "top" ? targetIndex : targetIndex + 1;
      if (fromIndex < insertIndex) insertIndex--;

      newRows.splice(insertIndex, 0, movedRow);
    }

    // ==============================
    // 🔹 INSERTAR FILA NUEVA
    // ==============================
    if (dragData.type === "new") {
      const draggedRow = structuredClone(rowCols[dragData.rowIndex]);

      draggedRow.style = {
        ...draggedRow.style,
        margin: pageData.marginContent,
        backgroundColor: pageData.backgroundColorContent, // 👈 aquí lo inyectas
      };

      const newRow = {
        ...draggedRow,
        id: crypto.randomUUID(),
        rowPosition: 0,
      };

      if (side === "top") {
        newRows.splice(targetIndex, 0, newRow);
      } else {
        newRows.splice(targetIndex + 1, 0, newRow);
      }
    }

    // ==============================
    // 🔹 Recalcular posiciones
    // ==============================
    newRows = newRows.map((r, i) => ({
      ...r,
      rowPosition: i,
    }));

    setPageData({
      ...pageData,
      rows: newRows,
    });

    setDragData(null);
  };

  const handleUpdateContent = (updatedContent) => {
    setPageData((prev) => {
      const page = structuredClone(prev);
      let updated = false;

      for (const row of page.rows) {
        for (const col of row.cols) {
          const index = col.content.findIndex(
            (c) => c.id === updatedContent.id
          );

          if (index !== -1) {
            col.content[index] = updatedContent;
            updated = true;
            break;
          }
        }
        if (updated) break;
      }

      return updated ? page : prev;
    });

    setSelectedContent(updatedContent);
  };

  // ==============================
  // 🔹 ELIMINAR COMPONENTE
  // ==============================
  const handleOnDeleteContent = (contentId) => {
    setPageData((prev) => {
      const page = structuredClone(prev);
      let removed = false;

      for (const row of page.rows) {
        for (const col of row.cols) {
          const index = col.content.findIndex(
            (c) => c.id === contentId
          );

          if (index !== -1) {
            col.content.splice(index, 1);

            // Recalcular posiciones si las usas
            col.content = col.content.map((c, i) => ({
              ...c,
              position: i,
            }));

            removed = true;
            break;
          }
        }
        if (removed) break;
      }

      return removed ? page : prev;
    });

    // cerrar panel de settings
    setSelectedContent(null);
  };


  // ==============================
  // 🔹 CLONAR COMPONENTE
  // ==============================
  const handleOnCloneContent = (contentId) => {
    setPageData((prev) => {
      const page = structuredClone(prev);
      let cloned = false;

      for (const row of page.rows) {
        for (const col of row.cols) {
          const index = col.content.findIndex(
            (c) => c.id === contentId
          );

          if (index !== -1) {
            const original = col.content[index];

            // 🧬 clonar componente completo
            const clonedContent = structuredClone(original);

            // 🆕 ID totalmente nuevo
            clonedContent.id = crypto.randomUUID();

            // (opcional pero recomendado)
            clonedContent.position = index + 1;

            // insertar justo debajo del original
            col.content.splice(index + 1, 0, clonedContent);

            // 🔢 recalcular posiciones
            col.content = col.content.map((c, i) => ({
              ...c,
              position: i,
            }));

            cloned = true;
            break;
          }
        }
        if (cloned) break;
      }

      return cloned ? page : prev;
    });

    // cerrar panel / evitar referencias visuales
    setSelectedContent(null);
  };




  const handleUpdateRow = (updatedRow) => {
    setPageData((prev) => ({
      ...prev,
      rows: prev.rows.map((r) =>
        r.rowPosition === updatedRow.rowPosition ? updatedRow : r
      ),
    }));

    // Mantener sincronizado el panel
    setSelectedRow(updatedRow);
  };

  const handleSelectRow = (rowPosition) => {
    const currentRow = pageData.rows.find(
      (r) => r.rowPosition === rowPosition
    );

    setSelectedRow(currentRow || null);
    setSelectedContent(null)
  };
  const handleSelectContent = ({ rowPosition, colPosition, contentId }) => {
    const currentRow = pageData.rows.find(
      (r) => r.rowPosition === rowPosition
    );

    if (!currentRow) {
      setSelectedContent(null);
      return;
    }

    const currentCol = currentRow.cols.find(
      (c) => c.colPosition === colPosition
    );

    if (!currentCol) {
      setSelectedContent(null);
      return;
    }

    const currentContent = currentCol.content.find(
      (c) => c.id === contentId
    );

    setSelectedContent(currentContent || null);
    setSelectedRow(null); 
  };

  const handleDeleteRow = (rowPosition) => {
    setPageData((prev) => {
      if (prev.rows.length <= 1) {
        return prev; // ❌ no se puede eliminar la última fila
      }

      const newRows = prev.rows
        .filter((r) => r.rowPosition !== rowPosition)
        .map((r, index) => ({
          ...r,
          rowPosition: index,
        }));

      return {
        ...prev,
        rows: newRows,
      };
    });

    setSelectedRow(null);
  };

  const handleCloneRow = (rowToClone) => {
    setPageData((prev) => {
      const rows = [...prev.rows];

      const index = rows.findIndex(
        (r) => r.rowPosition === rowToClone.rowPosition
      );

      if (index === -1) return prev;

      // 🔁 Clon profundo para evitar referencias compartidas
      const clonedRow = structuredClone(rowToClone);

      // (opcional) si tienes ids únicos
      clonedRow.id = crypto.randomUUID();

      // Insertar justo debajo
      rows.splice(index + 1, 0, clonedRow);

      // Recalcular posiciones
      const updatedRows = rows.map((r, i) => ({
        ...r,
        rowPosition: i,
      }));

      return {
        ...prev,
        rows: updatedRows,
      };
    });
  };
  // ==============================
// 🔹 INSERTAR COMPONENTE (con TOP / BOTTOM)
// ==============================
  const handleDropOnCol = ({ rowPosition, colPosition, side }) => {
    if (!dragData || dragData.type !== "content") return;

    const configContent = getTypeContent(dragData.moduleType);

    setPageData((prev) => {
      const page = structuredClone(prev);

      const rowIndex = page.rows.findIndex(
        (r) => r.rowPosition === rowPosition
      );
      if (rowIndex === -1) return prev;

      const colIndex = page.rows[rowIndex].cols.findIndex(
        (c) => c.colPosition === colPosition
      );
      if (colIndex === -1) return prev;

      const col = page.rows[rowIndex].cols[colIndex];

      // 🆕 Crear nuevo componente
      const newContent = {
        id: crypto.randomUUID(),
        position: 0,
        class: dragData.moduleType,
        outerStyle: configContent.outerStyle,
        preStyle: configContent.preStyle,
        style: configContent.style,
        label: configContent.label,
        type: configContent.type,
        content: configContent.content,
        activeHeads: configContent.activeHeads,
      };

      let newContentArray = [...col.content];

      // ==============================
      // 🔥 INSERTAR SEGÚN POSICIÓN VISUAL
      // ==============================
      if (side === "top") {
        newContentArray.unshift(newContent); // insertar arriba
      } else {
        newContentArray.push(newContent); // insertar abajo
      }

      // 🔢 Recalcular posiciones internas
      newContentArray = newContentArray.map((c, i) => ({
        ...c,
        position: i,
      }));

      page.rows[rowIndex].cols[colIndex].content = newContentArray;

      return page;
    });

    setDragData(null);
  };

  // ==============================
  // 🔹 MOVER COMPONENTE EXISTENTE
  // ==============================
  const handleMoveContent = ({
    fromRow,
    fromCol,
    contentId,
    toRow,
    toCol,
    targetId,
    side,
  }) => {
    setPageData((prev) => {
      const page = structuredClone(prev);

      const sourceRow = page.rows.find((r) => r.rowPosition === fromRow);
      const targetRow = page.rows.find((r) => r.rowPosition === toRow);

      if (!sourceRow || !targetRow) return prev;

      const sourceCol = sourceRow.cols.find((c) => c.colPosition === fromCol);
      const targetCol = targetRow.cols.find((c) => c.colPosition === toCol);

      if (!sourceCol || !targetCol) return prev;

      // 🔥 encontrar item origen SIN removerlo aún
      const sourceIndex = sourceCol.content.findIndex((c) => c.id === contentId);
      if (sourceIndex === -1) return prev;

      const targetIndex = targetCol.content.findIndex((c) => c.id === targetId);
      if (targetIndex === -1) return prev;

      const movedItem = sourceCol.content[sourceIndex];

      // ===============================
      // 🧠 CALCULAR ÍNDICE DESTINO REAL
      // ===============================
      let insertIndex = side === "bottom"
        ? targetIndex + 1
        : targetIndex;

      // 🔥 si es la misma columna y vienes desde arriba,
      // hay que compensar porque luego lo quitaremos
      if (sourceCol === targetCol && sourceIndex < insertIndex) {
        insertIndex--;
      }

      // ===============================
      // 🔥 AHORA sí removemos
      // ===============================
      sourceCol.content.splice(sourceIndex, 1);

      // insertar en destino
      targetCol.content.splice(insertIndex, 0, movedItem);

      // 🔢 recalcular posiciones
      sourceCol.content = sourceCol.content.map((c, i) => ({
        ...c,
        position: i,
      }));

      if (sourceCol !== targetCol) {
        targetCol.content = targetCol.content.map((c, i) => ({
          ...c,
          position: i,
        }));
      }

      return page;
    });

    setDragData(null);
  };

  useEffect(() => {
    const fetchPageData = async () => {
      if (id === "0") {
        // Nuevo template
        setPageData(defaultPageTemplate);
      } else {
        // Traer template existente
        try {
          const data = await getTemplate(id);
          if (data?.template_list) {
            data.template_list.id = id;
            data.template_list.name= data.name;
            console.log('data.template_list: ', data.template_list)
            setPageData(data.template_list); // ⚡ aquí asignamos solo el JSON del editor
          } else {
            console.warn("Template no tiene template_list");
            setPageData(defaultPageTemplate); // fallback
          }
        } catch (error) {
          console.error("Error cargando template:", error);
          setPageData(defaultPageTemplate); // fallback
        }
      }
    };

    fetchPageData();
  }, [id]);

  if (!pageData) return <p>Cargando...</p>;

  // ===============================
  // 🧠 REGISTRAR TEMPLATE
  // ===============================
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
        toast.error("Debe ingresar un nombre para la plantilla");
        return;
      }
    try {      
      setIsLoading(true);
      const htmlGenerated = buildEmailHtml(pageData);
      const image64 = await generateImage(htmlGenerated);
      // 🔹 Construir objeto requerido por backend
      const selectedTemplate = {
        user_id: 1,
        name: templateName,
        template_list: pageData,   // 👉 todo el JSON del editor
        html: htmlGenerated,
        image: image64,
      };
      let response;

      // ==============================
      // 🆕 CREAR
      // ==============================
      if (!pageData.id || pageData.id === 0) {
        response = await createTemplate(selectedTemplate);

        // ⚠️ backend devuelve el nuevo id
        setPageData((prev) => ({
          ...prev,
          id: response.id,
        }));
      }
      // ==============================
      // ✏️ ACTUALIZAR
      // ==============================
      else {
        response = await updateTemplate(pageData.id, selectedTemplate);
      }

      toast.success("Plantilla guardada correctamente");

    } catch (error) {
      console.error("Error guardando plantilla", error);
      toast.error("Ocurrió un error al guardar");
    } finally {
      // 🔹 Desactivar loader
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`editor-root ${
        dragData?.type === "move-content" ? "is-moving-content" : ""
      }`}
    >
      {isLoading && (
        <div className="loading-item-overlay">
          <div className="spinner-container">
            <span className="ico ico-spinner10 spinner-rotate" />
            <span>Registrando...</span>
          </div>
        </div>
      )}
      <div className="editor-conteniner">
        
        <div className="editor-header">
          <div className="editor-header-left">
            <div className="logo-small">
              <a href="#">
                  <img width="150" src={logoSmall} alt="Logo" />
              </a>
            </div>            
            <Tippy content="Ir a inicio" placement="right">
              <Link 
                to="/" 
                className="btn btn-outline-primary"
                style={{paddingTop: '7px'}}
              >
                <span className="ico ico-arrow-left1"></span>
              </Link>
            </Tippy>
          </div>
          <div className="editor-header-center"></div>
          <div className="editor-header-right">
            <Tippy content="Vista previa" placement="left">
              <button 
                type="button" 
                className="btn btn-link"
                onClick={() => setOpenPreviewModal(true)}
              >
                <i className="bi bi-file-earmark-code fs-2"></i>
              </button>
            </Tippy>
            <button type="button" className="btn btn-outline-secondary">Exportar</button>
            <div className="dropdown">
              <button 
                type="button" 
                className="btn btn-primary dropdown-toggle no-caret"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Guardar
              </button>
              <div
                className="dropdown-menu p-3"
                style={{ width: "320px" }}
                data-bs-auto-close="outside"
              >
                <label for="templateName" className="form-label">Nombre de la plantilla</label>
                <input
                  type="text"
                  className="form-control"
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
                <div className="d-flex justify-content-end mt-4 gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleSaveTemplate}
                  >
                    Registrar
                  </button>

                </div>
              </div>
            </div>
            
          </div>
        </div>
        <div className="editor-base-conteniner">
          <div className="app-contenier">
            <div className="page-stage">
              <StageInner
                pageData={pageData}
                dragData={dragData}
                onDropOnRowItem={handleDropOnRowItem}
                onDropOnCol={handleDropOnCol}
                onSelectRow={handleSelectRow}
                onSelectContent={handleSelectContent}
                setDragData={setDragData}
                onMoveContent={handleMoveContent}   // 👈 NUEVO
              />

            </div>
            <div className="sidebar-component">
              <ul className="nav nav-tabs nav-tabs-dd">
                <li className="nav-item">
                  <button
                    className={`nav-link nav-dd ${activeTab === "content" ? "active" : ""}`}
                    onClick={() => setActiveTab("content")}
                  >
                    <span className="ico ico-insert-template me-1"></span>
                    Contenido
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link nav-dd ${activeTab === "rows" ? "active" : ""}`}
                    onClick={() => setActiveTab("rows")}
                  >
                    <span className="ico ico-page-break me-1"></span>
                    Filas
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link nav-dd ${activeTab === "setting" ? "active" : ""}`}
                    onClick={() => setActiveTab("setting")}
                  >
                    <span className="ico ico-equalizer me-1"></span>
                    Configuración
                  </button>
                </li>
              </ul>
              <div>
                {activeTab === "content" && (
                  <Content setDragData={setDragData} />
                )}

                {activeTab === "rows" && (
                  <Rows onDragStart={handleDragStart} />
                )}

                {activeTab === "setting" && (
                  <Setting pageData={pageData} setPageData={setPageData} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="editor-footer"></div>
      </div>
      <RowSetting
        row={selectedRow}
        onChangeRow={handleUpdateRow}
        onDeleteRow={handleDeleteRow}
        onCloneRow={handleCloneRow}
        canDelete={pageData.rows.length > 1}
        onClose={() => setSelectedRow(null)}
      />
      <ContentSetting 
        content={selectedContent}
        onClose={() => setSelectedContent(null)}
        onChangeContent={handleUpdateContent}
        onDeleteContent={handleOnDeleteContent}
        onCloneContent={handleOnCloneContent}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <PreviewModal
        open={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        pageData={pageData}
      />
    </div>
    
  );
}