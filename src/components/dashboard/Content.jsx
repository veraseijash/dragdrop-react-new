import { useState } from "react";
import { dataContent } from "../../data/DataContent";
import ModalIA from "../../components/dashboard/utilities/ModalIA";

export default function Content({ setDragData, handleTemplateIA  }) {
  const [OpenIA, setOpenIA] = useState(false);

  // Función que recibe ModalIA y pasa inmediatamente a IniPage
  const handleIAFromModal = (rowsFromIA) => {
    if (typeof handleTemplateIA === "function") {
      handleTemplateIA(rowsFromIA); // pasa al IniPage
    }
  };

  return (
    <>
      <div className="content-list">
        {dataContent.map((item) => (
          <div
            key={item.type}
            className="content-item-2"
            data-type={item.type}
            draggable
            onDragStart={(e) => {
              // 🔴 OBLIGATORIO PARA FIREFOX
              e.dataTransfer.setData("text/plain", item.type);
              e.dataTransfer.effectAllowed = "copy";

              setDragData({
                type: "content",
                moduleType: item.type,
              });
            }}
          >
            <img src={item.icon} alt={item.title} />
            <span className="mt-1">{item.title}</span>
          </div>
        ))}
      </div>
      <div className="d-grid col-6 mx-auto">
        <button 
          className="btn btn-primary d-flex justify-content-center align-items-center" 
          type="button"
          onClick={() => setOpenIA(true)}
        >
          Generar por IA&nbsp;
          <svg 
            fill="currentColor" 
            width="18px" 
            height="auto" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9,15a1,1,0,1,0,1,1A1,1,0,0,0,9,15ZM2,14a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V15A1,1,0,0,0,2,14Zm20,0a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V15A1,1,0,0,0,22,14ZM17,7H13V5.72A2,2,0,0,0,14,4a2,2,0,0,0-4,0,2,2,0,0,0,1,1.72V7H7a3,3,0,0,0-3,3v9a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V10A3,3,0,0,0,17,7ZM13.72,9l-.5,2H10.78l-.5-2ZM18,19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V10A1,1,0,0,1,7,9H8.22L9,12.24A1,1,0,0,0,10,13h4a1,1,0,0,0,1-.76L15.78,9H17a1,1,0,0,1,1,1Zm-3-4a1,1,0,1,0,1,1A1,1,0,0,0,15,15Z"></path>
          </svg>
        </button>
      </div>
      <ModalIA
        open={OpenIA}
        onClose={() => setOpenIA(false)}
        templateIA={handleIAFromModal} // <-- se pasa al modal
      />
    </>
  );
}