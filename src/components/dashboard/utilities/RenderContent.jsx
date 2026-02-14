import React from "react";

export function renderContent(item) {
  switch (item.type) {
    case "module-image":
      return (
        <img
          src={
            item.content?.src && item.content.src.trim() !== ""
              ? item.content.src
              : "http://res.cloudinary.com/dpkpqgxqd/image/upload/v1768143953/olknsur9fci9lih0qhhr.svg"
          }
          alt={item.content.alt}
          style={item.style}
          width={
            item.content?.src && item.content.src.trim() !== ""
              ? item.content.width
              : "50%"
          }
        />
      );

    case "module-gif":
      return (
        <img
          src={
            item.content?.src && item.content.src.trim() !== ""
              ? item.content.src
              : "http://res.cloudinary.com/dpkpqgxqd/image/upload/v1768742381/kmwefi9qvyzmb8rf3dw0.svg"
          }
          alt={item.content.alt}
          style={item.style}
          width={
            item.content?.src && item.content.src.trim() !== ""
              ? item.content.width
              : "50%"
          }
        />
      );

    case "module-heading": {
      const allowedHeadings = ["h1", "h2", "h3", "h4", "h5", "h6", "p"];
      const HeadingTag = allowedHeadings.includes(item.content.type)
        ? item.content.type
        : "h2";
      return (
        <HeadingTag
          style={item.style}
          dangerouslySetInnerHTML={{
            __html: item.content.text,
          }}
        />
      );
    }

    case "module-paragraph": {
      const HeadingTag = item.content.type ? item.content.type : "p";
      return (
        <HeadingTag
          style={item.style}
          dangerouslySetInnerHTML={{
            __html: item.content.text,
          }}
        />
      );
    }

    case "module-list": {
      const parser = new DOMParser();
      const doc = parser.parseFromString(item.content.text, "text/html");

      const listStyle = item.style?.listStyleType || "disc";

      // aplicar a TODOS los <ul>
      doc.body.querySelectorAll("ul").forEach((ul) => {
        ul.style.listStyleType = listStyle;
        ul.style.paddingLeft = ul.style.paddingLeft || "20px"; // recomendado email
      });

      return (
        <ul
          style={item.style}
          dangerouslySetInnerHTML={{
            __html: doc.body.innerHTML,
          }}
        />
      );
    }

    case "module-button": {
      return (
        <div
          style={item.style}
          dangerouslySetInnerHTML={{
            __html: item.content.text,
          }}
        ></div>
      )
    }

    case "module-divider": {
      return (
        <div
          style={item.style}
          dangerouslySetInnerHTML={{
            __html: item.content.text,
          }}
        ></div>
      );
    }

    case "module-spacer": {
      return (
        <div
          style={item.style}
          dangerouslySetInnerHTML={{
            __html: item.content.text,
          }}
        ></div>
      );
    }

    case "module-table": {
      const {
        headStyle,
        colStyle,
        heads = [],
        rows = [],
      } = item.content || {};

      const headCols = heads[0]?.cols || [];
      const activeHeads = item.activeHeads ?? true;

      return (
        <table style={item.style}>
          {activeHeads && (
            <thead>
              <tr>
                {headCols.map((text, index) => (
                  <th key={`th-${index}`} style={headStyle}>
                    {text || "\u00A0"}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`tr-${rowIndex}`}>
                {row.cols.map((col, colIndex) => (
                  <td
                    key={`td-${rowIndex}-${colIndex}`}
                    style={colStyle}
                  >
                    {col || "\u00A0"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    case "module-video":
      return (
        <>
          <img
            src={
              item.content?.src && item.content.src.trim() !== ""
                ? item.content.src
                : "http://res.cloudinary.com/dpkpqgxqd/image/upload/v1768742177/rmgfdrijrm1c6gq3nhff.svg"
            }
            alt={item.content.alt}
            style={item.style}
            width={
              item.content?.src && item.content.src.trim() !== ""
                ? item.content.width
                : "50%"
            }
          />
          <div className="center-icon">
            <img
              src={
                item.content?.iconColor  === "claro"
                  ? "https://res.cloudinary.com/dpkpqgxqd/image/upload/v1741553784/hijtudccbda0woid1jjn.png"
                  : "https://res.cloudinary.com/dpkpqgxqd/image/upload/v1741553788/xyjwzg0988o0bkjjavjg.png"
              }
              width={item.content?.iconSize || '64px'}
            />
          </div>
        </>
      );

    case "module-social": {
      const socials = item.content.social || [];
        return (
          <div style={item.style}>
            {socials.map((social, rowIndex) => (
                <span 
                  style={{ padding: `0px ${item.content.iconSpacing}` }} 
                  key={`tr-${rowIndex}`}
                >
                  <img
                    src={social.src}
                    alt={social.alt}
                    width="auto"
                    height="32px"
                  />
                </span>
              ))
            }
        </div>
      );
    }

    case "module-html": {
      return (
        <div
          style={item.style}
          dangerouslySetInnerHTML={{
            __html: item.content.html,
          }}
        ></div>
      );
    }

    default:
      return null;
  }
}
