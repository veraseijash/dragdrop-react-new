import { useEffect, useState } from "react";
import { getGiphy } from "../../../services/Services";

export default function GifList({ search, onSelect }) {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);

  function getGridStyle(gif) {
    const width = Number(gif.images.fixed_height.width);
    const height = Number(gif.images.fixed_height.height);

    const style = {};

    if (height > 1.5 * width) {
      style.gridRowStart = "span 2";
    }

    if (height >= 2 * width) {
      style.gridRowStart = "span 3";
    }

    if (width > 1.5 * height) {
      style.gridColumnStart = "span 2";
    }

    if (width >= 2 * height) {
      style.gridColumnStart = "span 3";
    }

    return style;
  }

  useEffect(() => {
    if (!search) return;
    setLoading(true);

    getGiphy(search).then((data) => {
      setGifs(data);
      setLoading(false);
    });
  }, [search]); // ✅ MUY IMPORTANTE

  if (loading) {
    return <div>Cargando GIFs...</div>;
  }


  return (
    <div className="image-list">
      {gifs.map((gif) => {
        return (
          <div
            key={gif.id}
            className="gallery-item"
            style={getGridStyle(gif)}
          >
            <img
              src={gif.images.fixed_height.url}
              alt={gif.title}
            />
            <div className="gallery-btn">
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={() => onSelect?.(gif)}
              >
                Seleccionar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )
}