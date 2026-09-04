import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    // Si el usuario configuró BLOB_READ_WRITE_TOKEN en Vercel Dashboard:
    if (token) {
      // Vercel Blob REST API Direct Upload
      const response = await fetch(`https://blob.vercel-storage.com/receipts/${encodeURIComponent(file.name)}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "x-api-version": "7",
        },
        body: file,
      });

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json({ error: errText }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ success: true, url: data.url });
    }

    // Modo Standby / Fallback hasta conectar Vercel Blob en Vercel Dashboard
    return NextResponse.json({
      success: true,
      message: "Endpoint de Vercel Blob activo. Conecta Vercel Blob en tu Dashboard para persistencia permanente.",
      fileName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
