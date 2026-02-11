import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

export default function SettingHtml({ content, onUpdate }) {
  const [showModal, setShowModal] = useState(false);

  function handleHtmlChange(value) {
    onUpdate({
      ...content,
      content: {
        ...content.content,
        html: value,
      },
    });
  }

  return (
    <>
      <div className="row-setting-content accordion-scroll">
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button accordion-zero-rounded"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
              >
                Contenido
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show">
              <div className="accordion-body p-0">
                <div className="p-2">                  
                  {/* Editor normal */}
                  <CodeMirror
                    value={
                      content?.content?.html ||
                      '<div style="text-align: center;">Aquí tu bloque HTML</div>'
                    }
                    height="300px"
                    extensions={[html()]}
                    onChange={handleHtmlChange}
                    theme="light"
                  />
                  <div className="expand-editor">
                    <button
                      className="btn btn-sm"
                      onClick={() => setShowModal(true)}
                    >
                      Expandir
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <div className="small text-primary-lite">
                    Usar tu propio código puede afectar la representación del mensaje. Asegúrate de usar <span className="inter-bold">HTML correcto y adaptable</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Bootstrap */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Editor de HTML</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <CodeMirror
                    value={content?.content?.html || ""}
                    height="400px"
                    extensions={[html()]}
                    onChange={handleHtmlChange}
                    theme="light"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}
          />
        </>
      )}
    </>
  );
}
