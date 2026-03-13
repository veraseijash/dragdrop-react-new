import { useRef, useState } from "react";
import { sendMail } from "../../../services/Services";
import { toast } from "react-toastify";

export default function ModalMailing({ open, onClose, templateHtml }) {

  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const activateShipping = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = formRef.current;

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      setIsLoading(false);
      return;
    }

    // validar que exista html
    if (!templateHtml) {
      console.error("No existe contenido HTML para enviar");
      toast.error("No existe contenido HTML para enviar");
      setIsLoading(false);
      onClose();
      return;
    }

    const subject = form.subject.value;
    const emails = form.sendingEmails.value;

    const emailArray = emails
      .split(",")
      .map(e => e.trim())
      .filter(e => e);

    const bodies = emailArray.map(email => ({
      to: email,
      subject: subject,
      text: "",
      html: templateHtml,
    }));

    try {

      await Promise.all(bodies.map(body => sendMail(body)));
      setIsLoading(false);
      console.log("Correos enviados correctamente");
      toast.success("Correos enviados correctamente");
      onClose();

    } catch (error) {
      console.error("Error enviando correos", error);
      setIsLoading(false);
      toast.error("Error enviando correos");
    }
  };

  if (!open) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "#00000066" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{position: 'relative'}}>

          <div className="modal-header">
            <h5 className="modal-title">Probar mailing</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          {isLoading && (
            <div className="loading-item-modal">
              <div className="spinner-container">
                <span className="ico ico-spinner10 spinner-rotate" />
                <span>Enviando...</span>
              </div>
            </div>
          )}
          <form
            ref={formRef}
            className="needs-validation"
            noValidate
            onSubmit={activateShipping}
          >

            <div className="modal-body">

              <label htmlFor="subject" className="form-label">
                Asunto
              </label>

              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                required
              />

              <div className="invalid-feedback">
                Debe ingresar el asunto.
              </div>

              <label htmlFor="sendingEmails" className="form-label mt-3">
                Direcciones de correos
              </label>

              <textarea
                className="form-control"
                id="sendingEmails"
                name="sendingEmails"
                rows="2"
                required
              />

              <div className="form-text">
                Separe cada correo con coma ",". Ejemplo: correo1@gmail.com, correo2@gmail.com
              </div>

              <div className="invalid-feedback">
                Debe ingresar al menos un correo.
              </div>

            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                Enviar
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}