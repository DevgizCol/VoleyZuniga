"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { whatsappUrl } from "@/config/site";
import { cop } from "@/data/products";
import { useCart } from "@/context/CartContext";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape cierra, Tab no se sale del panel, se bloquea el scroll de fondo
  // y al cerrar el foco vuelve al botón que abrió el carrito.
  useEffect(() => {
    if (!isCartOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    let message = "Hola, me gustaría comprar los siguientes artículos:\n\n";
    items.forEach((item) => {
      message += `- ${item.quantity}x ${item.name} (${cop(item.price)})\n`;
    });
    message += `\nTotal: ${cop(cartTotal)}\n\nPor favor envíenme los pasos de pago.`;

    window.open(whatsappUrl(message), "_blank", "noopener");
  };

  return (
    <>
      {/* Fondo */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#071426] border-l border-white/10 z-50 flex flex-col shadow-2xl transform transition-transform duration-300"
      >

        {/* Encabezado */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#F29A2E]" aria-hidden="true" />
            <h2 id="cart-title" className="text-3xl font-black font-heading text-white uppercase">
              Tu pedido
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#F29A2E] hover:text-[#071426] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Productos */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
              <ShoppingBag size={48} className="mb-4 opacity-20" aria-hidden="true" />
              <p className="text-lg">Tu carrito está vacío</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 h-11 px-6 border border-white/25 rounded-md hover:border-white transition-colors"
              >
                Seguir viendo productos
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 relative group">
                  <div className="w-20 h-20 rounded-lg bg-[#0B1E38] overflow-hidden relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-semibold text-white text-base leading-snug pr-6 line-clamp-2">{item.name}</h3>
                      <p className="text-[#F29A2E] font-medium mt-1">{cop(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Cantidad */}
                      <div className="flex items-center bg-black/30 rounded-full border border-white/10" role="group" aria-label={`Cantidad de ${item.name}`}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={item.quantity === 1 ? `Quitar ${item.name}` : "Quitar una unidad"}
                          className="w-8 h-8 flex items-center justify-center hover:text-[#F29A2E] transition-colors"
                        >-</button>
                        <span className="w-6 text-center font-medium text-sm" aria-live="polite">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Agregar una unidad"
                          className="w-8 h-8 flex items-center justify-center hover:text-[#F29A2E] transition-colors"
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 text-white/40 hover:text-red-500 transition-colors"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Total */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#071426] flex flex-col gap-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-white/70">Total</span>
              <span className="font-black text-white text-3xl font-heading tabular-nums">
                {cop(cartTotal)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full h-14 rounded-md bg-[#25D366] hover:brightness-110 text-[#071426] font-bold text-lg transition-all"
            >
              Enviar pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
