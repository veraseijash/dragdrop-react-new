import SettingButton from "./content/SettingButton";
import SettingHeading from "./content/SettingHeading";
import SettingList from "./content/SettingList";
import SettingImage from "./content/SettingImage";
import SettingTable from "./content/SettingTable";
import SettingDivider from "./content/SettingDivider";
import SettingSpacer from "./content/SettingSpacer";
import SettingSocial from "./content/SettingSocial";
import SettingVideo from "./content/SettingVideo";
import SettingHtml from "./content/SettingHtml";
import SettingGif from "./content/SettingGif.jsx";

export default function ContentSetting({
  content, 
  onClose,
  onChangeContent,
  onDeleteContent,
  onCloneContent,

}) {
  console.log('content: ', content)
  
  function renderSettingContent(content) {
    if (!content) return null;
    switch (content.type) {
      case "module-button":
        return <SettingButton 
          content={content}
          onUpdate={onChangeContent}
        />;

      case "module-image":
        return <SettingImage
         content={content}
         onUpdate={onChangeContent}
        />;
      case "module-heading":
        return <SettingHeading
          content={content}
          onUpdate={onChangeContent}
        />;
      case "module-list":
        return <SettingList
          content={content}
          onUpdate={onChangeContent}
        />;
      case "module-table":
        return <SettingTable
          content={content}
          onUpdate={onChangeContent}
        />;
      case "module-divider":
        return <SettingDivider
          content={content}
          onUpdate={onChangeContent}
        />;
      case "module-spacer":
        return <SettingSpacer
          content={content}
          onUpdate={onChangeContent}
        />;
      case "module-social":
        return <SettingSocial
          content={content}
          onUpdate={onChangeContent}
        />;
      case "module-video":
        return <SettingVideo
         content={content}
         onUpdate={onChangeContent}
        />;
      case "module-html":
        return <SettingHtml
         content={content}
         onUpdate={onChangeContent}
        />;
      case "module-gif":
        return <SettingGif
         content={content}
         onUpdate={onChangeContent}
        />;
      default:
        return <p>No hay propiedades para este tipo</p>;
    }
  }

  return (
    <div className={`row-setting-panel ${content ? "open" : ""}`}>
      <div className="row-setting-header">
        <span>Propiedades de 
          <span className="text-content ms-2">
            {content?.label}
          </span>
        </span>
        <div className="sidebar-title">
            <button
              className="btn-delete"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Eliminar"
              onClick={() => onDeleteContent(content.id)}
            >
              <i className="bi bi-trash"></i>
            </button>
            <button
              className="btn-clone"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Duplicar"
              onClick={() => onCloneContent(content.id)}
            >
              <i className="bi bi-copy"></i>
            </button>
           <button className="btn-close" onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="row-setting-content accordion-scroll ">
        {renderSettingContent(content)}
      </div>
    </div>
  )
}