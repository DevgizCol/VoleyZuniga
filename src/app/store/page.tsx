"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Sparkles, Check, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function StorePage() {
  const { addToCart } = useCart();

  // Customizer State for Featured Jersey
  const [selectedSize, setSelectedSize] = useState("M");
  const [customName, setCustomName] = useState("");
  const [customDorsal, setCustomDorsal] = useState("10");

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
      desc: "Bordado frontal en 3D con vicera plana y malla transpirable trasera."
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

        {/* 1. Destacado: Personalizador de Camiseta Oficial */}
        <div className="mb-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0B1E38] via-[#071426] to-[#040C18] border border-[#F29A2E]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Visualizador Camiseta (Col 5) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-[#0F284B] to-[#071426] border border-white/10 p-6 flex flex-col justify-between items-center shadow-xl">
                <div className="w-full flex justify-between items-center z-10">
                  <span className="px-3 py-1 rounded-full bg-[#F29A2E]/20 border border-[#F29A2E]/30 text-[#F29A2E] font-mono text-[10px] font-bold uppercase">
                    Personalización en Vivo
                  </span>
                  <span className="font-mono text-xs text-gray-400">Talla: {selectedSize}</span>
                </div>

                {/* Vista del Dorsal y Nombre en la Espalda */}
                <div className="text-center z-10 my-auto">
                  <div className="text-xs uppercase font-mono tracking-[0.3em] text-white font-bold mb-2">
                    {customName || "TU APELLIDO"}
                  </div>
                  <div className="text-8xl font-heading font-bold text-[#F29A2E] drop-shadow-[0_10px_20px_rgba(242,154,46,0.4)]">
                    {customDorsal || "10"}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mt-2">
                    CLUB VOLEY ZÚÑIGA
                  </div>
                </div>

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

              {/* Selector de Tallas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  1. Selecciona tu Talla:
                </label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl font-heading font-bold text-sm transition-all ${
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

              {/* Botón de Compra */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleAddCustomJersey}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] font-bold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_30px_rgba(242,154,46,0.3)] hover:shadow-[0_0_40px_rgba(242,154,46,0.5)] active:scale-95 transition-all"
                >
                  <ShoppingBag size={18} />
                  <span>Añadir Camiseta Personalizada al Carrito</span>
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
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-[#F29A2E] text-white hover:text-[#071426] transition-colors rounded-xl font-bold uppercase text-xs tracking-wider"
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

      </div>
    </div>
  );
}

