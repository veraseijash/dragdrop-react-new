import { rowCols } from "../data/pageTemplate";

export const transformLayoutToRows = (layoutIA = []) => {
  if (!Array.isArray(layoutIA)) return [];

  return layoutIA.map((rowIA, rowIndex) => {
    const numCols = rowIA.cols?.length || 1;

    // 🔍 Buscar template según cantidad de columnas
    const template = rowCols.find(r => r.cols.length === numCols);

    if (!template) {
      console.warn("No existe layout para", numCols, "columnas");
      return null;
    }

    // 🧠 CLON PROFUNDO SIN IDs (IMPORTANTE)
    const cleanTemplate = JSON.parse(JSON.stringify(template));

    // 🧹 eliminar ids del template para evitar duplicados
    delete cleanTemplate.id;
    cleanTemplate.cols.forEach(col => delete col.id);

    // 🆕 CREAR ROW FINAL
    const newRow = {
      ...cleanTemplate,
      id: crypto.randomUUID(), // ✅ ID estable
      rowPosition: rowIndex,

      cols: cleanTemplate.cols.map((col, colIndex) => {
        const iaCol = rowIA.cols?.[colIndex];

        return {
          ...col,
          id: crypto.randomUUID(), // ✅ ID estable
          colPosition: colIndex,

          style: {
            ...col.style,
            ...(iaCol?.style || {}),
          },

          content: (iaCol?.content || []).map((module) => ({
            ...module,

            // ✅ CLAVE: NO regenerar si ya existe
            id: module.id || crypto.randomUUID(),
          })),
        };
      }),
    };

    return newRow;
  }).filter(Boolean);
};