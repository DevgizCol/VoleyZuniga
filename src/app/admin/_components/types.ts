export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "date" | "time" | "select" | "textarea" | "number" | "checkbox" | "url";
  options?: readonly string[];
  suggestions?: readonly string[]; // lista sugerida (se puede escribir otra cosa)
  placeholder?: string;
  help?: string;
  wide?: boolean; // ocupa las dos columnas
  required?: boolean;
  rows?: number;
};

export type RowData = Record<string, string>;
