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
    case "module-image":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleToString(module.preStyle)}">
          <tr>
            <td align="center">
              <img 
                src="${module.content.src}" 
                alt="${module.content.alt || ""}"
                width="${module.content.width}"
                style="display:block;border:0;outline:none;text-decoration:none;${styleToString(module.style)}"
              />
            </td>
          </tr>
        </table>
      `;

    case "module-heading":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleToString(module.preStyle)}">
          <tr>
            <td style="${styleToString(module.style)}">
              <${module.content.type}>
                ${module.content.text}
              </${module.content.type}>
            </td>
          </tr>
        </table>
      `;

    case "module-divider":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleToString(module.preStyle)}">
          <tr>
            <td style="${styleToString(module.style)}">
              <${module.content.type}>
                ${module.content.text}
              </${module.content.type}>
            </td>
          </tr>
        </table>
      `;

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
      return `
        <a class="video-preview" tabindex="0" href="${module.content.url}" target="_blank" title="${module.content.alt}" style="box-sizing: content-box; background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;">
          <div style="box-sizing: content-box;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; ${styleToString(preStyle)}">
              <tbody>
                <tr style="box-sizing: content-box;">
                  <td width="25%" style="box-sizing: content-box;">
                    <img src="https://res.cloudinary.com/dpkpqgxqd/image/upload/v1770994307/dai2eqbjbpqippqymr5j.gif"
                      width="100%" border="0" alt="" style="display: block; box-sizing: content-box; height: auto; opacity: 0; visibility: hidden;"
                      height="auto">
                  </td>
                  <td width="50%" align="center" valign="middle" style="box-sizing: content-box; vertical-align: middle;">
                    <img 
                      src="${module.content.iconColor === 'claro' ? 'https://res.cloudinary.com/dpkpqgxqd/image/upload/v1770995381/ycvz8zquag144smbiytp.png' : 'https://res.cloudinary.com/dpkpqgxqd/image/upload/v1741553788/xyjwzg0988o0bkjjavjg.png'}" 
                      width="${module.content.iconSize.replace('px', '')}"
                      height="auto" 
                      alt="play"
                      style="display: block; height: auto; box-sizing: content-box;"
                    >
                  </td>
                  <td width="25%" style="box-sizing: content-box;">&nbsp;</td>
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

const renderModule = (module) => {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
      style="${styleToString(module.preStyle)}"
    >
      <tr>
        <td style="${styleToString(module.style)}">
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
      const contentHtml = col.content
        .map(renderModule) // ← muchos módulos OK
        .join("");

      return `
        <td valign="top" style="${styleToString(col.style)}">
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
            <td align="center">
              <table role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                align="center"
                style="${styleToString(row.preStyle)}"
              >
                <tr>
                  <td align="center">
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]>
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
                  `<td style="${styleToString(module.content.colStyle)}">${
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
        <td style="${styleToString(module.outerStyle)}">
          <table style="${styleToString(module.style)}">
            ${headHtml}
            ${bodyHtml}
          </table>
        </td>
      </tr>
    </table>
  `;
}

