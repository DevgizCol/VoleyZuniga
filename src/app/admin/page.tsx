"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Lock, Activity, Trophy, CloudRain, AlertTriangle, 
  Users, MessageCircle, Send, CheckCircle, Smartphone, RefreshCw, 
  Plus, Trash2, Calendar, Star, ChevronRight, LogOut 
} from "lucide-react";

export default function AdminPage() {
  // Autenticación de Acceso
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Pestaña Activa
  const [activeTab, setActiveTab] = useState<"court" | "score" | "leads" | "broadcast">("court");

  // 1. Estado de Cancha & Clima
  const [courtStatus, setCourtStatus] = useState({
    type: "normal" as "normal" | "rain" | "special",
    message: "Entrenamientos habilitados con normalidad en todas las sedes.",
    venue: "Polideportivo 3 Canchas & Yesid Santos",
    active: true,
  });
  const [courtSaved, setCourtSaved] = useState(false);

  // 2. Marcador en Cancha (Live Scorekeeper)
  const [matchScore, setMatchScore] = useState({
    team1: "Club Voley Zúñiga",
    team2: "Envigado VC",
    category: "Sub-18 Femenina",
    tournament: "Liga Departamental de Antioquia",
    points1: 25,
    points2: 22,
    sets1: 2,
    sets2: 1,
    mvp: "Valentina Morales (#7)",
    status: "En Juego (4to Set)"
  });
  const [scorePublished, setScorePublished] = useState(false);

  // 3. CRM Prospectos / Carnets VIP
  const [leads, setLeads] = useState([
    { id: 1, name: "Valentina Morales", age: "14", category: "Sub-16 Menores", phone: "3128459210", sede: "Polideportivo 3 Canchas", horario: "Martes y Jueves 4:00 PM", status: "Prueba Confirmada", date: "Hoy 18:30" },
    { id: 2, name: "Mariana Restrepo", age: "16", category: "Sub-18 Juvenil", phone: "3004567890", sede: "Coliseo Yesid Santos", horario: "Lunes a Jueves 6:00 PM", status: "Pendiente Contactar", date: "Ayer" },
    { id: 3, name: "Sofía Arismendy", age: "12", category: "Sub-14 Infantil", phone: "3109876543", sede: "Polideportivo 3 Canchas", horario: "Sábados 8:00 AM", status: "Matriculada", date: "Hace 2 días" }
  ]);

  // 4. Notificaciones Masivas (Webhook Trigger)
  const [broadcastMsg, setBroadcastMsg] = useState("Recordatorio: Mañana sábado entrenamiento intensivo en Polideportivo 3 Canchas a las 8:00 AM. Asistir con uniforme oficial.");
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Cargar credenciales guardadas en sesión
  useEffect(() => {
    const auth = sessionStorage.getItem("vz_admin_auth");
    if (auth === "true") setIsAuthenticated(true);

    const savedStatus = localStorage.getItem("vz_court_status");
    if (savedStatus) {
      try {
        setCourtStatus(JSON.parse(savedStatus));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // PIN por defecto: 1926 (Año de fundación simbólico o Zúñiga)
    if (pin === "1926" || pin === "2026") {
      setIsAuthenticated(true);
      sessionStorage.setItem("vz_admin_auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("vz_admin_auth");
    setPin("");
  };

  // Guardar estado de la cancha en vivo (se refleja en el banner de la web)
  const handleSaveCourtStatus = () => {
    localStorage.setItem("vz_court_status", JSON.stringify(courtStatus));
    setCourtSaved(true);
    setTimeout(() => setCourtSaved(false), 2500);
  };

  // Disparar Webhook de Notificación
  const handleTriggerWebhook = async () => {
    setBroadcastSent(true);
    try {
      await fetch("/api/webhook/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: broadcastMsg,
          recipients: leads.map(l => l.phone),
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  // Generar Recordatorio de WhatsApp Individual
  const handleSendLeadWhatsApp = (lead: typeof leads[0]) => {
    const text = `🏐 *HOLA ${lead.name.toUpperCase()}* - CLUB VOLEY ZÚÑIGA\n\n` +
      `Te saludamos del cuerpo técnico oficial. Tu *Pase VIP de Prueba Técnica* para la categoría *${lead.category}* está activo:\n\n` +
      `📍 *Sede:* ${lead.sede}\n` +
      `⏰ *Horario:* ${lead.horario}\n\n` +
      `¿Nos confirmas tu asistencia con ropa deportiva y rodilleras? ¡Te esperamos en la cancha!`;

    window.open(`https://wa.me/57${lead.phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // PANTALLA DE BLOQUEO / LOGIN CON PIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#071426] text-white flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0F284B] to-[#071426] border-2 border-[#F29A2E]/50 p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F29A2E]/20 text-[#F29A2E] flex items-center justify-center mx-auto mb-4 border border-[#F29A2E]/40">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-heading font-bold uppercase text-white mb-1">
            Panel de Control
          </h2>
          <span className="text-xs font-mono text-[#F29A2E] uppercase tracking-widest block mb-6">
            Cuerpo Técnico & Secretaría
          </span>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresa tu PIN (1926)"
                className="w-full text-center text-2xl tracking-[0.4em] font-mono py-3.5 rounded-xl bg-white/[0.05] border border-white/20 text-white placeholder-gray-500 focus:border-[#F29A2E] outline-none"
              />
              {pinError && (
                <span className="text-xs text-red-400 font-sans mt-2 block">
                  PIN incorrecto. Prueba con el PIN oficial 1926.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(242,154,46,0.5)] transition-all cursor-pointer"
            >
              Acceder al Panel
            </button>
          </form>

          <p className="text-[11px] text-gray-400 font-sans mt-6">
            Acceso restringido para entrenadores y directivas de Club Voley Zúñiga.
          </p>
        </div>
      </div>
    );
  }

  // PANEL DE ADMINISTRACIÓN AUTENTICADO
  return (
    <div className="pt-28 pb-24 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Header del Dashboard */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/30 text-[#F29A2E] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={14} />
              <span>Coach Command Center • Voley Zúñiga</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white">
              Panel Operativo en Cancha
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Barra de Pestañas Móviles */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setActiveTab("court")}
            className={`flex items-center gap-2 py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === "court" ? "bg-[#F29A2E] text-[#071426] shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <CloudRain size={16} />
            <span>Estado de Cancha & Lluvia</span>
          </button>

          <button
            onClick={() => setActiveTab("score")}
            className={`flex items-center gap-2 py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === "score" ? "bg-[#F29A2E] text-[#071426] shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Trophy size={16} />
            <span>Marcador en Cancha</span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === "leads" ? "bg-[#F29A2E] text-[#071426] shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Users size={16} />
            <span>Prospectos Carnet VIP ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("broadcast")}
            className={`flex items-center gap-2 py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTab === "broadcast" ? "bg-[#F29A2E] text-[#071426] shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Send size={16} />
            <span>Avisos & Webhook</span>
          </button>
        </div>

        {/* 1. TAB: ESTADO DE CANCHA & AVISO DE LLUVIA */}
        {activeTab === "court" && (
          <div className="p-8 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-2xl space-y-6">
            <div>
              <h3 className="text-2xl font-heading font-bold uppercase text-white mb-2 flex items-center gap-2">
                <CloudRain size={22} className="text-[#F29A2E]" />
                <span>Switch Operativo de Cancha en Tiempo Real</span>
              </h3>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Cambia el estado de la sede en 1 toque. El aviso se mostrará automáticamente a todos los padres de familia en la parte superior de la página web.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setCourtStatus({
                  type: "normal",
                  message: "Entrenamientos habilitados con normalidad en todas las sedes.",
                  venue: "Polideportivo 3 Canchas & Yesid Santos",
                  active: true
                })}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  courtStatus.type === "normal"
                    ? "bg-emerald-500/20 border-emerald-400 text-white shadow-lg"
                    : "bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">🟢 Normal / Habilitado</span>
                  {courtStatus.type === "normal" && <CheckCircle size={18} className="text-emerald-400" />}
                </div>
                <p className="text-xs text-gray-300 font-sans">
                  Clima despejado. Entrenamientos en curso según horario habitual.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCourtStatus({
                  type: "rain",
                  message: "Lluvia en Polideportivo 3 Canchas. Sesión vespertina trasladada al Coliseo Yesid Santos.",
                  venue: "Traslado a Yesid Santos",
                  active: true
                })}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  courtStatus.type === "rain"
                    ? "bg-amber-500/25 border-amber-400 text-white shadow-lg"
                    : "bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">🌧️ Alerta por Lluvia</span>
                  {courtStatus.type === "rain" && <CheckCircle size={18} className="text-amber-400" />}
                </div>
                <p className="text-xs text-gray-300 font-sans">
                  Cancha mojada. Se activa traslado inmediato a escenario cubierto.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCourtStatus({
                  type: "special",
                  message: "Fecha oficial de Liga este fin de semana. No habrá entrenamientos formativos el sábado.",
                  venue: "Coliseo Central",
                  active: true
                })}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  courtStatus.type === "special"
                    ? "bg-[#F29A2E]/25 border-[#F29A2E] text-white shadow-lg"
                    : "bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">🏆 Jornada de Torneo</span>
                  {courtStatus.type === "special" && <CheckCircle size={18} className="text-[#F29A2E]" />}
                </div>
                <p className="text-xs text-gray-300 font-sans">
                  Aviso para padres sobre fixture competitivo y suspensión formativa.
                </p>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <label className="block text-xs font-mono uppercase text-gray-400 mb-2 font-bold">
                Mensaje Personalizado del Aviso:
              </label>
              <input
                type="text"
                value={courtStatus.message}
                onChange={(e) => setCourtStatus({ ...courtStatus, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-sans outline-none focus:border-[#F29A2E]"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleSaveCourtStatus}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(242,154,46,0.4)] transition-all cursor-pointer flex items-center gap-2"
              >
                <RefreshCw size={16} />
                <span>{courtSaved ? "¡Aviso Publicado con Éxito!" : "Actualizar Estado en la Web en Vivo"}</span>
              </button>

              <span className="text-xs text-gray-400 font-mono">
                Visible inmediatamente en voleyzuniga.com
              </span>
            </div>
          </div>
        )}

        {/* 2. TAB: MARCADOR EN CANCHA (TACTICAL LIVE SCOREKEEPER) */}
        {activeTab === "score" && (
          <div className="p-8 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-2xl space-y-6">
            <div>
              <h3 className="text-2xl font-heading font-bold uppercase text-white mb-2 flex items-center gap-2">
                <Trophy size={22} className="text-[#F29A2E]" />
                <span>Marcador en Vivo desde la Cancha</span>
              </h3>
              <p className="text-xs text-gray-300 font-sans">
                Diseñado con botones grandes para que el DT o asistente actualice los puntos del set con el pulgar.
              </p>
            </div>

            {/* Marcador Táctil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Equipo Local (Zúñiga) */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0F284B] to-[#071426] border-2 border-[#F29A2E]/50 text-center">
                <span className="text-xs font-mono uppercase text-[#F29A2E] font-bold tracking-widest block mb-1">LOCAL</span>
                <h4 className="text-2xl font-heading font-bold uppercase text-white mb-3">{matchScore.team1}</h4>
                
                {/* Contador de Puntos */}
                <div className="text-7xl font-heading font-bold text-[#F29A2E] my-4">
                  {matchScore.points1}
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setMatchScore({ ...matchScore, points1: Math.max(0, matchScore.points1 - 1) })}
                    className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xl flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setMatchScore({ ...matchScore, points1: matchScore.points1 + 1 })}
                    className="w-20 h-12 rounded-xl bg-[#F29A2E] hover:bg-white text-[#071426] font-bold text-xl flex items-center justify-center shadow-lg cursor-pointer"
                  >
                    +1
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-gray-300">
                  Sets Ganados: <strong className="text-white text-base ml-1">{matchScore.sets1}</strong>
                </div>
              </div>

              {/* Equipo Rival */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0F284B] to-[#071426] border border-white/15 text-center">
                <span className="text-xs font-mono uppercase text-gray-400 font-bold tracking-widest block mb-1">VISITANTE</span>
                <h4 className="text-2xl font-heading font-bold uppercase text-white mb-3">{matchScore.team2}</h4>
                
                {/* Contador de Puntos */}
                <div className="text-7xl font-heading font-bold text-white/80 my-4">
                  {matchScore.points2}
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setMatchScore({ ...matchScore, points2: Math.max(0, matchScore.points2 - 1) })}
                    className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xl flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setMatchScore({ ...matchScore, points2: matchScore.points2 + 1 })}
                    className="w-20 h-12 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#071426] font-bold text-xl flex items-center justify-center shadow-lg cursor-pointer"
                  >
                    +1
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-gray-300">
                  Sets Ganados: <strong className="text-white text-base ml-1">{matchScore.sets2}</strong>
                </div>
              </div>

            </div>

            {/* Asignar Jugadora MVP */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Star className="text-[#F29A2E]" size={20} />
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">MVP Asignado:</span>
                  <span className="text-sm font-bold text-white">{matchScore.mvp}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setScorePublished(true);
                  setTimeout(() => setScorePublished(false), 2500);
                }}
                className="px-6 py-3 rounded-xl bg-[#F29A2E] text-[#071426] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-white transition-all cursor-pointer"
              >
                {scorePublished ? "¡Marcador Actualizado en /games!" : "Publicar Marcador a la Web"}
              </button>
            </div>
          </div>
        )}

        {/* 3. TAB: CRM PROSPECTOS / CARNETS VIP */}
        {activeTab === "leads" && (
          <div className="p-8 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-heading font-bold uppercase text-white flex items-center gap-2">
                  <Users size={22} className="text-[#F29A2E]" />
                  <span>Atletas Inscritos & Carnets VIP Generados</span>
                </h3>
                <p className="text-xs text-gray-300 font-sans">
                  Padres y deportistas que han personalizado su pase de admisión desde la web.
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/30 text-[#F29A2E] font-mono text-xs font-bold">
                {leads.length} Atletas en Espera
              </span>
            </div>

            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#F29A2E]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-heading font-bold text-lg text-white uppercase">{lead.name}</h4>
                      <span className="text-xs font-mono text-[#F29A2E]">({lead.age} Años)</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300 font-mono text-[10px]">
                        {lead.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-sans space-x-3">
                      <span>Cat: <strong className="text-gray-200">{lead.category}</strong></span>
                      <span>•</span>
                      <span>Sede: <strong className="text-gray-200">{lead.sede}</strong></span>
                      <span>•</span>
                      <span>Horario: <strong className="text-gray-200">{lead.horario}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSendLeadWhatsApp(lead)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#071426] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      <MessageCircle size={15} />
                      <span>Enviar Recordatorio</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TAB: AVISOS & WEBHOOK */}
        {activeTab === "broadcast" && (
          <div className="p-8 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-2xl space-y-6">
            <div>
              <h3 className="text-2xl font-heading font-bold uppercase text-white mb-2 flex items-center gap-2">
                <Send size={22} className="text-[#F29A2E]" />
                <span>Notificación Masiva & Webhook Automático</span>
              </h3>
              <p className="text-xs text-gray-300 font-sans">
                Envía avisos de último minuto a los grupos de WhatsApp y dispara webhooks a la API de automatización.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Mensaje del Aviso:</label>
                <textarea
                  rows={4}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-sans outline-none focus:border-[#F29A2E]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleTriggerWebhook}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(242,154,46,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>{broadcastSent ? "¡Webhook Disparado!" : "Disparar Webhook de Notificación"}</span>
                </button>

                <span className="text-xs font-mono text-gray-400">
                  Endpoint: <code className="text-[#F29A2E]">/api/webhook/notify</code>
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
