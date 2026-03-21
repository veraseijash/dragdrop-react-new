// ===============================
// CONFIGURACIÓN GLOBAL DEL EMAIL
// (valores por defecto editables)
// ===============================
let config = null;

const EMAIL_DEFAULTS = {
  maxWidth: 680,
  maxHeight: 383,
  backgroundColor: "#f5f5f5",
};

const calculateProportionalHeight = (width, baseWidth, baseHeight) => {
  return Math.round(width * (baseHeight / baseWidth));
};

const resolveEmailConfig = (pageData = {}) => {
  const maxWidth = pageData?.maxWidth || EMAIL_DEFAULTS.maxWidth;
  // 🔥 recalcular altura proporcional
  const maxHeight = calculateProportionalHeight(
    maxWidth,
    EMAIL_DEFAULTS.maxWidth,
    EMAIL_DEFAULTS.maxHeight
  );
  return {
    maxWidth,
    maxHeight, // ← ahora es dinámico
    backgroundColor: pageData?.backgroundColorContent || EMAIL_DEFAULTS.backgroundColor,
  };
};

// Convierte objeto style → string inline CSS
const styleToString = (style = {}) => {
  return Object.entries(style)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([key, value]) => {

      // 🔹 Convertir camelCase → kebab-case correctamente
      const cssKey = key
        .replace(/([a-z])([A-Z])/g, "$1-$2") // solo transiciones válidas
        .toLowerCase();

      // 🔹 Sanitizar valores (CRÍTICO para emails)
      let cssValue = String(value)
        .replace(/"/g, "")   // quitar comillas dobles
        .replace(/'/g, "")   // quitar comillas simples
        .trim();

      return `${cssKey}:${cssValue}`;
    })
    .join(";");
};



// Renderiza módulos internos (imagen, texto, divider, etc.)
const renderModuleContent = (module) => {
  switch (module.type) {
    case "module-image": {
      const hasLink = module.content.url && module.content.url.trim() !== "";
      const align =  module.preStyle?.textAlign || "left";
      const imageTag = `
        <img 
          src="${module.content.src}" 
          alt="${module.content.alt || ""}"
          width="100%"
          border="0"
          style="display:block;border:0;outline:none;text-decoration:none;"
        />
      `;

      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="${styleToString(module.preStyle)}"
        >
          <tr>
            <td valign="top" align="${align}">
              ${
                hasLink
                  ? `<a href="${module.content.url}" target="_blank">${imageTag}</a>`
                  : imageTag
              }
            </td>
          </tr>
        </table>
      `;
    }


    case "module-gif":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleToString(module.preStyle)}">
          <tr>
            <td valign="top" align="center">
              <img 
                src="${module.content.src}" 
                alt="${module.content.alt || ""}"
                width="${module.content.width}"
                style="${styleToString(module.style)}"
              />
            </td>
          </tr>
        </table>
      `;

    case "module-heading":
    case "module-paragraph": {
      const Tag = module.content.type || "h2";

      const { textAlign, FontFamily, ...restStyle } = module.style || {};
      const align = textAlign || "left";

      if (FontFamily) {
        restStyle.fontFamily = FontFamily;
      }

      const cleanText = flattenParagraphsForHeading(module.content.text);

      const headingReset = `
        margin:0;
        padding:0;
        mso-line-height-rule:exactly;
        line-height:${restStyle.lineHeight || "120%"};
      `;

      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="${styleToString(module.preStyle)}"
        >
          <tr>
            <td valign="top" align="${align}" style="${styleToString(restStyle)}">
              <${Tag} style="${headingReset}">
                ${cleanText}
              </${Tag}>
            </td>
          </tr>
        </table>
      `;
    }

    case "module-menu": {
      const {
        menu = [],
        spacing = "20px",
        layout = "row",
        align = "center"
      } = module.content || {};

      const itemsHtml = menu.map((item, index) => {

        let href = "#";

        switch (item.type) {
          case "web":
            href = item.feature?.href || "#";
            break;

          case "email": {
            const mail = item.feature?.mailTo || "";
            const subject = encodeForMailto(item.feature?.subject || "");
            const body = encodeForMailto(item.feature?.body || "");

            href = `mailto:${mail}?subject=${subject}&body=${body}`;
            break;
          }

          case "call":
            href = `tel:${item.feature?.tel || ""}`;
            break;

          default:
            href = "#";
        }

        const linkHtml = `
          <a href="${href}"
            ${item.target ? `target="${item.target}"` : ""}
            style="text-decoration:none;color:inherit;display:inline-block;">
            <span>${item.text}</span>
          </a>
        `;

        // HORIZONTAL
        if (layout === "row") {
          return `
            <td valign="middle" align="center"
                style="${index !== 0 ? `padding-left:${spacing};` : ""}">
              ${linkHtml}
            </td>
          `;
        }

        // VERTICAL
        return `
          <tr>
            <td valign="middle" align="${align}"
                style="${index !== 0 ? `padding-top:${spacing};` : ""}">
              ${linkHtml}
            </td>
          </tr>
        `;
      });

      const menuHtml =
        layout === "row"
          ? `<tr>${itemsHtml.join("")}</tr>`
          : itemsHtml.join("");

      return `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
          style="${styleToString(module.style)}">
          ${menuHtml}
        </table>
      `;
    }

    case "module-social": {
      const { social = [], iconSpacing = "0px", size = "32px" } = module.content || {};
      // Generar cada ícono como un <td>
      const iconsHtml = social
        .map((item) => {
          // ❗ En email no existe :last-child confiable → lo controlamos manualmente
          const paddingRight = iconSpacing;

          return `
            <td valign="top" align="center" valign="middle" style="padding-right:${paddingRight};padding-left:${paddingRight}">
              <a href="${item.href}" target="_blank">
                <img
                  src="${item.src}"
                  alt="${item.alt || ""}"
                  title="${item.alt || ""}"
                  width="${size}"
                  style="display:block;height:auto;border:0;outline:none;text-decoration:none;"
                />
              </a>
            </td>
          `;
        })
        .join("");

      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="${styleToString(module.preStyle)}">
          <tr>
            <td valign="top" align="center" style="${styleToString(module.style)}">
              <table clase="social-table" role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  ${iconsHtml}
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
    }

    case "module-button": {
      let tableMargin = "0 auto";
      if (module.content.align === "left") tableMargin = "0 auto 0 0";
      else if (module.content.align === "right") tableMargin = "0 0 0 auto";

      const widthPercent = module.content.width;
      const heightPx = module.content.height;

      const bgColor = module.style.backgroundColor || "#7747FF";
      const textColor = module.style.color || "#FFFFFF";
      const radius = parseInt(module.style.borderRadius || 4, 10);

      // -----------------------------
      // Generar href dinámico según type
      // -----------------------------
      let href = "#";

      switch (module.content.type) {
        case "web":
          href = module.content.feature?.href || "#";
          break;

        case "email": {
          const mail = module.content.feature?.mailTo || "";
          const subject = encodeForMailto(module.content.feature?.subject || "");
          const body = encodeForMailto(module.content.feature?.body || "");

          href = `mailto:${mail}?subject=${subject}&body=${body}`;
          break;
        }

        case "call":
          href = `tel:${module.content.feature?.tel || ""}`;
          break;
      }

      return `
      <table
        role="presentation"
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="${styleToString(module.outerStyle)}"
      >
        <tr>
          <td valign="top" align="${module.content.align || "center"}">

            <!--[if mso]>
            <v:roundrect
              xmlns:v="urn:schemas-microsoft-com:vml"
              href="${href}"
              style="height:${heightPx}px;v-text-anchor:middle;width:${widthPercent}%;"
              arcsize="${radius * 2}%"
              stroke="f"
              fillcolor="${bgColor}"
            >
              <w:anchorlock/>
              <center style="
                color:${textColor};
                font-family:${module.style.fontFamily || "Arial, sans-serif"};
                font-size:${module.style.fontSize || 14}px;
                font-weight:${module.style.fontWeight || 400};
              ">
                ${module.content.text}
              </center>
            </v:roundrect>
            <![endif]-->

            <!--[if !mso]><!-- -->
            <a href="${href}"
              target="${module.content.feature?.target || "_blank"}"
              style="text-decoration:none;display:block;">
              <table
                role="presentation"
                width="${widthPercent}%"
                height="${heightPx}"
                border="0"
                cellspacing="0"
                cellpadding="0"
                style="
                  width:${widthPercent}%;
                  border-collapse:separate;
                  border-spacing:0;
                  margin:${tableMargin};
                "
              >
                <tr>
                  <td
                    align="center"
                    style="
                      border-radius:${radius}px;
                      mso-padding-alt:0;
                      ${styleToString(module.style)}
                    "
                  >
                    ${module.content.text}
                  </td>
                </tr>
              </table>
            </a>
            <!--<![endif]-->

          </td>
        </tr>
      </table>
      `;
    }




    case "module-html":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
         style="${styleToString(module.preStyle)}">
         <tr>
          <td valign="top" style="${styleToString(module.style)}">
            ${module.content.html}
          </td>
         </tr>
        </table>
      `

    case "module-spacer":
      return `
        <div style="${styleToString(module.style)}">${module.content.text}</div>
        <div style="height:1px;line-height:1px;font-size:1px;">${module.content.text}</div>
      `;

    case "module-list": {
      const parser = new DOMParser();
      const doc = parser.parseFromString(module.content.text, "text/html");

      // convertir estilos del módulo a objeto aplicable
      const ulStyles = module.style || {};

      // aplicar estilos al <ul> que ya viene en el contenido
      doc.body.querySelectorAll("ul, ol").forEach((list) => {
        Object.entries(ulStyles).forEach(([key, value]) => {
          list.style[key] = value;
        });

        // MUY importante para emails (si no viene definido)
        if (!list.style.paddingLeft) {
          list.style.paddingLeft = "20px";
        }
        if (!list.style.margin) {
          list.style.margin = "0";
        }
      });

      const listHTML = doc.body.innerHTML;

      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td valign="top" style="${styleToString(module.preStyle)}">
              ${listHTML}
            </td>
          </tr>
        </table>
      `;
    }

    case "module-divider": {
      const outerStyle = styleToString(module.preStyle);  // padding vive aquí
      const lineStyle  = styleToString(module.style);     // borde vive aquí

      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${outerStyle}">
          <tr>
            <td valign="top" style="padding:0;">

              <!-- TABLA DE LA LÍNEA (aislada) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="top" style="
                    ${lineStyle}
                    font-size:0;
                    line-height:0;
                  ">
                    &nbsp;
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      `;
    }

    case "module-table": {
      return renderModuleTable(module);
    }

    case "module-video": {
      const preStyle = {
        ...module.preStyle,
        backgroundImage: `url(${module.content.src})`,
        backgroundSize: "cover",
        minHeight: "180px",
        minWidth: "320px",
        boxSizing: "content-box"
      };
      const {
        paddingTop = "0px",
        paddingRight = "0px",
        paddingBottom = "0px",
        paddingLeft = "0px",
      } = module.preStyle || {};
      const linkStyle = styleToString({
        boxSizing: "content-box",
        backgroundColor: "transparent",
        display: "block",
        textDecoration: "none",
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
      });
      return `        
        <a
          class="video-preview"
          tabindex="0"
          href="${module.content.url}"
          target="_blank"
          title="${module.content.alt}"
          style="${linkStyle}"
        >
          <div style="box-sizing: content-box;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; ${styleToString(preStyle)}">
              <tbody>
                <tr style="box-sizing: content-box;">
                  <td valign="top" width="25%" style="box-sizing: content-box;">
                    <img src="https://res.cloudinary.com/dpkpqgxqd/image/upload/v1770994307/dai2eqbjbpqippqymr5j.gif"
                      width="100%" border="0" alt="" style="display: block; box-sizing: content-box; height: auto; opacity: 0; visibility: hidden;"
                      height="auto">
                  </td>
                  <td valign="top" width="50%" align="center" valign="middle" style="box-sizing: content-box; vertical-align: middle;">
                    <img 
                      src="${module.content.iconColor === 'claro' ? 'https://res.cloudinary.com/dpkpqgxqd/image/upload/v1770995381/ycvz8zquag144smbiytp.png' : 'https://res.cloudinary.com/dpkpqgxqd/image/upload/v1741553788/xyjwzg0988o0bkjjavjg.png'}" 
                      width="${module.content.iconSize.replace('px', '')}"
                      height="auto" 
                      alt="play"
                      style="display: block; height: auto; box-sizing: content-box;"
                    >
                  </td>
                  <td valign="top" width="25%" style="box-sizing: content-box;">&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </a>
        <!--
        [if vml]>
        <v:group xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" coordsize="${config.maxWidth},${config.maxHeight}" coordorigin="0,0" href="${module.content.url}" style="width:${config.maxWidth}px;height:${config.maxHeight}px;">
        <v:rect fill="t" stroked="f" style="position:absolute;width:${config.maxWidth};height${config.maxHeight};">
        <v:fill src="${module.content.src}" type="frame"/>
        </v:rect>
        ${module.content.iconColor === 'claro' ?
          `<v:oval fill="t" strokecolor="#ffffff" strokeweight="3px" style="position:absolute;left:305;top:157;width:70;height:70">
        <v:fill color="#ffffff" opacity="100%" />
        </v:oval>
        <v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#000000" stroked="f" style="position:absolute;left:330;top:174;width:25;height:35;" />` :
          `<v:oval fill="t" strokecolor="#000000" strokeweight="3px" style="position:absolute;left:305;top:157;width:70;height:70">
        <v:fill color="#000000" opacity="100%" />
        </v:oval>
        <v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#ffffff" stroked="f" style="position:absolute;left:330;top:174;width:25;height:35;" />`
        }
        </v:group>
        <![endif]
        -->
      `;
    }
    default:
      return "";
  }
};

const STRUCTURAL_MODULES = new Set([
  "module-divider",
  "module-table",
  "module-video"
]);

const renderModule = (module) => {

  // ⚠️ estos módulos ya generan su propia tabla raíz
  if (STRUCTURAL_MODULES.has(module.type)) {
    return renderModuleContent(module);
  }

  // módulos normales (texto, imagen, gif, lista…)
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
      style="${module.type !== 'module-button' && module.type !== 'module-heading' ? styleToString(module.preStyle) : ''}"
    >
      <tr>
        <td valign="top" ${module.type === 'module-menu' ? `align="${module.content.align}"`: ''} style="${(module.type !== 'module-button' && module.type !== 'module-menu') ? styleToString(module.style) : ''}">
          ${renderModuleContent(module)}
        </td>
      </tr>
    </table>
  `;
};



// Renderiza columnas (TD)
const renderCols = (cols = []) => {
  return cols
    .map(col => {
      const { align, valign } = mapFlexToTable(col.style);

      const safeStyle = stripUnsupportedEmailStyles(col.style);

      const contentHtml = col.content
        .map(renderModule)
        .join("");

      return `
        <td
          align="${align}"
          valign="${valign}"
          style="${styleToString(safeStyle)}"
        >
          ${contentHtml}
        </td>
      `;
    })
    .join("");
};



// Renderiza filas (TABLE)
const renderRows = (rows = [], styleBody) => {
  return rows
    .map(row => {
      return `
        <!-- ROW WRAPPER (full width background support) -->
        <table role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="${styleToString(styleBody)}"
        >
          <tr>
            <td valign="top" align="center">
              <table role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                align="center"
                style="${styleToString(row.preStyle)}"
              >
                <tr>
                  <td valign="top" align="center">
                    <!-- ROW CONTENT (fixed or styled width) -->
                    <table role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      align="center"
                      style="${styleToString(row.style)}"
                    >
                      <tr>
                        ${renderCols(row.cols)}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
      `;
    })
    .join("");
};

// FUNCIÓN FINAL
export const buildEmailHtml = (pageData) => {
  config = resolveEmailConfig(pageData)
  return `
    <!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>html,body{margin:0;padding:0;width:100%;max-width:100%;overflow-x:hidden;box-sizing:border-box}*{box-sizing:border-box!important;max-width:100%;}table{table-layout:fixed}img{max-width:100%!important;height:auto!important;display:block}td,div,p,span{word-break:break-word}h1,h2,h3,h4,h5,h6,p{margin:0;padding:0;}h1{font-size: 32px}h2{font-size: 24px}h3{font-size: 18.72px}h4{font-size: 16px}h5{font-size: 13.28px}h6{font-size: 10.72px}@media (max-width:700px){.social-table{display:inline-block!important}}</style><!--[if mso]>
<xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
<![endif]--><!--[if !mso]><!-->
    </head>

    <body style="margin:0;padding:0;${styleToString(pageData.style)}">
      <center style="width:100%;">
        
        ${renderRows(pageData.rows, pageData.style)}

      </center>
    </body>
    </html>
  `;
};

function renderModuleTable(module) {
  const styleToString = (styleObj) =>
    Object.entries(styleObj)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`)
      .join(";");

  const headHtml = module.activeHeads
    ? `<thead>
        ${module.content.heads
          .map(
            (head) =>
              `<tr>${head.cols
                .map(
                  (text) =>
                    `<th style="${styleToString(module.content.headStyle)}">${
                      text || "&nbsp;"
                    }</th>`
                )
                .join("")}</tr>`
          )
          .join("")}
      </thead>`
    : "";

  const bodyHtml = `<tbody>
      ${module.content.rows
        .map(
          (row) =>
            `<tr>${row.cols
              .map(
                (col) =>
                  `<td valign="top" style="${styleToString(module.content.colStyle)}">${
                    col || "&nbsp;"
                  }</td>`
              )
              .join("")}</tr>`
        )
        .join("")}
    </tbody>`;

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td valign="top" style="${styleToString(module.outerStyle)}">
          <table style="${styleToString(module.style)}">
            ${headHtml}
            ${bodyHtml}
          </table>
        </td>
      </tr>
    </table>
  `;
}

function encodeForMailto(text = "") {
  return encodeURIComponent(
    text
      .replace(/\r?\n/g, "\r\n")   // Outlook requiere CRLF
      .replace(/<[^>]*>/g, "")     // quitar HTML si viene del editor
      .trim()
  )
  .replace(/%20/g, "%20"); // aseguramos espacios como %20 (no +)
}

function flattenParagraphsForHeading(html = "") {
  return html
    // quitar saltos raros
    .replace(/\n/g, "")

    // convertir </p><p> en <br>
    .replace(/<\/p>\s*<p>/gi, "<br>")

    // eliminar <p> inicial
    .replace(/^<p>/i, "")

    // eliminar </p> final
    .replace(/<\/p>$/i, "")

    // limpiar <p> sueltos restantes
    .replace(/<\/?p[^>]*>/gi, "");
}

const mapFlexToTable = (style = {}) => {
  let align = "left";
  let valign = "top";

  switch (style.justifyContent) {
    case "center":
      align = "center";
      valign = "middle";
      break;

    case "flex-end":
      align = "right";
      valign = "bottom";
      break;

    case "flex-start":
    default:
      align = "left";
      valign = "top";
      break;
  }

  return { align, valign };
};

const stripUnsupportedEmailStyles = (style = {}) => {
  const {
    justifyContent,
    alignItems,
    display,
    gap,
    flex,
    flexDirection,
    ...safe
  } = style;

  return safe;
};