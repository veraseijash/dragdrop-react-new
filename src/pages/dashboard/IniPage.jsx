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

  const handleDragStart = (rowIndex) => {
    setDragData({ rowIndex });
  };

  const handleDropOnRowItem = (targetRowPosition) => {
    if (!dragData) return;

    // Clonar filas existentes
    let newRows = [...pageData.rows];    
    // Actualizar rowPosition del nuevo bloque
    const draggedRow = structuredClone(rowCols[dragData.rowIndex]);
    draggedRow.style.margin = pageData.marginContent;
    const newRow = {
      ...draggedRow,
      rowPosition: targetRowPosition + 1
    };
    // Obtener índice en el array
    const targetIndex = newRows.findIndex(
      (r) => r.rowPosition === targetRowPosition.rowPosition
    );
    if (targetIndex === -1) return;

    if (targetRowPosition.side === "top") {
      // Insertar antes
      newRows.splice(targetIndex, 0, newRow);
    } else if (targetRowPosition.side === "bottom") {
      // Insertar después
      newRows.splice(targetIndex + 1, 0, newRow);
    }

    // Recalcular rowPosition para que queden ordenados
    newRows = newRows.map((r, i) => ({
      ...r,
      rowPosition: i
    }));

    // Actualizar el estado
    setPageData({
      ...pageData,
        rows: newRows,
    });
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
        onClose={() => setSelectedRow(null)}
      />
    </div>
    
  );
}