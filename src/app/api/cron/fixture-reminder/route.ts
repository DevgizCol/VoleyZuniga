import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verificación de seguridad para Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Lógica de automatización de Vercel Cron:
  // Consulta de fixture semanal de la Liga Departamental de Antioquia
  const upcomingMatches = [
    {
      category: "Juvenil Sub-18",
      rival: "Envigado Voley Club",
      time: "Sábado 10:30 AM",
      venue: "Coliseo Yesid Santos",
    },
    {
      category: "Menores Sub-16",
      rival: "Bello Voley",
      time: "Domingo 02:00 PM",
      venue: "Polideportivo 3 Canchas",
    },
  ];

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    event: "Vercel Cron • Recordatorio de Fixture Semanal",
    matchesCount: upcomingMatches.length,
    matches: upcomingMatches,
  });
}
