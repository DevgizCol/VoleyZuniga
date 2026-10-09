"use client";

import { useState } from "react";
import { Pencil, Plus, Copy } from "lucide-react";
import Drawer from "./Drawer";
import RowForm from "./RowForm";
import { btn } from "./ui";
import type { FieldDef, RowData } from "./types";
import { forForm } from "./format";

type Props = {
  sheet: string;
  fields: FieldDef[];
  title: string;
  mode: "create" | "edit" | "duplicate";
  row?: RowData;
  defaults?: RowData;
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  preview?: "news";
};

// Botón que abre el panel lateral con el formulario para crear, editar o duplicar.
export default function EditorButton({ sheet, fields, title, mode, row, defaults, label, variant, preview }: Props) {
  const [open, setOpen] = useState(false);
  const Icon = mode === "create" ? Plus : mode === "edit" ? Pencil : Copy;
  const text = label ?? (mode === "create" ? "Nuevo" : mode === "edit" ? "Editar" : "Duplicar");
  const style = btn[variant ?? (mode === "create" ? "primary" : "ghost")];
  const initial = mode === "edit" && row ? forForm(row) : mode === "duplicate" && row ? forForm({ ...row, _row: "" }) : defaults;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={style}>
        <Icon size={16} /> {text}
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title={title}>
        <RowForm
          sheet={sheet}
          fields={fields}
          initial={initial}
          expectedRow={mode === "edit" ? row : undefined}
          row={mode === "edit" ? row?._row : undefined}
          onSaved={() => setOpen(false)}
        >
          {preview === "news" ? <NewsPreviewHint /> : null}
        </RowForm>
      </Drawer>
    </>
  );
}

function NewsPreviewHint() {
  return (
    <p className="text-sm text-[#8FA3BF]">
      Consejo: escribe un párrafo por línea. Para la imagen, sube la foto a Google Drive, compártela como “Cualquier persona con el enlace” y pega
      el enlace.
    </p>
  );
}
