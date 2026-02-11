import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Rows from "../../components/dashboard/DataRows";
import Content from "../../components/dashboard/Content";
import Setting from "../../components/dashboard/Setting";
import StageInner from "../../components/dashboard/StageInner";
import { defaultPageTemplate, rowCols } from "../../data/pageTemplate";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import RowSetting from "../../components/dashboard/RowSetting";
import { getTypeContent } from "../../data/TypeContent";
import logoSmall from "../../assets/images/logo-black.svg";
import ContentSetting from "../../components/dashboard/ContentSetting";

export default function IniPage() {
  const [activeTab, setActiveTab] = useState("content");
  const { id } = useParams();  
  const [pageData, setPageData] = useState(null);
  const [dragData, setDragData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

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
      draggedRow.style.margin = pageData.marginContent;

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
  // 🔹 INSERTAR COMPONENTE
  // ==============================
  const handleDropOnCol = ({ rowPosition, colPosition }) => {
    if (!dragData || dragData.type !== "content") return;
    const configContent = getTypeContent(dragData.moduleType);
    console.log('configContent: ', configContent)
    setPageData((prev) => {
      const page = structuredClone(prev);
    console.log('page.rows: ', page.rows)

      const rowIndex = page.rows.findIndex(
        (r) => r.rowPosition === rowPosition
      );
      if (rowIndex === -1) return prev;

      const colIndex = page.rows[rowIndex].cols.findIndex(
        (c) => c.colPosition === colPosition
      );
      if (colIndex === -1) return prev;

      const col = page.rows[rowIndex].cols[colIndex];

      // ➕ agregar nuevo módulo
      col.content = [
        ...col.content,
        {
          id: crypto.randomUUID(),
          position: col.content.length,
          class: dragData.moduleType,
          outerStyle: configContent.outerStyle,
          preStyle: configContent.preStyle,
          style: configContent.style,
          label: configContent.label,
          type: configContent.type,
          content: configContent.content,
          activeHeads: configContent.activeHeads
        },
      ];
      return page; // ✅ nueva referencia completa
    });

    setDragData(null);
  };


  useEffect(() => {
    if (!pageData) return;

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

    tooltipTriggerList.forEach((el) => {
      // Evitar tooltips duplicados
      if (!el._tooltip) {
        el._tooltip = new bootstrap.Tooltip(el);
      }
    });
  }, [pageData]);


  useEffect(() => {
  if (id === "0") {
    setPageData(defaultPageTemplate);
  }
}, []);

  if (!pageData) return <p>Cargando...</p>;

  return (
    <div>
      <div className="editor-conteniner">
        <div className="editor-header">
          <div className="editor-header-left">
            <div className="logo-small">
                <a href="#">
                    <img width="150" src={logoSmall} alt="Logo" />
                </a>
            </div>
          </div>
          <div className="editor-header-center"></div>
          <div className="editor-header-right">
            <button 
              type="button" 
              className="btn btn-link" 
              data-bs-toggle="tooltip" 
              data-bs-placement="left" 
              title="Vista previa"
            >
              <i className="bi bi-file-earmark-code fs-2"></i>
            </button>
            <button type="button" className="btn btn-outline-secondary">Exportar</button>
            <button type="button" className="btn btn-primary">Guardar</button>
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

    </div>
    
  );
}