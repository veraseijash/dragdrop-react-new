export default function PreviewHeader({ viewMode, setViewMode, size, onClose }) {

  return (
    <div className="row-setting-header">
      <div className="d-flex align-items-center gap-4">

        <span>Vista preliminar</span>

        <div className="btn-group btn-group-sm" role="group" aria-label="Basic radio toggle button group"> 
          <input 
            type="radio" 
            className="btn-check" 
            name="btnradio" 
            id="btnradio1" 
            checked={viewMode === "pc"} 
            onChange={() => setViewMode("pc")} 
          /> 
          <label className="btn btn-outline-primary" htmlFor="btnradio1"> 
            <span className="ico ico-display"></span> 
          </label> 
          <input 
            type="radio" 
            className="btn-check" 
            name="btnradio" 
            id="btnradio2" 
            checked={viewMode === "tablet"} 
            onChange={() => setViewMode("tablet")} 
          /> 
          <label className="btn btn-outline-primary" htmlFor="btnradio2">
            <span className="ico ico-tablet"></span> 
          </label> 
          <input 
            type="radio" 
            className="btn-check" 
            name="btnradio" 
            id="btnradio3" 
            checked={viewMode === "mobile"} 
            onChange={() => setViewMode("mobile")} 
          /> 
          <label className="btn btn-outline-primary" htmlFor="btnradio3">
            <span className="ico ico-mobile"></span> 
          </label> 
        </div>
        <div className="d-flex align-items-center gap-1">
          <input 
            type="number" 
            min={250} 
            step={1} 
            className="form-control form-control-sm"
            value={size.width} 
            readOnly 
            style={{width:70}} 
          />
          X
          <input 
            type="number"
            min={250} 
            step={1} 
            className="form-control form-control-sm"
            value={size.height} 
            readOnly 
            style={{width:70}} 
          />
        </div>

      </div>

      <button className="btn-close me-3" onClick={onClose} />
    </div>
  );
}
