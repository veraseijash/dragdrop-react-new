import { useState, useEffect } from "react";
import logoSmall from "../../assets/images/logo-black.svg";
import newTemplate from "../../assets/images/new-template.png";
import { Link } from "react-router-dom";
import { getTemplatesUser, deleteTemplate } from "../../services/Services";
import { toast } from "react-toastify";
import { confirmToast } from "../../components/dashboard/utilities/confirmToast"

export default function Index() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const userId = 1;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen(); // entrar
    } else {
      document.exitFullscreen(); // salir
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplatesUser(userId);
        setTemplates(data); // data debe ser un array
      } catch (error) {
        console.error("Error cargando plantillas:", error);
      }
    };

    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplatesUser(userId);
      setTemplates(data);
    } catch (error) {
      console.error("Error cargando plantillas:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = (id) => {
    confirmToast({
      message: "¿Seguro que deseas eliminar esta plantilla?",
      onConfirm: async () => {
        try {
          await deleteTemplate(id);

          toast.success("Plantilla eliminada");

          fetchTemplates(); // 🔁 recargar lista
        } catch (error) {
          toast.error("Error al eliminar");
        }
      },
    });
  };

  return (
  <div className="editor-root">
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
            className="btn text-primary-lite"
            onClick={toggleFullscreen}
          >
            <span
              className={`ico ${isFullscreen ? "ico-fullscreen-exit" : "ico-fullscreen"} fs-4`}
            ></span>
          </button>
        </div>
      </div>
      <div className="editor-base-conteniner">
        <div className="files-content">
          <div className="mb-4">
            <h4>Inicio rápido con plantillas básicas</h4>
            <div className="files-main-content">
              <div className="basic-templates-grid d-flex flex-column">
                  <div className="template-preview">
                    <img src={newTemplate} alt="template" />
                  </div>            
                  <Link to="/editor/0" className="btn btn-outline-primary">
                    Editar
                  </Link>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h4>Plantillas registradas</h4>
            <div className="files-main-content">
              {templates.length === 0 && <p>No hay plantillas</p>}
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="basic-templates-grid d-flex flex-column"
                >
                  <div className="actions-menu">
                    <div className="btn-group">
                      <button type="button" className="btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item" type="button"><i class="bi bi-send"></i> Enviar prueba</button></li>
                        <li><button className="dropdown-item" type="button"><i class="bi bi-upload"></i> Exportar</button></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li>
                          <button
                            className="dropdown-item color-red"
                            type="button"
                            onClick={() => handleDelete(template.id)}
                          >
                            <i className="bi bi-trash"></i> Eliminar
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="template-preview">
                    <img
                      src={
                        template.image && template.image.trim() !== ""
                          ? `${template.image}` // base64 real
                          : newTemplate // imagen por defecto
                        }
                      alt={template.name}
                    />
                  </div>
                  <Link
                    to={`/editor/${template.id}`} // aquí va el ID real
                    className="btn btn-outline-primary"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="editor-footer"></div>
    </div>
  </div>
  )
}