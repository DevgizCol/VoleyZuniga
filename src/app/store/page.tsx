"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Sparkles, Check, ShieldCheck, Truck, RefreshCw, Ruler, CreditCard, X, QrCode, ArrowRight, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function StorePage() {
  const { addToCart } = useCart();

  // Customizer State for Featured Jersey
  const [selectedSize, setSelectedSize] = useState("M");
  const [customName, setCustomName] = useState("");
  const [customDorsal, setCustomDorsal] = useState("10");
  const [activeAngle, setActiveAngle] = useState<"back" | "front" | "detail">("back");

  // Modals state
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isDirectCheckoutOpen, setIsDirectCheckoutOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"methods" | "nequi" | "pse" | "confirmed">("methods");

  const products = [
    {
      id: "jersey-2026",
      name: "Camiseta Oficial de Juego 2026",
      category: "Indumentaria Oficial",
      price: 95000,
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
      badge: "Edición Titular",
      desc: "Tejido microperforado Dry-Fit con absorción de sudor y escudo termosellado en relieve dorado."
    },
    {
      id: "libero-jersey-2026",
      name: "Camiseta de Líbero (Naranja Zúñiga)",
      category: "Indumentaria Oficial",
      price: 95000,
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
      badge: "Edición Alternativa",
      desc: "Color de alto contraste reglamentario para líberos con paneles elásticos laterales."
    },
    {
      id: "mikasa-v200w",
      name: "Balón Oficial Mikasa V200W",
      category: "Equipamiento",
      price: 340000,
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop",
      badge: "FIVB Approved",
      desc: "El balón reglamentario de los Juegos Olímpicos y de la Liga Colombiana de Voleibol."
    },
    {
      id: "rodilleras-pro",
      name: "Rodilleras Asics Gel Pro Performance",
      category: "Protección",
      price: 135000,
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
      badge: "Alta Absorción",
      desc: "Acolchado de doble densidad para caídas de defensa extrema y amortiguación de rodilla."
    },
    {
      id: "sudadera-travel",
      name: "Sudadera de Viaje & Presentación",
      category: "Indumentaria",
      price: 165000,
      image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop",
      badge: "Colección Viaje",
      desc: "Chaqueta rompevientos térmica con pantalón jogger y cremalleras impermeables."
    },
    {
      id: "gorra-trucker",
      name: "Gorra Snapback Pro Voley Zúñiga",
      category: "Accesorios",
      price: 55000,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
      badge: "Lifestyle",
      desc: "Bordado frontal en 3D con visera plana y malla transpirable trasera."
    }
  ];

  const handleAddCustomJersey = () => {
    addToCart({
      id: `jersey-custom-${selectedSize}-${customDorsal}`,
      name: `Camiseta Oficial (${selectedSize}) - #${customDorsal} ${customName || "SIN NOMBRE"}`,
      price: 95000,
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
      quantity: 1
    });
  };

  return (
    <div className="pt-28 pb-24 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-6">
            <Sparkles size={14} />
            <span>Tienda Oficial • Indumentaria de Rendimiento</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-6">
            Viste la Piel de <span className="text-[#F29A2E]">Campeones</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-sans leading-relaxed">
            Equipamiento y ropa deportiva con la calidad técnica que exige la alta competencia en Antioquia.
          </p>
        </div>

        {/* 1. Destacado: Personalizador de Camiseta Oficial con Galería Multi-Ángulo */}
        <div className="mb-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0B1E38] via-[#071426] to-[#040C18] border border-[#F29A2E]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Visualizador Camiseta Multi-Ángulo (Col 5) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* Selector de Ángulo */}
              <div className="flex items-center gap-2 mb-4 bg-white/5 p-1 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveAngle("back")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    activeAngle === "back" ? "bg-[#F29A2E] text-[#071426]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Espalda (Dorsal)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAngle("front")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    activeAngle === "front" ? "bg-[#F29A2E] text-[#071426]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Frente Oficial
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAngle("detail")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    activeAngle === "detail" ? "bg-[#F29A2E] text-[#071426]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Detalle Escudo
                </button>
              </div>

              {/* Canvas o Vista del Ángulo */}
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-[#0F284B] to-[#071426] border-2 border-[#F29A2E]/30 p-6 flex flex-col justify-between items-center shadow-xl">
                <div className="w-full flex justify-between items-center z-10">
                  <span className="px-3 py-1 rounded-full bg-[#F29A2E]/20 border border-[#F29A2E]/30 text-[#F29A2E] font-mono text-[10px] font-bold uppercase">
                    {activeAngle === "back" ? "Dorsal en Vivo" : activeAngle === "front" ? "Frente de Juego" : "Microperforado"}
                  </span>
                  <span className="font-mono text-xs text-gray-400">Talla: {selectedSize}</span>
                </div>

                {/* VISTA 1: ESPALDA */}
                {activeAngle === "back" && (
                  <div className="text-center z-10 my-auto animate-fadeIn">
                    <div className="text-xs uppercase font-mono tracking-[0.3em] text-white font-bold mb-2 drop-shadow">
                      {customName || "TU APELLIDO"}
                    </div>
                    <div className="text-8xl font-heading font-bold text-[#F29A2E] drop-shadow-[0_10px_25px_rgba(242,154,46,0.5)]">
                      {customDorsal || "10"}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mt-2">
                      CLUB VOLEY ZÚÑIGA
                    </div>
                  </div>
                )}

                {/* VISTA 2: FRENTE */}
                {activeAngle === "front" && (
                  <div className="text-center z-10 my-auto animate-fadeIn flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 p-3 border border-[#F29A2E]/50 mb-3 shadow-[0_0_20px_rgba(242,154,46,0.3)]">
                      <Image src="/logo.svg" alt="Escudo Voley Zúñiga" width={80} height={80} />
                    </div>
                    <span className="font-heading font-bold text-2xl uppercase tracking-wider text-white">
                      VOLEY ZÚÑIGA
                    </span>
                    <span className="text-xs font-mono text-[#F29A2E] uppercase tracking-widest mt-1">
                      MEDELLÍN • 2026
                    </span>
                    <div className="mt-6 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-300 font-mono">
                      Patrocinadores Oficiales en Pecho
                    </div>
                  </div>
                )}

                {/* VISTA 3: DETALLE ESCUDO */}
                {activeAngle === "detail" && (
                  <div className="text-center z-10 my-auto animate-fadeIn flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#F29A2E]/30 to-white/10 p-5 border-2 border-[#F29A2E] mb-3 flex items-center justify-center">
                      <Image src="/logo.svg" alt="Escudo Detalle" width={90} height={90} />
                    </div>
                    <span className="font-heading font-bold text-lg uppercase text-white">
                      Bordado Termosellado 3D
                    </span>
                    <p className="text-[11px] text-gray-300 font-sans max-w-xs mt-1">
                      Relieve en poliuretano metalizado que resiste lavados intensivos y rozamiento en piso sintético.
                    </p>
                  </div>
                )}

                <div className="text-center z-10 text-[11px] text-gray-400 font-sans">
                  Estampado térmico oficial con tipografía de competición
                </div>
              </div>
            </div>

            {/* Controles del Personalizador (Col 7) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[#F29A2E] font-mono text-xs uppercase font-bold tracking-wider block mb-1">
                  Edición Oficial 2026
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-2">
                  Camiseta Oficial Titular Personalizada
                </h2>
                <div className="text-3xl font-heading font-bold text-[#F29A2E] mb-4">
                  $95.000 <span className="text-xs font-sans text-gray-400 font-normal">COP (Personalización incluida)</span>
                </div>
                <p className="text-sm text-gray-300 font-sans leading-relaxed">
                  Confeccionada con tecnología Dry-Speed que expulsa el sudor de la piel. Elige tu talla y agrega tu nombre y número favorito en la espalda.
                </p>
              </div>

              {/* Selector de Tallas + Botón Guía de Tallas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    1. Selecciona tu Talla:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#F29A2E] hover:underline font-mono font-bold uppercase cursor-pointer"
                  >
                    <Ruler size={14} />
                    <span>Guía de Tallas (Medidas cm)</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl font-heading font-bold text-sm transition-all cursor-pointer ${
                        selectedSize === size
                          ? "bg-[#F29A2E] text-[#071426] shadow-lg scale-105"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input de Nombre y Número */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    2. Nombre / Apellido en Espalda:
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                    placeholder="Ej. RESTREPO"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] outline-none text-sm font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    3. Número de Dorsal:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={customDorsal}
                    onChange={(e) => setCustomDorsal(e.target.value)}
                    placeholder="10"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] outline-none text-sm font-mono"
                  />
                </div>
              </div>

              {/* Botones de Acción: Carrito + Pago Directo */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={handleAddCustomJersey}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_30px_rgba(242,154,46,0.3)] hover:shadow-[0_0_40px_rgba(242,154,46,0.5)] active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  <span>Añadir al Carrito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDirectCheckoutOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white text-white hover:text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20 cursor-pointer"
                >
                  <CreditCard size={18} />
                  <span>Pagar con Nequi / PSE / Bold</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Catálogo General de Productos */}
        <div>
          <h2 className="text-3xl font-heading font-bold uppercase text-white mb-8">
            Catálogo Oficial de Competición
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="rounded-3xl bg-[#0B1E38] border border-white/10 overflow-hidden shadow-xl hover:border-[#F29A2E]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-64 overflow-hidden bg-[#071426]">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#071426]/80 backdrop-blur-md border border-white/10 text-[#F29A2E] font-mono text-[10px] font-bold uppercase">
                    {product.badge}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-heading font-bold text-xl uppercase text-white mb-2 group-hover:text-[#F29A2E] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-300 font-sans leading-relaxed mb-4">
                      {product.desc}
                    </p>
                  </div>

                  <div>
                    <div className="text-2xl font-heading font-bold text-[#F29A2E] mb-4">
                      ${product.price.toLocaleString("es-CO")} <span className="text-xs font-sans text-gray-400 font-normal">COP</span>
                    </div>
                    <button 
                      onClick={() => addToCart({ ...product, quantity: 1 })}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-[#F29A2E] text-white hover:text-[#071426] transition-colors rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer"
                    >
                      <ShoppingBag size={16} /> Añadir al Carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garantía y Entregas */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/10 text-center font-sans text-sm">
          <div className="p-6 rounded-2xl bg-white/[0.02]">
            <Truck className="mx-auto text-[#F29A2E] mb-3" size={28} />
            <h4 className="font-bold text-white mb-1">Entregas en Medellín & Sede</h4>
            <p className="text-xs text-gray-400">Recibe en tu casa o retira directamente en el Polideportivo 3 Canchas.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02]">
            <ShieldCheck className="mx-auto text-[#F29A2E] mb-3" size={28} />
            <h4 className="font-bold text-white mb-1">Calidad Oficial Garantizada</h4>
            <p className="text-xs text-gray-400">Confección aprobada para partidos de Liga con telas de alta durabilidad.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02]">
            <RefreshCw className="mx-auto text-[#F29A2E] mb-3" size={28} />
            <h4 className="font-bold text-white mb-1">Cambio de Talla sin Fricción</h4>
            <p className="text-xs text-gray-400">¿No le quedó la talla a tu hijo? Te la cambiamos en el siguiente entrenamiento.</p>
          </div>
        </div>

        {/* 3. MODAL GUÍA INTERACTIVA DE TALLAS */}
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-xl rounded-3xl bg-[#0B1E38] border-2 border-[#F29A2E]/50 p-8 shadow-2xl">
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#071426] transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#F29A2E]/20 text-[#F29A2E] flex items-center justify-center">
                  <Ruler size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold uppercase text-white">Guía Oficial de Tallas</h3>
                  <span className="text-xs font-mono text-gray-400">Medidas exactas en centímetros (cm)</span>
                </div>
              </div>

              {/* Tabla de medidas */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-xs font-sans text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/20 text-[#F29A2E] font-mono uppercase">
                      <th className="py-3 px-3">Talla</th>
                      <th className="py-3 px-3">Pecho (cm)</th>
                      <th className="py-3 px-3">Largo (cm)</th>
                      <th className="py-3 px-3">Hombro a Hombro</th>
                      <th className="py-3 px-3">Estatura Sugerida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-gray-300">
                    <tr className="hover:bg-white/5">
                      <td className="py-3 px-3 font-bold text-white">XS (Infantil)</td>
                      <td className="py-3 px-3">84 - 88</td>
                      <td className="py-3 px-3">63</td>
                      <td className="py-3 px-3">38 cm</td>
                      <td className="py-3 px-3">1.40 - 1.52 m</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="py-3 px-3 font-bold text-white">S (Juvenil)</td>
                      <td className="py-3 px-3">89 - 94</td>
                      <td className="py-3 px-3">66</td>
                      <td className="py-3 px-3">41 cm</td>
                      <td className="py-3 px-3">1.53 - 1.65 m</td>
                    </tr>
                    <tr className="hover:bg-white/5 bg-[#F29A2E]/10 font-medium">
                      <td className="py-3 px-3 font-bold text-[#F29A2E]">M (Estándar)</td>
                      <td className="py-3 px-3 text-white">95 - 100</td>
                      <td className="py-3 px-3 text-white">69</td>
                      <td className="py-3 px-3 text-white">44 cm</td>
                      <td className="py-3 px-3 text-white">1.66 - 1.76 m</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="py-3 px-3 font-bold text-white">L (Grande)</td>
                      <td className="py-3 px-3">101 - 106</td>
                      <td className="py-3 px-3">72</td>
                      <td className="py-3 px-3">47 cm</td>
                      <td className="py-3 px-3">1.77 - 1.86 m</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="py-3 px-3 font-bold text-white">XL (Extra)</td>
                      <td className="py-3 px-3">107 - 114</td>
                      <td className="py-3 px-3">75</td>
                      <td className="py-3 px-3">50 cm</td>
                      <td className="py-3 px-3">1.87 m +</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-white/5 text-xs text-gray-300 font-sans flex items-center gap-2">
                <Sparkles size={16} className="text-[#F29A2E] shrink-0" />
                <span>¿Duda entre dos tallas? Recomendamos elegir la superior para permitir mayor libertad de remate y bloqueo.</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. MODAL DE PAGO DIRECTO (Pasarelas Colombianas: Wompi, Nequi, PSE, Bold) */}
        {isDirectCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#0B1E38] border-2 border-[#F29A2E]/60 p-8 shadow-2xl">
              <button
                onClick={() => {
                  setIsDirectCheckoutOpen(false);
                  setPaymentStep("methods");
                }}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#071426] transition-colors"
              >
                <X size={20} />
              </button>

              {paymentStep === "methods" && (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/30 text-[#F29A2E] text-[10px] uppercase font-mono font-bold mb-3">
                    <CreditCard size={12} />
                    <span>Pasarela Segura Colombia</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold uppercase text-white mb-2">
                    Pago Directo Inmediato
                  </h3>
                  <p className="text-xs text-gray-300 font-sans mb-6">
                    Total a pagar: <strong className="text-[#F29A2E] text-base">$95.000 COP</strong> (Camiseta Talla {selectedSize})
                  </p>

                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => setPaymentStep("nequi")}
                      className="w-full p-4 rounded-2xl bg-white/[0.04] hover:bg-[#F29A2E]/15 border border-white/10 hover:border-[#F29A2E]/50 flex items-center justify-between transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#20003c] flex items-center justify-center font-bold text-white font-mono text-sm">
                          N
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white group-hover:text-[#F29A2E]">Nequi / Llave Bancolombia</h4>
                          <span className="text-[11px] text-gray-400 font-sans">Pago al número 312 845 9210</span>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-[#F29A2E]" />
                    </button>

                    <button
                      onClick={() => setPaymentStep("pse")}
                      className="w-full p-4 rounded-2xl bg-white/[0.04] hover:bg-[#F29A2E]/15 border border-white/10 hover:border-[#F29A2E]/50 flex items-center justify-between transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#004481] flex items-center justify-center font-bold text-white font-mono text-xs">
                          PSE
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white group-hover:text-[#F29A2E]">PSE / Wompi / Bold</h4>
                          <span className="text-[11px] text-gray-400 font-sans">Débito desde cualquier banco de Colombia</span>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-[#F29A2E]" />
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/573128459210?text=Hola,%20deseo%20comprar%20la%20Camiseta%20Oficial%20Personalizada%20Talla%20${selectedSize}%20con%20Dorsal%20${customDorsal}%20Nombre%20${customName || "Sin Nombre"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#071426] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <span>O prefiero pagar coordinando por WhatsApp</span>
                  </a>
                </div>
              )}

              {paymentStep === "nequi" && (
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#20003c] text-[#F29A2E] flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                    N
                  </div>
                  <h3 className="text-xl font-heading font-bold uppercase text-white mb-1">Transferencia Nequi Directa</h3>
                  <p className="text-xs text-gray-300 mb-4">Escanea el código QR o transfiere al número registrado del Club:</p>

                  <div className="p-6 rounded-2xl bg-white text-[#071426] inline-block mb-4 shadow-lg">
                    <QrCode size={130} className="mx-auto" />
                    <div className="text-center font-mono font-bold text-xs mt-2 text-gray-800">
                      312 845 9210
                    </div>
                  </div>

                  <div className="text-xs font-mono text-gray-300 mb-6 bg-white/5 p-3 rounded-xl">
                    <span>Titular: <strong>Club Deportivo Voley Zúñiga</strong></span><br />
                    <span>Valor Exacto: <strong>$95.000 COP</strong></span>
                  </div>

                  <button
                    onClick={() => {
                      const msg = `He realizado la transferencia Nequi de $95.000 por la Camiseta Oficial Talla ${selectedSize} (Dorsal ${customDorsal}, Nombre ${customName}). Adjunto soporte de pago.`;
                      window.open(`https://wa.me/573128459210?text=${encodeURIComponent(msg)}`, "_blank");
                      setIsDirectCheckoutOpen(false);
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#F29A2E] hover:bg-white text-[#071426] font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Ya transferí • Notificar Soporte por WhatsApp
                  </button>
                </div>
              )}

              {paymentStep === "pse" && (
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#004481] text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                    PSE
                  </div>
                  <h3 className="text-xl font-heading font-bold uppercase text-white mb-2">Pasarela Wompi / PSE</h3>
                  <p className="text-xs text-gray-300 mb-6">
                    Se generará un enlace oficial de pago cifrado por Wompi Bancolombia para pagar con cualquier cuenta de ahorros o tarjeta débito/crédito.
                  </p>

                  <button
                    onClick={() => {
                      const msg = `Hola, por favor generen mi link de PSE / Wompi para pagar $95.000 COP correspondientes a la Camiseta Oficial Talla ${selectedSize}.`;
                      window.open(`https://wa.me/573128459210?text=${encodeURIComponent(msg)}`, "_blank");
                      setIsDirectCheckoutOpen(false);
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#F29A2E] hover:bg-white text-[#071426] font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Generar Link de PSE Inmediato
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
