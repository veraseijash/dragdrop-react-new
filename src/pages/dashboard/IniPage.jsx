import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Rows from "../../components/dashboard/DataRows";
import Content from "../../components/dashboard/Content";
import Setting from "../../components/dashboard/Setting";
import StageInner from "../../components/dashboard/StageInner";
import { defaultPageTemplate, rowCols } from "../../data/pageTemplate";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import RowSetting from "../../components/dashboard/RowSetting";

export default function IniPage() {
  const [activeTab, setActiveTab] = useState("content");
  const { id } = useParams();  
  const [pageData, setPageData] = useState(null);
  const [dragData, setDragData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDragStart = (data) => {
    setDragData(data);
  };

  const handleDropOnRowItem = ({ rowPosition, side }) => {
    if (!dragData) return;

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
  }, [id]);

  if (!pageData) return <p>Cargando...</p>;

  return (
    <div>
      <div className="editor-conteniner">
        <div className="editor-header">
          <div className="editor-header-left">
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
              <i className="bi bi-file-earmark-code"></i>
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
                onDropOnRowItem={handleDropOnRowItem}
                onSelectRow={handleSelectRow}
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
                  <Content />
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

    </div>
    
  );
}