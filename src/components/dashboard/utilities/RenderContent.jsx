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
      // aplicar estilos al UL que ya existe
      doc.body.querySelectorAll("ul").forEach((ul) => {
        // aplicar TODOS los estilos que vienen en item.style
        if (item.style) {
          Object.entries(item.style).forEach(([key, value]) => {
            ul.style[key] = value;
          });
        }
      });

      return (
        <div
          dangerouslySetInnerHTML={{
            __html: doc.body.innerHTML,
          }}
        />
      );
    }

    case "module-button": {
      let tableMargin = "0 auto";
      if (item.content.align === "left") {
        tableMargin = "0 auto 0 0";
      } else if (item.content.align === "right") {
        tableMargin = "0 0 0 auto";
      } else if (item.content.align === "center") {
        tableMargin = "0 auto";
      }
      return (
        <table
          width={`${item.content.width}%`}
          height={item.content.height}
          border="0"
          cellSpacing="0"
          cellPadding="0"
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            margin: tableMargin,
          }}
        >
          <tbody>
            <tr>
              <td align="center" style={item.style}>
                <span>{item.content.text}</span>
              </td>
            </tr>
          </tbody>
        </table>
      );
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
      )

    case "module-menu": {
      const justifyMap = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      const justifyContent = justifyMap[item.content?.align] || "flex-start";
      return (
        <div  style={{
          width: "100%",
          display: "flex",
          justifyContent: justifyContent, // ← mueve todo a la derecha
        }}>
          <div 
              style={{
                display: "flex",
                gap: item.content?.spacing || "0px",
                ...item.style,
              }}
          >
            {item.content.menu.map((menu, colIndex) => (
                <div 
                  key={`td-${colIndex}`} 
                  style={{paddingLeft: '${item.content.spacing}'}}
                >
                  {menu.text}
                </div>
              ))
            }
          </div>
        </div>
      )
    }

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
        <>
          <div
            style={item.style}
            dangerouslySetInnerHTML={{
              __html: item.content.html,
            }}
          ></div>
          <div className="tapa"></div>
        </>
      );
    }

    default:
      return null;
  }
}
