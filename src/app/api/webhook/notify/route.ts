import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, recipients, timestamp, type = "broadcast" } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "El mensaje es obligatorio" },
        { status: 400 }
      );
    }

    // Log para auditoría en Vercel y servidor
    console.log("[VoleyZuniga Webhook Trigger]", {
      timestamp: timestamp || new Date().toISOString(),
      type,
      recipientCount: recipients?.length || 0,
      preview: typeof message === "string" ? message.slice(0, 80) : "",
    });

    // Simulación y despacho preparado para WhatsApp Cloud API / Evolution API / Twilio
    // Si existe una URL de webhook de terceros en variables de entorno, la reenvía
    const externalWebhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
    let externalDispatchStatus = "skipped_no_external_url";

    if (externalWebhookUrl) {
      try {
        const extRes = await fetch(externalWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: "Club Voley Zúñiga",
            message,
            recipients,
            timestamp: new Date().toISOString(),
          }),
        });
        externalDispatchStatus = extRes.ok ? "dispatched_external" : `external_error_${extRes.status}`;
      } catch (err: unknown) {
        externalDispatchStatus = `external_failed: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook procesado exitosamente.",
      details: {
        timestamp: new Date().toISOString(),
        recipientsProcessed: recipients?.length || 0,
        status: externalDispatchStatus,
      },
    });
  } catch (error: unknown) {
    console.error("[Webhook Error]", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "Club Voley Zúñiga Notification Webhook",
    time: new Date().toISOString(),
    supportedChannels: ["whatsapp", "sms", "push"],
  });
}
