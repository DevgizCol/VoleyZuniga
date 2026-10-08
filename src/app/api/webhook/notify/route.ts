import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_RECIPIENTS = 500;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message, recipients, type = "broadcast" } = body ?? {};

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "El mensaje es obligatorio" },
        { status: 400 }
      );
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, error: `El mensaje supera ${MAX_MESSAGE_LENGTH} caracteres` },
        { status: 400 }
      );
    }
    const list: string[] = Array.isArray(recipients)
      ? recipients.filter((r): r is string => typeof r === "string").slice(0, MAX_RECIPIENTS)
      : [];

    console.log("[VoleyZuniga Webhook]", {
      timestamp: new Date().toISOString(),
      type,
      recipientCount: list.length,
    });

    const externalWebhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
    let status = "skipped_no_external_url";

    if (externalWebhookUrl) {
      try {
        const res = await fetch(externalWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: "Club Voley Zúñiga",
            message: message.trim(),
            recipients: list,
            timestamp: new Date().toISOString(),
          }),
        });
        status = res.ok ? "dispatched_external" : `external_error_${res.status}`;
      } catch (err: unknown) {
        status = `external_failed: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    return NextResponse.json({
      success: true,
      details: { recipientsProcessed: list.length, status },
    });
  } catch (error: unknown) {
    console.error("[Webhook Error]", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "online" });
}
