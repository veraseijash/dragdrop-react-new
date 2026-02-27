import { toast } from "react-toastify";

export const confirmToast = ({ message, onConfirm, onCancel }) => {
  const id = toast.info(
    ({ closeToast }) => (
      <div>
        <p className="mb-2">{message}</p>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              onCancel?.();
              closeToast();
            }}
          >
            Cancelar
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              onConfirm?.();
              closeToast();
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,     // 🔴 importante (como confirm)
      closeOnClick: false,
      draggable: false,
    }
  );

  return id;
};
