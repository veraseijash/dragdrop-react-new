import { dataContent } from "../../data/DataContent";

export default function Content({ setDragData }) {
  return (
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
  );
}